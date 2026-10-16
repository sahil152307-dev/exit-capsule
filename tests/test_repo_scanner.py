"""Tests for repo_scanner: real manifest parsing and AST import scanning."""

from pathlib import Path
from exit_capsule.models import ScanResult
from exit_capsule.repo_scanner import (
    ManifestParser,
    RepoASTScanner,
    RepoScanner,
    normalize_package_name,
)


def test_normalize_package_name():
    assert normalize_package_name("Requests") == "requests"
    assert normalize_package_name("pydantic_core") == "pydantic-core"
    assert normalize_package_name("google.genai") == "google-genai"


def test_parse_requirements_file(tmp_path: Path):
    req_file = tmp_path / "requirements.txt"
    req_file.write_text(
        """# Main requirements
requests>=2.28.0,<3.0
flask==2.3.2 # Web server
-r other.txt
--extra-index-url https://example.com
invalid$$package$$name
""",
        encoding="utf-8",
    )

    parser = ManifestParser(tmp_path)
    manifest = parser.parse_requirements_file(req_file)
    assert manifest is not None
    assert manifest.manifest_type == "requirements.txt"

    pkg_names = {r.name for r in manifest.requirements}
    assert "requests" in pkg_names
    assert "flask" in pkg_names


def test_parse_pyproject_toml(tmp_path: Path):
    pyproject_file = tmp_path / "pyproject.toml"
    pyproject_file.write_text(
        """[project]
name = "sample-app"
version = "0.1.0"
dependencies = [
    "requests>=2.25.0",
    "rich>=12.0.0"
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0"
]

[tool.poetry.dependencies]
python = "^3.11"
pydantic = "^2.0"
""",
        encoding="utf-8",
    )

    parser = ManifestParser(tmp_path)
    manifest = parser.parse_pyproject_toml(pyproject_file)
    assert manifest is not None
    pkg_names = {r.name for r in manifest.requirements}
    assert "requests" in pkg_names
    assert "rich" in pkg_names
    assert "pytest" in pkg_names
    assert "pydantic" in pkg_names
    assert "python" not in pkg_names


def test_parse_setup_py(tmp_path: Path):
    setup_file = tmp_path / "setup.py"
    setup_file.write_text(
        """from setuptools import setup

setup(
    name="my_pkg",
    version="1.0",
    install_requires=[
        "typer>=0.9.0",
        "httpx"
    ],
    extras_require={
        "test": ["pytest>=7.0.0"]
    }
)
""",
        encoding="utf-8",
    )

    parser = ManifestParser(tmp_path)
    manifest = parser.parse_setup_py(setup_file)
    assert manifest is not None
    pkg_names = {r.name for r in manifest.requirements}
    assert "typer" in pkg_names
    assert "httpx" in pkg_names
    assert "pytest" in pkg_names


def test_ast_scanner_and_reconciliation(tmp_path: Path):
    # Create sample repo layout
    (tmp_path / "requirements.txt").write_text("requests>=2.28.0\nunused-lib==1.0.0\n", encoding="utf-8")

    src_dir = tmp_path / "src"
    src_dir.mkdir()
    code_file = src_dir / "main.py"
    code_file.write_text(
        """import os
import sys
import requests
from rich.console import Console

def run():
    print(requests.get('https://example.com'))
""",
        encoding="utf-8",
    )

    scanner = RepoScanner(tmp_path)
    result = scanner.scan()

    assert isinstance(result, ScanResult)
    assert "requests" in result.used_declared_dependencies
    assert "unused-lib" in result.unused_dependencies
    assert "rich" in result.undeclared_dependencies
    assert "os" in result.standard_library_packages

