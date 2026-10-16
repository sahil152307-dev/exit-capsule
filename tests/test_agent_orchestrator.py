"""Tests for AgentOrchestrator and Markdown report generation."""

from pathlib import Path
from exit_capsule.agent_orchestrator import AgentOrchestrator
from exit_capsule.models import (
    DependencyRequirement,
    ImportOccurrence,
    ScanResult,
    TestRunResult,
)


def test_agent_orchestrator_local_rule_engine(tmp_path: Path):
    scan_result = ScanResult(
        repo_path=tmp_path,
        declared_dependencies={
            "requests": DependencyRequirement(
                name="requests",
                raw_spec="requests>=2.28.0",
                version_constraint=">=2.28.0",
                manifest_file="requirements.txt",
            ),
            "pytz": DependencyRequirement(
                name="pytz",
                raw_spec="pytz",
                version_constraint="",
                manifest_file="requirements.txt",
            ),
        },
        unused_dependencies=["pytz"],
        undeclared_dependencies=["pydantic"],
        used_declared_dependencies=["requests"],
    )

    test_result = TestRunResult(
        executed=True,
        target_path=tmp_path,
        exit_code=0,
        passed=True,
        summary="PASSED: 5 tests passed",
    )

    orchestrator = AgentOrchestrator(tmp_path, api_key=None)
    ai_result = orchestrator.run_ai_analysis(scan_result, test_result)

    assert ai_result.success is True
    assert ai_result.source == "local_rule_engine"
    assert "requests" in ai_result.raw_markdown
    assert "httpx" in ai_result.raw_markdown
    assert "zoneinfo" in ai_result.raw_markdown

    # Test real report generation
    report = orchestrator.generate_report(scan_result, test_result, ai_result)
    assert report.report_file_path.is_file()

    content = report.report_file_path.read_text(encoding="utf-8")
    assert "# 📦 DEPENDENCY EXIT CAPSULE" in content
    assert "Pytest Verification" in content
    assert "AST Import Usage Matrix" in content

