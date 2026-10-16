"""Real AI Orchestrator and Markdown Capsule Generator."""

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv

from exit_capsule.models import (
    AIAnalysisResult,
    ExitCapsuleReport,
    ScanResult,
    TestRunResult,
)

# Comprehensive local migration knowledge base for Python ecosystem modernization
LOCAL_MIGRATION_KNOWLEDGE: Dict[str, Dict[str, Any]] = {
    "requests": {
        "replacement": "httpx",
        "category": "HTTP Client",
        "risk": "Low",
        "reason": "httpx offers a 99% requests-compatible API with native async/await support, HTTP/2, and type hints.",
        "migration_steps": [
            "Replace `import requests` with `import httpx`",
            "Update timeout defaults: httpx enforces default timeouts (5s) unlike requests (infinite by default).",
            "If using sessions, replace `requests.Session()` with `httpx.Client()` or `httpx.AsyncClient()`.",
        ],
    },
    "pytz": {
        "replacement": "zoneinfo (Python 3.9+ standard library)",
        "category": "Timezones",
        "risk": "Low",
        "reason": "pytz is legacy and deprecated in favor of PEP 615 zoneinfo, built into Python 3.9+ with zero dependencies.",
        "migration_steps": [
            "Replace `import pytz` with `from zoneinfo import ZoneInfo`",
            "Replace `pytz.timezone('UTC')` with `ZoneInfo('UTC')`",
            "Remove pytz from requirements.txt / pyproject.toml",
        ],
    },
    "marshmallow": {
        "replacement": "pydantic (v2)",
        "category": "Serialization / Validation",
        "risk": "Medium",
        "reason": "pydantic v2 has a Rust-backed core (pydantic-core) providing 5-50x faster validation and native Python type hint integration.",
        "migration_steps": [
            "Define schemas as subclasses of `pydantic.BaseModel` instead of `marshmallow.Schema`",
            "Use standard Python type annotations for fields instead of `fields.Str()`, `fields.Int()`",
            "Replace `.dump()` and `.load()` with `.model_dump()` and `.model_validate()`",
        ],
    },
    "simplejson": {
        "replacement": "json (standard library)",
        "category": "Data Serialization",
        "risk": "Low",
        "reason": "Python's standard library `json` module is built-in and highly optimized in modern CPython.",
        "migration_steps": [
            "Replace `import simplejson as json` with `import json`",
            "Remove simplejson from project dependencies.",
        ],
    },
    "optparse": {
        "replacement": "typer / argparse",
        "category": "CLI Parsing",
        "risk": "Medium",
        "reason": "optparse was deprecated in Python 3.2. Typer provides modern type-annotated CLI development.",
        "migration_steps": [
            "Migrate command definitions to `typer.Typer()`",
            "Leverage Python type hints for options and arguments.",
        ],
    },
    "distutils": {
        "replacement": "setuptools / packaging",
        "category": "Packaging",
        "risk": "High",
        "reason": "distutils was completely removed in Python 3.12 (PEP 632). Code relying on distutils will crash in Python 3.12+.",
        "migration_steps": [
            "Replace `import distutils` with `import setuptools` or standard packaging tools.",
            "Migrate build configuration to modern `pyproject.toml` (PEP 517/518/621).",
        ],
    },
    "pkg_resources": {
        "replacement": "importlib.metadata / importlib.resources",
        "category": "Packaging / Inspection",
        "risk": "Medium",
        "reason": "pkg_resources is deprecated and known for significant import-time overhead.",
        "migration_steps": [
            "Replace `pkg_resources.get_distribution('pkg').version` with `importlib.metadata.version('pkg')`",
            "Replace `pkg_resources.resource_string` with `importlib.resources.files()`",
        ],
    },
    "nose": {
        "replacement": "pytest",
        "category": "Testing Framework",
        "risk": "Medium",
        "reason": "nose has been unmaintained for many years and does not support modern Python versions.",
        "migration_steps": [
            "Convert nose assertions to standard Python `assert` statements",
            "Run test suite using `pytest`",
        ],
    },
    "flake8": {
        "replacement": "ruff",
        "category": "Linting",
        "risk": "Low",
        "reason": "ruff is an extremely fast linter and formatter written in Rust, replacing flake8, isort, and black.",
        "migration_steps": [
            "Install `ruff` and run `ruff check .`",
            "Configure lint rules in `pyproject.toml` under `[tool.ruff]`.",
        ],
    },
    "black": {
        "replacement": "ruff format",
        "category": "Formatting",
        "risk": "Low",
        "reason": "ruff format provides drop-in black compatibility with instant execution speeds.",
        "migration_steps": [
            "Run `ruff format .`",
        ],
    },
    "webrtcvad": {
        "replacement": "silero-vad or webrtcvad-wheels",
        "category": "Voice / VAD",
        "risk": "High",
        "reason": "Unmaintained since 2017, no releases or Python constraints.",
        "migration_steps": [
            "Consider silero-vad or webrtcvad-wheels (maintained fork for modern Python).",
        ],
    },
    "pygame": {
        "replacement": "pygame-ce",
        "category": "Audio / Media",
        "risk": "Medium",
        "reason": "Legacy pygame has slow releases; pygame-ce is the actively maintained Community Edition.",
        "migration_steps": [
            "Replace `pip install pygame` with `pip install pygame-ce`.",
        ],
    },
    "pytesseract": {
        "replacement": "rapidocr or paddleocr",
        "category": "OCR",
        "risk": "Medium",
        "reason": "External binary dependency wrapper; rapidocr/paddleocr offer pure Python or ONNX solutions.",
        "migration_steps": [
            "Evaluate rapidocr-onnxruntime for zero external binary requirements.",
        ],
    },
    "html2text": {
        "replacement": "markdownify or html.parser",
        "category": "HTML / Markdown",
        "risk": "Low",
        "reason": "html2text has stale releases; markdownify is modern and actively maintained.",
        "migration_steps": [
            "Migrate conversion calls to `markdownify.markdownify()`.",
        ],
    },
    "pynput": {
        "replacement": "pynput (pinned with requires_python) or keyboard",
        "category": "System / Hotkeys",
        "risk": "Low",
        "reason": "Requires proper Python compatibility bounds on modern systems.",
        "migration_steps": [
            "Add Python constraints or verify cross-platform display server permissions.",
        ],
    },
}


class AgentOrchestrator:
    """Orchestrates AI-driven dependency analysis and compiles the Exit Capsule Report."""

    def __init__(
        self,
        repo_path: Path,
        api_key: Optional[str] = None,
        model_name: str = "gemini-2.5-flash",
    ):
        self.repo_path = repo_path.resolve()
        self.model_name = model_name
        self.api_key = self._resolve_api_key(api_key)

    def _resolve_api_key(self, cli_key: Optional[str]) -> Optional[str]:
        """Resolve Gemini API key from CLI argument, environment, or .env files."""
        if cli_key:
            return cli_key.strip()

        # Load environment variables from current directory and repo directory
        load_dotenv()
        repo_env = self.repo_path / ".env"
        if repo_env.is_file():
            load_dotenv(repo_env)

        return os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

    def run_ai_analysis(
        self,
        scan_result: ScanResult,
        test_result: Optional[TestRunResult] = None,
    ) -> AIAnalysisResult:
        """Run AI migration analysis using Google GenAI SDK, or local rule engine fallback."""
        if self.api_key:
            try:
                return self._call_gemini_api(scan_result, test_result)
            except Exception as e:
                # If Gemini API call fails (network, quota, invalid key), fallback gracefully
                fallback_res = self._run_local_rules(scan_result, test_result)
                fallback_res.error_message = f"Gemini API request failed: {e}. Defaulted to local rule engine."
                return fallback_res
        else:
            return self._run_local_rules(scan_result, test_result)

    def _call_gemini_api(
        self,
        scan_result: ScanResult,
        test_result: Optional[TestRunResult],
    ) -> AIAnalysisResult:
        """Execute real Gemini API call using google-genai SDK."""
        from google import genai

        client = genai.Client(api_key=self.api_key)

        prompt = self._build_gemini_prompt(scan_result, test_result)
        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )

        response_text = response.text or ""

        return AIAnalysisResult(
            model_used=self.model_name,
            source="gemini_api",
            success=True,
            executive_summary="AI Analysis generated by Gemini model.",
            migration_recommendations=[],
            risk_analysis="",
            exit_roadmap="",
            raw_markdown=response_text,
            error_message=None,
        )

    def _build_gemini_prompt(
        self,
        scan_result: ScanResult,
        test_result: Optional[TestRunResult],
    ) -> str:
        """Construct a structured prompt for Gemini dependency exit analysis."""
        declared_list = [f"- {req.name} (spec: {req.version_constraint or 'any'}) in {req.manifest_file}" for req in scan_result.declared_dependencies.values()]
        declared_text = "\n".join(declared_list) if declared_list else "None detected."

        usages_list = []
        for pkg, occurrences in scan_result.package_to_imports.items():
            files = {occ.relative_path for occ in occurrences}
            usages_list.append(f"- {pkg}: used {len(occurrences)} time(s) across files: {', '.join(sorted(files)[:5])}")
        usages_text = "\n".join(usages_list[:40]) if usages_list else "No third-party AST imports found."

        unused_text = ", ".join(scan_result.unused_dependencies) if scan_result.unused_dependencies else "None"
        undeclared_text = ", ".join(scan_result.undeclared_dependencies) if scan_result.undeclared_dependencies else "None"

        test_info = "Not executed (use --verify flag)."
        if test_result:
            test_info = (
                f"Executed: {test_result.executed}\n"
                f"Exit Code: {test_result.exit_code}\n"
                f"Passed: {test_result.passed}\n"
                f"Summary: {test_result.summary}\n"
                f"Duration: {test_result.duration_seconds:.2f}s\n"
            )
            if test_result.stderr:
                test_info += f"Stderr excerpt:\n{test_result.stderr[:400]}\n"

        return f"""You are the Exit Capsule Agent, an elite Python software architect and dependency modernization expert.
Perform an in-depth Dependency Exit & Modernization Analysis for the following Python repository:

Repository Path: {scan_result.repo_path.name}
Total Scanned Python Files: {len(scan_result.scanned_python_files)}

### Declared Dependencies in Manifests:
{declared_text}

### AST Import Usage:
{usages_text}

### Unused Manifest Dependencies (Declared but not imported in AST):
{unused_text}

### Undeclared Dependencies (Imported in AST but missing from manifests):
{undeclared_text}

### Pytest Verification Suite Results:
{test_info}

Please generate a comprehensive, actionable Markdown report covering:
1. **Executive Assessment & Architecture Health**: High-level verdict on dependency hygiene, technical debt, and risks.
2. **Modernization & Migration Matrix**: For each key dependency, evaluate if it is legacy, deprecated, or has modern replacements (e.g. requests -> httpx, pytz -> zoneinfo, marshmallow -> pydantic, setup.py -> pyproject.toml, etc.). Provide Migration Risk (Low/Medium/High), Replacement, and specific code change examples.
3. **Dead Weight / Bloat Analysis**: Assess the unused dependencies. Are they build/test tools or truly dead code that should be purged?
4. **Missing Manifest Remediations**: Provide exact pin suggestions for undeclared dependencies.
5. **Exit Capsule Migration Roadmap**: Clear 3-phase execution checklist (Phase 1: Quick Wins & Cleanup, Phase 2: Modernization & Replacement, Phase 3: Verification & Lockdown).

Write in clear, authoritative, production-grade technical Markdown.
"""

    def _run_local_rules(
        self,
        scan_result: ScanResult,
        test_result: Optional[TestRunResult],
    ) -> AIAnalysisResult:
        """Generate high-quality rule-based migration recommendations when API key is absent."""
        recommendations = []
        md_lines = []

        md_lines.append("> [!NOTE]")
        md_lines.append("> **Analysis Engine**: Local Rule Engine (Set `GEMINI_API_KEY` for generative Gemini-powered dynamic analysis).")
        md_lines.append("")
        md_lines.append("### 🔍 Dependency Modernization & Exit Matrix")
        md_lines.append("")
        md_lines.append("| Current Dependency | Category | Recommended Replacement | Migration Risk | Primary Rationale |")
        md_lines.append("| :--- | :--- | :--- | :--- | :--- |")

        all_pkgs = set(scan_result.declared_dependencies.keys()) | set(scan_result.package_to_imports.keys())
        found_rules = False

        for pkg in sorted(all_pkgs):
            norm_pkg = pkg.lower().replace("-", "_")
            rule = None
            if pkg in LOCAL_MIGRATION_KNOWLEDGE:
                rule = LOCAL_MIGRATION_KNOWLEDGE[pkg]
            elif norm_pkg in LOCAL_MIGRATION_KNOWLEDGE:
                rule = LOCAL_MIGRATION_KNOWLEDGE[norm_pkg]

            if rule:
                found_rules = True
                recommendations.append({"package": pkg, **rule})
                md_lines.append(
                    f"| `{pkg}` | {rule['category']} | **`{rule['replacement']}`** | `{rule['risk']}` | {rule['reason']} |"
                )

        if not found_rules:
            md_lines.append("| *All dependencies* | General | *Standard Modern Stack* | `Low` | Dependencies appear up-to-date or standard. |")

        md_lines.append("")
        md_lines.append("### 💡 Recommended Migration Steps")
        for rec in recommendations:
            md_lines.append(f"#### Migrating `{rec['package']}` ➜ `{rec['replacement']}`")
            md_lines.append(f"- **Rationale**: {rec['reason']}")
            md_lines.append("- **Actionable Steps**:")
            for step in rec["migration_steps"]:
                md_lines.append(f"  - {step}")
            md_lines.append("")

        # Unused dependencies guidance
        md_lines.append("### 🧹 Dead Weight & Unused Dependency Remediation")
        if scan_result.unused_dependencies:
            md_lines.append("The following declared dependencies were **never imported** in any scanned `.py` file:")
            for u in scan_result.unused_dependencies:
                md_lines.append(f"- ⚠️ **`{u}`**: Verify if used by dynamic imports or test runners. If not, remove from manifest to reduce attack surface and build size.")
        else:
            md_lines.append("✅ No declared dependencies appear unused in AST scanning.")
        md_lines.append("")

        # Undeclared dependencies guidance
        md_lines.append("### ⚠️ Undeclared Dependencies (Missing from Manifest)")
        if scan_result.undeclared_dependencies:
            md_lines.append("The following packages are imported directly by repository code but **not declared** in any manifest:")
            for und in scan_result.undeclared_dependencies:
                md_lines.append(f"- 🔴 **`{und}`**: Add to `pyproject.toml` or `requirements.txt` to prevent runtime `ImportError` in fresh environments.")
        else:
            md_lines.append("✅ All imported third-party packages are declared in project manifests.")
        md_lines.append("")

        # Roadmap
        md_lines.append("### 🗺️ Step-by-Step Exit & Upgrade Roadmap")
        md_lines.append("- [ ] **Phase 1: Cleanup Manifests**")
        if scan_result.unused_dependencies:
            md_lines.append(f"  - Purge unused packages: {', '.join(scan_result.unused_dependencies)}")
        if scan_result.undeclared_dependencies:
            md_lines.append(f"  - Declare missing runtime dependencies: {', '.join(scan_result.undeclared_dependencies)}")
        md_lines.append("- [ ] **Phase 2: Modernization & Replacement**")
        for rec in recommendations:
            md_lines.append(f"  - Replace `{rec['package']}` with `{rec['replacement']}`")
        md_lines.append("- [ ] **Phase 3: Verification**")
        md_lines.append("  - Re-run `exit-capsule scan . --verify` to ensure all tests pass with zero regressions.")

        raw_md = "\n".join(md_lines)

        return AIAnalysisResult(
            model_used="Local Rule Engine",
            source="local_rule_engine",
            success=True,
            executive_summary="Generated using Exit Capsule Local Migration Knowledge Base.",
            migration_recommendations=recommendations,
            risk_analysis="Standard Python ecosystem dependency risk evaluation.",
            exit_roadmap="Three-phase cleanup, migration, and verification plan.",
            raw_markdown=raw_md,
            error_message=None,
        )

    def generate_report(
        self,
        scan_result: ScanResult,
        test_result: Optional[TestRunResult],
        ai_result: AIAnalysisResult,
        output_file: Optional[Path] = None,
    ) -> ExitCapsuleReport:
        """Compile all findings into DEPENDENCY_EXIT_CAPSULE.md inside the target repo."""
        target_file = output_file or (self.repo_path / "DEPENDENCY_EXIT_CAPSULE.md")
        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        content_parts = [
            "# 📦 DEPENDENCY EXIT CAPSULE",
            f"*Generated by Exit Capsule Agent on `{now_iso}`*",
            "",
            "---",
            "",
            "## 1. 📊 Executive Summary",
            "",
            "| Metric | Value | Status |",
            "| :--- | :--- | :--- |",
            f"| **Target Repository** | `{scan_result.repo_path.name}` | Active |",
            f"| **Python Files Scanned** | `{len(scan_result.scanned_python_files)}` | AST parsed |",
            f"| **Discovered Manifests** | `{len(scan_result.manifests)}` | {', '.join(m.manifest_type for m in scan_result.manifests) or 'None'} |",
            f"| **Declared Dependencies** | `{len(scan_result.declared_dependencies)}` | Manifest items |",
            f"| **Active Used Dependencies** | `{len(scan_result.used_declared_dependencies)}` | Confirmed in code |",
            f"| **Unused Dependencies** | `{len(scan_result.unused_dependencies)}` | {'⚠️ Warning' if scan_result.unused_dependencies else '✅ Clean'} |",
            f"| **Undeclared Dependencies** | `{len(scan_result.undeclared_dependencies)}` | {'🔴 Critical' if scan_result.undeclared_dependencies else '✅ Clean'} |",
        ]

        if test_result:
            status_emoji = "✅ Passed" if test_result.passed else "❌ Failed"
            content_parts.append(
                f"| **Pytest Verification** | `{test_result.summary}` | {status_emoji} |"
            )
        else:
            content_parts.append("| **Pytest Verification** | *Skipped (Run with `--verify`)* | ℹ️ Optional |")

        content_parts.extend([
            "",
            "---",
            "",
            "## 2. 📄 Discovered Manifests & Requirements",
            "",
        ])

        if scan_result.manifests:
            for manifest in scan_result.manifests:
                rel_manifest = str(manifest.file_path.relative_to(self.repo_path))
                content_parts.append(f"### Manifest: `{rel_manifest}` ({manifest.manifest_type})")
                if manifest.requirements:
                    content_parts.append("| Package Name | Version Constraint | Type | Raw Specification |")
                    content_parts.append("| :--- | :--- | :--- | :--- |")
                    for req in manifest.requirements:
                        dep_type = "Dev / Extra" if req.is_dev else "Production"
                        constraint = req.version_constraint or "Any"
                        content_parts.append(f"| **`{req.name}`** | `{constraint}` | {dep_type} | `{req.raw_spec}` |")
                else:
                    content_parts.append("*No dependencies declared in this file.*")
                content_parts.append("")
        else:
            content_parts.append("⚠️ *No manifest files (`requirements.txt`, `pyproject.toml`, `setup.py`) were detected.*")
            content_parts.append("")

        content_parts.extend([
            "---",
            "",
            "## 3. 🔍 AST Import Usage Matrix",
            "",
            "Direct code references mapped across all repository `.py` files:",
            "",
        ])

        if scan_result.package_to_imports:
            content_parts.append("| Package / Module | Usages | Type | Sample File Reference & Line Number |")
            content_parts.append("| :--- | :--- | :--- | :--- |")
            for pkg, occurrences in sorted(scan_result.package_to_imports.items(), key=lambda x: len(x[1]), reverse=True):
                count = len(occurrences)
                # Determine classification
                if pkg in scan_result.standard_library_packages:
                    pkg_type = "Standard Library"
                elif pkg in scan_result.local_project_modules:
                    pkg_type = "Local Project"
                elif pkg in scan_result.undeclared_dependencies:
                    pkg_type = "⚠️ Undeclared External"
                else:
                    pkg_type = "Declared Dependency"

                # Sample up to 3 references
                sample_refs = []
                for occ in occurrences[:3]:
                    sample_refs.append(f"`{occ.relative_path}:{occ.line_number}`")
                ref_str = ", ".join(sample_refs)
                if count > 3:
                    ref_str += f" *(+{count - 3} more)*"

                content_parts.append(f"| **`{pkg}`** | `{count}` | {pkg_type} | {ref_str} |")
            content_parts.append("")
        else:
            content_parts.append("*No import statements detected in Python files.*")
            content_parts.append("")

        if scan_result.syntax_errors:
            content_parts.append("### ⚠️ Syntax Warnings")
            content_parts.append("The following files encountered syntax issues during AST parsing:")
            for err in scan_result.syntax_errors:
                content_parts.append(f"- `{err['file']}` (Line {err['lineno']}): {err['error']}")
            content_parts.append("")

        content_parts.extend([
            "---",
            "",
            "## 4. 🧪 Test Suite Verification (Pytest Execution)",
            "",
        ])

        if test_result:
            content_parts.append(f"- **Command Executed**: `{' '.join(test_result.command)}`")
            content_parts.append(f"- **Exit Code**: `{test_result.exit_code}`")
            content_parts.append(f"- **Execution Time**: `{test_result.duration_seconds:.2f}s`")
            content_parts.append(f"- **Overall Outcome**: **{'PASSED' if test_result.passed else 'FAILED'}**")
            content_parts.append("")
            content_parts.append("```text")
            output_combined = (test_result.stdout.strip() + "\n" + test_result.stderr.strip()).strip()
            # Truncate if gigantic
            if len(output_combined) > 4000:
                output_combined = output_combined[:4000] + "\n... [Output truncated for brevity]"
            content_parts.append(output_combined or "No stdout/stderr recorded.")
            content_parts.append("```")
            content_parts.append("")
        else:
            content_parts.append("> [!NOTE]")
            content_parts.append("> Test execution was skipped for this scan. Run with `--verify` to execute pytest against this repository.")
            content_parts.append("")

        content_parts.extend([
            "---",
            "",
            "## 5. 🤖 AI Modernization & Migration Analysis",
            "",
            f"**Model / Engine**: `{ai_result.model_used}` ({ai_result.source})",
            "",
        ])

        if ai_result.error_message:
            content_parts.append(f"> [!WARNING]\n> {ai_result.error_message}\n")

        content_parts.append(ai_result.raw_markdown)
        content_parts.append("")

        content_parts.extend([
            "---",
            "",
            "## 6. ⚙️ Reproduction & Tool Verification",
            "",
            "This capsule report can be reproduced at any time using the Exit Capsule CLI:",
            "```bash",
            f"exit-capsule scan {self.repo_path} --verify",
            "```",
        ])

        full_markdown = "\n".join(content_parts)
        target_file.write_text(full_markdown, encoding="utf-8")

        return ExitCapsuleReport(
            scan_result=scan_result,
            test_result=test_result,
            ai_result=ai_result,
            report_file_path=target_file,
            created_at=now_iso,
        )
