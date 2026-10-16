"""Tests for Typer CLI commands."""

from pathlib import Path
from typer.testing import CliRunner
from exit_capsule.cli import app

runner = CliRunner()


def test_cli_version():
    result = runner.invoke(app, ["version"])
    assert result.exit_code == 0
    assert "Exit Capsule Agent" in result.output
    assert "1.0.0" in result.output


def test_cli_scan_json(tmp_path: Path):
    # Setup sample project
    (tmp_path / "requirements.txt").write_text("requests>=2.28.0\n", encoding="utf-8")
    (tmp_path / "app.py").write_text("import requests\nprint('hello')\n", encoding="utf-8")

    result = runner.invoke(app, ["scan", str(tmp_path), "--json"])
    assert result.exit_code == 0
    assert '"requests"' in result.output
    assert '"scanned_python_files_count": 1' in result.output


def test_cli_scan_full(tmp_path: Path):
    (tmp_path / "requirements.txt").write_text("requests>=2.28.0\n", encoding="utf-8")
    (tmp_path / "app.py").write_text("import requests\n", encoding="utf-8")

    result = runner.invoke(app, ["scan", str(tmp_path)])
    assert result.exit_code == 0
    assert "Dependency Exit Capsule" in result.output
    assert "Critical At-Risk Dependencies" in result.output
    assert (tmp_path / "DEPENDENCY_EXIT_CAPSULE.md").is_file()


def test_cli_show(tmp_path: Path):
    capsule_file = tmp_path / "DEPENDENCY_EXIT_CAPSULE.md"
    capsule_file.write_text("# Test Capsule\n- Item 1\n", encoding="utf-8")

    result = runner.invoke(app, ["show", str(capsule_file)])
    assert result.exit_code == 0
    assert "Test Capsule" in result.output


def test_cli_scan_raw_markdown(tmp_path: Path):
    (tmp_path / "requirements.txt").write_text("requests>=2.28.0\n", encoding="utf-8")
    (tmp_path / "app.py").write_text("import requests\n", encoding="utf-8")

    result = runner.invoke(app, ["scan", str(tmp_path), "--raw-markdown"])
    assert result.exit_code == 0
    assert "RAW CAPSULE MARKDOWN" in result.output

