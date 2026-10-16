"""Real Manifest and AST Parser for local Python repositories."""

import ast
import os
import re
import sys
import tomllib
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

from packaging.requirements import InvalidRequirement, Requirement

from exit_capsule.models import (
    DependencyManifest,
    DependencyRequirement,
    ImportOccurrence,
    ScanResult,
)

# Standard library module names (Python 3.10+)
STDLIB_MODULES: Set[str] = set(sys.stdlib_module_names) | {
    "builtins",
    "__future__",
    "_thread",
    "sys",
    "_io",
    "winreg",
    "posix",
    "nt",
    "msvcrt",
}

# Directories to ignore during scanning
IGNORED_DIRS: Set[str] = {
    ".git",
    "__pycache__",
    ".venv",
    "venv",
    "env",
    ".env",
    ".tox",
    "build",
    "dist",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    "node_modules",
    ".eggs",
    "site-packages",
}

# Mapping of known PyPI package names to their top-level import module names
PYPI_TO_IMPORT_MAP: Dict[str, List[str]] = {
    "pyyaml": ["yaml"],
    "pillow": ["PIL"],
    "scikit-learn": ["sklearn"],
    "beautifulsoup4": ["bs4"],
    "python-dateutil": ["dateutil"],
    "python-dotenv": ["dotenv"],
    "opencv-python": ["cv2"],
    "opencv-python-headless": ["cv2"],
    "google-genai": ["google"],
    "google-generativeai": ["google"],
    "google-api-python-client": ["googleapiclient"],
    "protobuf": ["google"],
    "typing-extensions": ["typing_extensions"],
    "pydantic-core": ["pydantic_core"],
    "attrs": ["attr", "attrs"],
    "paho-mqtt": ["paho"],
    "jinja2": ["jinja2"],
    "pyjwt": ["jwt"],
    "psycopg2-binary": ["psycopg2"],
    "mysql-connector-python": ["mysql"],
    "dnspython": ["dns"],
    "pyzmq": ["zmq"],
    "msgpack-python": ["msgpack"],
    "apache-airflow": ["airflow"],
    "setuptools": ["setuptools", "pkg_resources"],
    "rich": ["rich"],
    "typer": ["typer"],
    "pytest": ["pytest"],
    "pydantic": ["pydantic"],
    "httpx": ["httpx"],
    "requests": ["requests"],
}

# Reverse mapping: import module name -> possible PyPI package names
IMPORT_TO_PYPI_MAP: Dict[str, List[str]] = {}
for pypi_pkg, imp_list in PYPI_TO_IMPORT_MAP.items():
    for imp in imp_list:
        IMPORT_TO_PYPI_MAP.setdefault(imp.lower(), []).append(pypi_pkg.lower())


def normalize_package_name(name: str) -> str:
    """Normalize a package name according to PEP 503."""
    return re.sub(r"[-_.]+", "-", name).lower()


class ManifestParser:
    """Parses actual requirements.txt, pyproject.toml, and setup.py files."""

    def __init__(self, repo_path: Path):
        self.repo_path = repo_path.resolve()

    def discover_and_parse(self) -> List[DependencyManifest]:
        """Find and parse all manifest files in the repository."""
        manifests: List[DependencyManifest] = []

        # 1. requirements*.txt files
        for req_file in self._find_requirements_files():
            manifest = self.parse_requirements_file(req_file)
            if manifest:
                manifests.append(manifest)

        # 2. pyproject.toml
        pyproject_file = self.repo_path / "pyproject.toml"
        if pyproject_file.is_file():
            manifest = self.parse_pyproject_toml(pyproject_file)
            if manifest:
                manifests.append(manifest)

        # 3. setup.py
        setup_file = self.repo_path / "setup.py"
        if setup_file.is_file():
            manifest = self.parse_setup_py(setup_file)
            if manifest:
                manifests.append(manifest)

        return manifests

    def _find_requirements_files(self) -> List[Path]:
        """Find requirements.txt and related files."""
        found: List[Path] = []
        for root, dirs, files in os.walk(self.repo_path):
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
            for file in files:
                file_lower = file.lower()
                if (
                    file_lower == "requirements.txt"
                    or file_lower.startswith("requirements-")
                    or file_lower.endswith("-requirements.txt")
                    or file_lower.endswith(".requirements.txt")
                ):
                    found.append(Path(root) / file)
                elif Path(root).name == "requirements" and file_lower.endswith(".txt"):
                    found.append(Path(root) / file)
        return sorted(found)

    def parse_requirements_file(self, file_path: Path) -> Optional[DependencyManifest]:
        """Parse a real requirements.txt file."""
        if not file_path.is_file():
            return None

        try:
            content = file_path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            return None

        requirements: List[DependencyRequirement] = []
        is_dev_file = any(kw in file_path.name.lower() for kw in ["dev", "test", "lint"])

        for line_raw in content.splitlines():
            line = line_raw.strip()
            # Remove comments and flags
            if not line or line.startswith("#"):
                continue
            if line.startswith(("-r", "--requirement", "-f", "--find-links", "-i", "--index-url", "--extra-index-url")):
                continue

            # Strip inline comments
            line = line.split("#")[0].strip()
            if not line:
                continue

            try:
                parsed_req = Requirement(line)
                name = normalize_package_name(parsed_req.name)
                spec = str(parsed_req.specifier)
                requirements.append(
                    DependencyRequirement(
                        name=name,
                        raw_spec=line,
                        version_constraint=spec,
                        manifest_file=str(file_path.relative_to(self.repo_path)),
                        is_dev=is_dev_file,
                    )
                )
            except InvalidRequirement:
                # Fallback for complex lines or direct URLs
                match = re.match(r"^([a-zA-Z0-9_\-\.]+)(.*)$", line)
                if match:
                    pkg_name = normalize_package_name(match.group(1))
                    constraint = match.group(2).strip()
                    requirements.append(
                        DependencyRequirement(
                            name=pkg_name,
                            raw_spec=line,
                            version_constraint=constraint,
                            manifest_file=str(file_path.relative_to(self.repo_path)),
                            is_dev=is_dev_file,
                        )
                    )

        return DependencyManifest(
            manifest_type="requirements.txt",
            file_path=file_path,
            requirements=requirements,
            raw_content=content,
        )

    def parse_pyproject_toml(self, file_path: Path) -> Optional[DependencyManifest]:
        """Parse pyproject.toml supporting PEP 621, Poetry, and Flit."""
        if not file_path.is_file():
            return None

        try:
            content = file_path.read_text(encoding="utf-8", errors="replace")
            data = tomllib.loads(content)
        except Exception:
            return None

        requirements: List[DependencyRequirement] = []
        rel_path = str(file_path.relative_to(self.repo_path))

        # 1. PEP 621: [project.dependencies]
        project = data.get("project", {})
        for dep in project.get("dependencies", []):
            try:
                parsed_req = Requirement(dep)
                requirements.append(
                    DependencyRequirement(
                        name=normalize_package_name(parsed_req.name),
                        raw_spec=dep,
                        version_constraint=str(parsed_req.specifier),
                        manifest_file=rel_path,
                        is_dev=False,
                    )
                )
            except InvalidRequirement:
                match = re.match(r"^([a-zA-Z0-9_\-\.]+)(.*)$", dep)
                if match:
                    requirements.append(
                        DependencyRequirement(
                            name=normalize_package_name(match.group(1)),
                            raw_spec=dep,
                            version_constraint=match.group(2).strip(),
                            manifest_file=rel_path,
                            is_dev=False,
                        )
                    )

        # 2. PEP 621: [project.optional-dependencies]
        optional_deps = project.get("optional-dependencies", {})
        for group, group_deps in optional_deps.items():
            is_dev = any(k in group.lower() for k in ["dev", "test", "lint"])
            for dep in group_deps:
                try:
                    parsed_req = Requirement(dep)
                    requirements.append(
                        DependencyRequirement(
                            name=normalize_package_name(parsed_req.name),
                            raw_spec=f"{dep} (extra: {group})",
                            version_constraint=str(parsed_req.specifier),
                            manifest_file=rel_path,
                            is_dev=is_dev,
                        )
                    )
                except InvalidRequirement:
                    pass

        # 3. Poetry: [tool.poetry.dependencies]
        tool_poetry = data.get("tool", {}).get("poetry", {})
        poetry_deps = tool_poetry.get("dependencies", {})
        for pkg, spec in poetry_deps.items():
            if pkg.lower() == "python":
                continue
            v_str = spec if isinstance(spec, str) else spec.get("version", "") if isinstance(spec, dict) else ""
            requirements.append(
                DependencyRequirement(
                    name=normalize_package_name(pkg),
                    raw_spec=f"{pkg} = {spec}",
                    version_constraint=str(v_str),
                    manifest_file=rel_path,
                    is_dev=False,
                )
            )

        # Poetry groups: [tool.poetry.group.<group>.dependencies]
        poetry_groups = tool_poetry.get("group", {})
        for group_name, group_data in poetry_groups.items():
            group_deps = group_data.get("dependencies", {})
            is_dev = any(k in group_name.lower() for k in ["dev", "test", "lint"])
            for pkg, spec in group_deps.items():
                if pkg.lower() == "python":
                    continue
                v_str = spec if isinstance(spec, str) else spec.get("version", "") if isinstance(spec, dict) else ""
                requirements.append(
                    DependencyRequirement(
                        name=normalize_package_name(pkg),
                        raw_spec=f"{pkg} = {spec} (group: {group_name})",
                        version_constraint=str(v_str),
                        manifest_file=rel_path,
                        is_dev=is_dev,
                    )
                )

        return DependencyManifest(
            manifest_type="pyproject.toml",
            file_path=file_path,
            requirements=requirements,
            raw_content=content,
        )

    def parse_setup_py(self, file_path: Path) -> Optional[DependencyManifest]:
        """Parse setup.py using AST analysis to extract install_requires and extras_require."""
        if not file_path.is_file():
            return None

        try:
            content = file_path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            return None

        requirements: List[DependencyRequirement] = []
        rel_path = str(file_path.relative_to(self.repo_path))

        try:
            tree = ast.parse(content, filename=str(file_path))
            for node in ast.walk(tree):
                if isinstance(node, ast.Call):
                    # Check for setup(...)
                    func = node.func
                    func_name = getattr(func, "id", None) or getattr(func, "attr", None)
                    if func_name == "setup":
                        for keyword in node.keywords:
                            # install_requires
                            if keyword.arg == "install_requires" and isinstance(keyword.value, (ast.List, ast.Tuple)):
                                for elt in keyword.value.elts:
                                    if isinstance(elt, ast.Constant) and isinstance(elt.value, str):
                                        self._add_requirement_string(elt.value, rel_path, is_dev=False, req_list=requirements)
                            # extras_require
                            elif keyword.arg == "extras_require" and isinstance(keyword.value, ast.Dict):
                                for key_node, val_node in zip(keyword.value.keys, keyword.value.values):
                                    group_name = key_node.value if isinstance(key_node, ast.Constant) else "extra"
                                    is_dev = any(k in str(group_name).lower() for k in ["dev", "test", "lint"])
                                    if isinstance(val_node, (ast.List, ast.Tuple)):
                                        for elt in val_node.elts:
                                            if isinstance(elt, ast.Constant) and isinstance(elt.value, str):
                                                self._add_requirement_string(elt.value, rel_path, is_dev=is_dev, req_list=requirements)
        except Exception:
            # Fallback regex if AST parsing fails or setup is wrapped
            pass

        if not requirements:
            # Fallback regex search for install_requires = [...]
            match = re.search(r"install_requires\s*=\s*\[(.*?)\]", content, re.DOTALL)
            if match:
                raw_list = match.group(1)
                for item in re.findall(r"['\"]([^'\"]+)['\"]", raw_list):
                    self._add_requirement_string(item, rel_path, is_dev=False, req_list=requirements)

        return DependencyManifest(
            manifest_type="setup.py",
            file_path=file_path,
            requirements=requirements,
            raw_content=content,
        )

    def _add_requirement_string(
        self, spec_str: str, manifest_path: str, is_dev: bool, req_list: List[DependencyRequirement]
    ) -> None:
        try:
            parsed = Requirement(spec_str)
            req_list.append(
                DependencyRequirement(
                    name=normalize_package_name(parsed.name),
                    raw_spec=spec_str,
                    version_constraint=str(parsed.specifier),
                    manifest_file=manifest_path,
                    is_dev=is_dev,
                )
            )
        except InvalidRequirement:
            match = re.match(r"^([a-zA-Z0-9_\-\.]+)(.*)$", spec_str)
            if match:
                req_list.append(
                    DependencyRequirement(
                        name=normalize_package_name(match.group(1)),
                        raw_spec=spec_str,
                        version_constraint=match.group(2).strip(),
                        manifest_file=manifest_path,
                        is_dev=is_dev,
                    )
                )


class RepoASTScanner:
    """Walks all real .py files in a repository and extracts AST imports."""

    def __init__(self, repo_path: Path):
        self.repo_path = repo_path.resolve()
        self.local_modules: Set[str] = self._detect_local_modules()

    def _detect_local_modules(self) -> Set[str]:
        """Detect root-level modules and packages in the target repository."""
        local = set()
        if not self.repo_path.exists():
            return local

        for entry in self.repo_path.iterdir():
            if entry.name in IGNORED_DIRS or entry.name.startswith("."):
                continue
            if entry.is_file() and entry.suffix == ".py":
                local.add(entry.stem)
            elif entry.is_dir():
                # Directory containing __init__.py or any .py file
                if any(entry.glob("*.py")):
                    local.add(entry.name)

        # Also check 'src' directory if it exists
        src_dir = self.repo_path / "src"
        if src_dir.is_dir():
            for entry in src_dir.iterdir():
                if entry.name in IGNORED_DIRS or entry.name.startswith("."):
                    continue
                if entry.is_file() and entry.suffix == ".py":
                    local.add(entry.stem)
                elif entry.is_dir() and any(entry.glob("*.py")):
                    local.add(entry.name)

        return local

    def find_python_files(self) -> List[Path]:
        """Collect all .py files in the repository, excluding ignored directories."""
        py_files: List[Path] = []
        for root, dirs, files in os.walk(self.repo_path):
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and not d.startswith(".")]
            for file in files:
                if file.endswith(".py"):
                    py_files.append(Path(root) / file)
        return sorted(py_files)

    def scan_file(self, file_path: Path) -> Tuple[List[ImportOccurrence], Optional[Dict[str, str]]]:
        """Parse a single Python file using AST and extract all import statements."""
        occurrences: List[ImportOccurrence] = []
        syntax_err = None

        try:
            source = file_path.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            return occurrences, {"file": str(file_path), "error": f"Read error: {e}", "lineno": "0"}

        lines = source.splitlines()

        try:
            tree = ast.parse(source, filename=str(file_path))
        except SyntaxError as se:
            syntax_err = {
                "file": str(file_path.relative_to(self.repo_path)),
                "error": se.msg,
                "lineno": str(se.lineno or 0),
            }
            return occurrences, syntax_err

        rel_path_str = str(file_path.relative_to(self.repo_path))

        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    full_module = alias.name
                    top_pkg = full_module.split(".")[0]
                    snippet = lines[node.lineno - 1].strip() if 0 < node.lineno <= len(lines) else None
                    occurrences.append(
                        ImportOccurrence(
                            file_path=file_path,
                            relative_path=rel_path_str,
                            line_number=node.lineno,
                            module=full_module,
                            top_level_package=top_pkg,
                            alias=alias.asname,
                            is_from_import=False,
                            imported_names=[alias.name],
                            code_snippet=snippet,
                        )
                    )

            elif isinstance(node, ast.ImportFrom):
                # Relative import (e.g. from .foo import bar)
                if node.level and node.level > 0:
                    continue

                if node.module:
                    full_module = node.module
                    top_pkg = full_module.split(".")[0]
                    imported_names = [a.name for a in node.names]
                    snippet = lines[node.lineno - 1].strip() if 0 < node.lineno <= len(lines) else None
                    occurrences.append(
                        ImportOccurrence(
                            file_path=file_path,
                            relative_path=rel_path_str,
                            line_number=node.lineno,
                            module=full_module,
                            top_level_package=top_pkg,
                            alias=None,
                            is_from_import=True,
                            imported_names=imported_names,
                            code_snippet=snippet,
                        )
                    )

        return occurrences, None


class RepoScanner:
    """Orchestrates real manifest discovery and AST import analysis."""

    def __init__(self, repo_path: Path):
        self.repo_path = repo_path.resolve()
        self.manifest_parser = ManifestParser(self.repo_path)
        self.ast_scanner = RepoASTScanner(self.repo_path)

    def scan(self) -> ScanResult:
        """Perform full real scan of manifests and AST imports."""
        # 1. Parse manifests
        manifests = self.manifest_parser.discover_and_parse()
        declared_deps: Dict[str, DependencyRequirement] = {}
        for m in manifests:
            for req in m.requirements:
                # Store normalized package name
                if req.name not in declared_deps:
                    declared_deps[req.name] = req

        # 2. Parse AST imports from all python files
        py_files = self.ast_scanner.find_python_files()
        all_imports: List[ImportOccurrence] = []
        syntax_errors: List[Dict[str, str]] = []
        package_to_imports: Dict[str, List[ImportOccurrence]] = {}

        for py_file in py_files:
            occurrences, err = self.ast_scanner.scan_file(py_file)
            if err:
                syntax_errors.append(err)
            for occ in occurrences:
                all_imports.append(occ)
                top_pkg_norm = normalize_package_name(occ.top_level_package)
                package_to_imports.setdefault(top_pkg_norm, []).append(occ)

        # 3. Classify dependencies
        local_modules = {normalize_package_name(m) for m in self.ast_scanner.local_modules}
        stdlib_packages = {normalize_package_name(s) for s in STDLIB_MODULES}

        # Match declared dependencies with AST usages
        used_declared: List[str] = []
        unused_deps: List[str] = []

        for decl_name in declared_deps.keys():
            # Check direct match
            is_used = decl_name in package_to_imports

            # Check PyPI known aliases (e.g. pyyaml -> yaml)
            if not is_used and decl_name in PYPI_TO_IMPORT_MAP:
                for alias in PYPI_TO_IMPORT_MAP[decl_name]:
                    if normalize_package_name(alias) in package_to_imports:
                        is_used = True
                        break

            # Check normalized variations (e.g. replacing '-' with '_')
            if not is_used:
                alt_name = decl_name.replace("-", "_")
                if alt_name in package_to_imports:
                    is_used = True

            if is_used:
                used_declared.append(decl_name)
            else:
                unused_deps.append(decl_name)

        # Find undeclared third-party dependencies used in AST
        undeclared_deps: List[str] = []
        for imported_pkg in package_to_imports.keys():
            # Skip stdlib and local modules
            if imported_pkg in stdlib_packages or imported_pkg in local_modules:
                continue

            # Check if this import maps to any declared dependency
            is_declared = (
                imported_pkg in declared_deps
                or imported_pkg.replace("_", "-") in declared_deps
            )

            # Check PyPI reverse mapping (e.g., imported 'yaml' -> 'pyyaml')
            if not is_declared and imported_pkg in IMPORT_TO_PYPI_MAP:
                for pypi_candidate in IMPORT_TO_PYPI_MAP[imported_pkg]:
                    if normalize_package_name(pypi_candidate) in declared_deps:
                        is_declared = True
                        break

            if not is_declared:
                undeclared_deps.append(imported_pkg)

        return ScanResult(
            repo_path=self.repo_path,
            manifests=manifests,
            declared_dependencies=declared_deps,
            ast_imports=all_imports,
            package_to_imports=package_to_imports,
            scanned_python_files=py_files,
            syntax_errors=syntax_errors,
            standard_library_packages=stdlib_packages,
            local_project_modules=local_modules,
            used_declared_dependencies=sorted(used_declared),
            unused_dependencies=sorted(unused_deps),
            undeclared_dependencies=sorted(undeclared_deps),
        )
