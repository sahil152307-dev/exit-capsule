"""Real Subprocess Pytest Runner for local Python repositories."""

import re
import subprocess
import sys
import time
from pathlib import Path
from typing import List, Optional

from exit_capsule.models import TestRunResult


class TestRunner:
    """Executes real pytest in the target repository directory via subprocess."""
    __test__ = False

    def __init__(self, repo_path: Path):
        self.repo_path = repo_path.resolve()

    def _resolve_pytest_command(self) -> List[str]:
        """Find the best pytest executable for the target repository."""
        # Check if the target repo has its own virtualenv with pytest
        candidates = [
            self.repo_path / ".venv" / "Scripts" / "pytest.exe",
            self.repo_path / "venv" / "Scripts" / "pytest.exe",
            self.repo_path / ".venv" / "bin" / "pytest",
            self.repo_path / "venv" / "bin" / "pytest",
        ]
        for candidate in candidates:
            if candidate.is_file():
                return [str(candidate)]

        # Fallback to current Python interpreter running pytest as a module
        return [sys.executable, "-m", "pytest"]

    def run_tests(self, extra_args: Optional[List[str]] = None, timeout: int = 180) -> TestRunResult:
        """Execute real pytest inside the target repository and capture all outputs."""
        if not self.repo_path.exists() or not self.repo_path.is_dir():
            return TestRunResult(
                executed=False,
                target_path=self.repo_path,
                exit_code=-1,
                stderr=f"Target directory does not exist: {self.repo_path}",
                summary="Target directory does not exist",
            )

        cmd = self._resolve_pytest_command() + ["-v", "--tb=short"]
        if extra_args:
            cmd.extend(extra_args)

        start_time = time.perf_counter()
        try:
            completed_proc = subprocess.run(
                cmd,
                cwd=str(self.repo_path),
                capture_output=True,
                text=True,
                timeout=timeout,
                encoding="utf-8",
                errors="replace",
            )
            duration = time.perf_counter() - start_time
            stdout = completed_proc.stdout
            stderr = completed_proc.stderr
            exit_code = completed_proc.returncode

        except subprocess.TimeoutExpired as te:
            duration = time.perf_counter() - start_time
            return TestRunResult(
                executed=True,
                target_path=self.repo_path,
                command=cmd,
                exit_code=-1,
                stdout=te.stdout or "",
                stderr=f"Pytest execution timed out after {timeout} seconds",
                duration_seconds=duration,
                passed=False,
                summary=f"Timed out after {timeout}s",
            )
        except Exception as e:
            duration = time.perf_counter() - start_time
            return TestRunResult(
                executed=False,
                target_path=self.repo_path,
                command=cmd,
                exit_code=-1,
                stderr=f"Failed to execute pytest: {e}",
                duration_seconds=duration,
                passed=False,
                summary=f"Execution error: {e}",
            )

        # Parse test metrics from stdout
        passed_count = 0
        failed_count = 0
        skipped_count = 0
        errors_count = 0
        collected_count = 0

        # Match 'collected X items'
        collected_match = re.search(r"collected (\d+) items?", stdout)
        if collected_match:
            collected_count = int(collected_match.group(1))

        # Match status summary line e.g., '== 2 passed, 1 failed, 1 skipped in 0.35s =='
        summary_line = ""
        for line in reversed(stdout.splitlines()):
            if "=====" in line:
                summary_line = line.strip(" =")
                break

        passed_match = re.search(r"(\d+)\s+passed", stdout)
        if passed_match:
            passed_count = int(passed_match.group(1))

        failed_match = re.search(r"(\d+)\s+failed", stdout)
        if failed_match:
            failed_count = int(failed_match.group(1))

        skipped_match = re.search(r"(\d+)\s+skipped", stdout)
        if skipped_match:
            skipped_count = int(skipped_match.group(1))

        error_match = re.search(r"(\d+)\s+error", stdout)
        if error_match:
            errors_count = int(error_match.group(1))

        # Pytest exit codes:
        # 0: All tests passed
        # 1: Tests failed
        # 2: Interrupted
        # 3: Internal error
        # 4: Usage error
        # 5: No tests collected
        is_passed = exit_code == 0
        if exit_code == 0:
            summary = f"PASSED: {passed_count} test(s) passed ({duration:.2f}s)"
        elif exit_code == 1:
            summary = f"FAILED: {failed_count} failed, {passed_count} passed ({duration:.2f}s)"
        elif exit_code == 5:
            summary = f"NO TESTS: No tests found or collected ({duration:.2f}s)"
            is_passed = True  # Not a test failure, just no tests in repo
        else:
            summary = f"ERROR: Pytest exited with code {exit_code} ({duration:.2f}s)"

        return TestRunResult(
            executed=True,
            target_path=self.repo_path,
            command=cmd,
            exit_code=exit_code,
            stdout=stdout,
            stderr=stderr,
            duration_seconds=duration,
            passed=is_passed,
            tests_collected=collected_count,
            tests_passed=passed_count,
            tests_failed=failed_count,
            tests_skipped=skipped_count,
            tests_errors=errors_count,
            summary=summary,
        )
