"""Tests for real subprocess test_runner."""

from pathlib import Path
from exit_capsule.test_runner import TestRunner


def test_test_runner_successful_execution(tmp_path: Path):
    # Create a real mini pytest test
    test_file = tmp_path / "test_example.py"
    test_file.write_text(
        """def test_addition():
    assert 1 + 1 == 2
""",
        encoding="utf-8",
    )

    runner = TestRunner(tmp_path)
    result = runner.run_tests()

    assert result.executed is True
    assert result.exit_code == 0
    assert result.passed is True
    assert result.tests_passed == 1
    assert "PASSED" in result.summary


def test_test_runner_failed_execution(tmp_path: Path):
    test_file = tmp_path / "test_failure.py"
    test_file.write_text(
        """def test_fail():
    assert 1 == 2
""",
        encoding="utf-8",
    )

    runner = TestRunner(tmp_path)
    result = runner.run_tests()

    assert result.executed is True
    assert result.exit_code == 1
    assert result.passed is False
    assert result.tests_failed == 1
    assert "FAILED" in result.summary


def test_test_runner_no_tests(tmp_path: Path):
    # Empty directory
    runner = TestRunner(tmp_path)
    result = runner.run_tests()

    assert result.executed is True
    assert result.exit_code == 5  # Pytest exit code for no tests collected
    assert result.passed is True
    assert "NO TESTS" in result.summary

