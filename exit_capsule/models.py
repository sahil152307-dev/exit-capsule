"""Data models for Exit Capsule Agent."""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Set


@dataclass
class ImportOccurrence:
    """Represents a single import statement detected by AST."""
    file_path: Path
    relative_path: str
    line_number: int
    module: str  # e.g., "requests" or "os.path"
    top_level_package: str  # e.g., "requests" or "os"
    alias: Optional[str] = None
    is_from_import: bool = False
    imported_names: List[str] = field(default_factory=list)
    code_snippet: Optional[str] = None


@dataclass
class DependencyRequirement:
    """Represents a declared dependency in a manifest file."""
    name: str  # Normalized lowercase package name (e.g., "requests")
    raw_spec: str  # e.g., "requests>=2.28.0,<3.0"
    version_constraint: str  # e.g., ">=2.28.0,<3.0"
    manifest_file: str  # e.g., "requirements.txt"
    is_dev: bool = False


@dataclass
class DependencyManifest:
    """Represents a discovered dependency manifest file."""
    manifest_type: str  # "requirements.txt", "pyproject.toml", "setup.py"
    file_path: Path
    requirements: List[DependencyRequirement] = field(default_factory=list)
    raw_content: str = ""


@dataclass
class ScanResult:
    """Consolidated result of manifest and AST analysis on a repository."""
    repo_path: Path
    manifests: List[DependencyManifest] = field(default_factory=list)
    declared_dependencies: Dict[str, DependencyRequirement] = field(default_factory=dict)
    ast_imports: List[ImportOccurrence] = field(default_factory=list)
    package_to_imports: Dict[str, List[ImportOccurrence]] = field(default_factory=dict)
    scanned_python_files: List[Path] = field(default_factory=list)
    syntax_errors: List[Dict[str, str]] = field(default_factory=list)
    standard_library_packages: Set[str] = field(default_factory=set)
    local_project_modules: Set[str] = field(default_factory=set)
    used_declared_dependencies: List[str] = field(default_factory=list)
    unused_dependencies: List[str] = field(default_factory=list)
    undeclared_dependencies: List[str] = field(default_factory=list)


@dataclass
class TestRunResult:
    """Result of real pytest execution."""
    __test__ = False

    executed: bool
    target_path: Path
    command: List[str] = field(default_factory=list)
    exit_code: int = -1
    stdout: str = ""
    stderr: str = ""
    duration_seconds: float = 0.0
    passed: bool = False
    tests_collected: int = 0
    tests_passed: int = 0
    tests_failed: int = 0
    tests_skipped: int = 0
    tests_errors: int = 0
    summary: str = ""


@dataclass
class AIAnalysisResult:
    """Result from Gemini AI or local heuristic migration analyzer."""
    model_used: str
    source: str  # "gemini_api" or "local_rule_engine"
    success: bool
    executive_summary: str = ""
    migration_recommendations: List[Dict[str, Any]] = field(default_factory=list)
    risk_analysis: str = ""
    exit_roadmap: str = ""
    raw_markdown: str = ""
    error_message: Optional[str] = None


@dataclass
class ExitCapsuleReport:
    """Final compiled capsule report."""
    scan_result: ScanResult
    test_result: Optional[TestRunResult]
    ai_result: Optional[AIAnalysisResult]
    report_file_path: Path
    created_at: str
