"""Production-grade Typer CLI interface with Rich formatting for Exit Capsule Agent."""

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Optional

# Reconfigure stdout/stderr on Windows to prevent UnicodeEncodeError in legacy codepages
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import typer
from rich import box
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from rich.rule import Rule
from rich.table import Table
from rich.text import Text

from exit_capsule import __version__
from exit_capsule.agent_orchestrator import AgentOrchestrator
from exit_capsule.models import AIAnalysisResult, ScanResult, TestRunResult
from exit_capsule.repo_scanner import RepoScanner
from exit_capsule.test_runner import TestRunner

app = typer.Typer(
    name="exit-capsule",
    help="Exit Capsule Agent - Production-ready local dependency analyzer and migration CLI.",
    add_completion=False,
    no_args_is_help=True,
)
console = Console(legacy_windows=False)


def print_banner() -> None:
    """Print branded CLI banner."""
    title = Text("📦 EXIT CAPSULE AGENT", style="bold cyan")
    subtitle = Text(f"Production Repository Dependency Analyzer & Migration Engine v{__version__}", style="dim")
    banner_content = Text.assemble(title, "\n", subtitle)
    console.print(Panel(banner_content, box=box.ROUNDED, border_style="cyan"))


CLUSTER_DEFINITIONS = [
    ("Desktop UI", ["pyqt", "pyside", "tkinter", "wx", "kivy"], "System tray, chat, desktop GUI, settings"),
    ("Voice / Audio", ["sounddevice", "whisper", "librosa", "pedalboard", "webrtcvad", "pygame", "pydub", "kokoro", "audioop", "misaki", "s3tokenizer", "pytesseract"], "Listening, dictation, TTS/VAD, audio playback"),
    ("ML / LLM", ["torch", "diffusers", "accelerate", "numpy", "scipy", "google", "openai", "anthropic", "mlx", "transformers", "huggingface", "numba", "fastmcp"], "Ollama/OpenAI backends, local ML inference, models"),
    ("Web / Scraping", ["fastapi", "starlette", "flask", "django", "httpx", "requests", "beautifulsoup", "bs4", "lxml", "html2text", "urllib3"], "Web search, fetch, REST APIs, scraping"),
    ("Data / Models", ["pydantic", "marshmallow", "alembic", "sqlalchemy", "sqlmodel", "yaml", "msgpack"], "Data validation, schemas, serialization, database"),
    ("System & Hotkeys", ["psutil", "pynput", "filelock", "watchdog", "pyinstaller"], "Process, location, global hotkeys, build hooks"),
    ("CLI / Core Tools", ["typer", "click", "rich", "tqdm", "packaging", "dotenv"], "CLI interface, progress, formatting, environment"),
    ("Testing", ["pytest", "flake8", "black", "ruff", "mypy", "mock"], "Test suite, assertions, test runners"),
]


def render_clean_dashboard(
    scan_result: ScanResult,
    test_result: Optional[TestRunResult],
    ai_result: AIAnalysisResult,
    report_file_path: Path,
    repo_name: Optional[str] = None,
    raw_markdown: bool = False,
) -> None:
    """Render a clean, high-signal executive CLI dashboard matching the user's desired format."""
    display_name = repo_name or scan_result.repo_path.name

    # 1. Collect and classify all packages
    all_known_pkgs = set(scan_result.declared_dependencies.keys()) | set(scan_result.undeclared_dependencies)
    from exit_capsule.agent_orchestrator import LOCAL_MIGRATION_KNOWLEDGE

    # Find at-risk packages
    at_risk_items = []
    for pkg in sorted(all_known_pkgs):
        norm_pkg = pkg.lower().replace("-", "_")
        rule = LOCAL_MIGRATION_KNOWLEDGE.get(pkg) or LOCAL_MIGRATION_KNOWLEDGE.get(norm_pkg)
        if rule:
            # Find usage
            usages = scan_result.package_to_imports.get(pkg, []) or scan_result.package_to_imports.get(norm_pkg, [])
            if usages:
                u_str = f"{usages[0].relative_path}:{usages[0].line_number} - {rule['category']}"
            else:
                u_str = "Not directly imported"
            at_risk_items.append({
                "package": pkg,
                "status": "Legacy / Stale",
                "risk": rule["reason"],
                "usage": u_str,
                "replacement": rule["replacement"],
            })

    # Add undeclared packages
    for und in scan_result.undeclared_dependencies:
        usages = scan_result.package_to_imports.get(und, [])
        u_str = f"{usages[0].relative_path}:{usages[0].line_number}" if usages else "Imported in code"
        at_risk_items.append({
            "package": und,
            "status": "Undeclared",
            "risk": "Missing from manifests (runtime ImportError)",
            "usage": u_str,
            "replacement": f"Declare in manifest ({und})",
        })

    # Add unused packages
    for u in scan_result.unused_dependencies:
        at_risk_items.append({
            "package": u,
            "status": "Unused Bloat",
            "risk": "Declared in manifest but not imported in AST",
            "usage": "Not directly imported",
            "replacement": f"Purge from manifest ({u})",
        })

    # Map clusters
    cluster_results = []
    clustered_pkgs = set()
    for cluster_name, keywords, purpose in CLUSTER_DEFINITIONS:
        matched = []
        for pkg in sorted(all_known_pkgs | set(scan_result.package_to_imports.keys())):
            norm = pkg.lower().replace("-", "_")
            if any(kw in norm for kw in keywords):
                matched.append(pkg)
                clustered_pkgs.add(pkg)
        if matched:
            cluster_results.append({
                "cluster": cluster_name,
                "packages": ", ".join(matched[:6]) + (f" (+{len(matched)-6} more)" if len(matched) > 6 else ""),
                "purpose": purpose,
                "count": len(matched),
            })

    # Derive architecture summary
    if cluster_results:
        top_clusters = sorted(cluster_results, key=lambda x: x["count"], reverse=True)[:2]
        arch_summary = " + ".join(c["cluster"] for c in top_clusters) + " stack"
    else:
        arch_summary = "Python project"

    # Header
    console.print(f"\n[bold white]Done! Here's the Dependency Exit Capsule for[/bold white] [bold cyan]{display_name}[/bold cyan]:\n")

    # Summary bar
    total_scanned = len(all_known_pkgs) or len(scan_result.scanned_python_files)
    console.print("[bold #ff9f43]📊 Summary[/bold #ff9f43]")
    console.print(
        f"[bold #ff9f43]{total_scanned} dependencies scanned[/bold #ff9f43] | "
        f"[bold red]{len(at_risk_items)} at-risk[/bold red] | "
        f"[bold white]{arch_summary}[/bold white]\n"
    )

    # 1. Critical At-Risk Table
    console.print("[bold #ff6b6b]🔴 Critical At-Risk Dependencies[/bold #ff6b6b]")
    at_risk_table = Table(box=box.SIMPLE_HEAD, border_style="#444444", header_style="bold #ff9f43")
    at_risk_table.add_column("Package", style="bold #ff6b6b")
    at_risk_table.add_column("Status", style="dim")
    at_risk_table.add_column("Risk", style="white")
    at_risk_table.add_column("Usage", style="cyan")

    if at_risk_items:
        for item in at_risk_items[:12]:
            at_risk_table.add_row(item["package"], item["status"], item["risk"], item["usage"])
        console.print(at_risk_table)
        if len(at_risk_items) > 12:
            console.print(f"[dim](+{len(at_risk_items) - 12} additional items in full capsule report)[/dim]\n")
        else:
            console.print("")
    else:
        console.print("[green]✅ No critical at-risk dependencies detected.[/green]\n")

    # 2. Architecture - Key Clusters Table
    if cluster_results:
        console.print("[bold #ff9f43]🏛️ Architecture - Key Dependency Clusters[/bold #ff9f43]")
        arch_table = Table(box=box.SIMPLE_HEAD, border_style="#444444", header_style="bold #ff9f43")
        arch_table.add_column("Cluster", style="bold #ff9f43")
        arch_table.add_column("Packages", style="white")
        arch_table.add_column("Purpose", style="dim")
        for c in cluster_results:
            arch_table.add_row(c["cluster"], c["packages"], c["purpose"])
        console.print(arch_table)
        console.print("")

    # 3. Test Status
    console.print("[bold #ff9f43]🧪 Test Status[/bold #ff9f43]")
    if test_result and test_result.executed:
        if test_result.passed:
            console.print(f"- [green]✅ PASSED[/green] - {test_result.summary}")
        else:
            console.print(f"- [red]❌ FAILED[/red] - {test_result.summary}")
    else:
        console.print("- [dim]Baseline skipped - Run with[/dim] [bold]--verify[/bold] [dim]to execute live pytest suite[/dim]")
    console.print("")

    # 4. Migration Priorities
    console.print("[bold #ff9f43]🎯 Migration Priorities[/bold #ff9f43]")
    p_num = 1
    for item in at_risk_items:
        if item["status"] == "Legacy / Stale":
            console.print(f" {p_num}. [bold cyan]{item['package']}[/bold cyan] ➜ {item['replacement']}")
            p_num += 1
            if p_num > 6:
                break

    if scan_result.unused_dependencies:
        unused_sample = ", ".join(scan_result.unused_dependencies[:4])
        console.print(f" {p_num}. [bold cyan]Purge unused bloat[/bold cyan] ➜ Remove {unused_sample} from manifests")
        p_num += 1

    if scan_result.undeclared_dependencies:
        und_sample = ", ".join(scan_result.undeclared_dependencies[:4])
        console.print(f" {p_num}. [bold cyan]Pin undeclared dependencies[/bold cyan] ➜ Add {und_sample} to manifests")
        p_num += 1

    if p_num == 1:
        console.print(" ✅ All dependencies aligned with modern standards.")

    console.print(f"\n[dim]📄 Detailed capsule report saved to: [cyan]{report_file_path}[/cyan][/dim]")
    console.print("[dim]💡 Tip: See [bold]AI_INTEGRATION_GUIDE.md[/bold] to unlock Gemini AI code refactoring diffs.[/dim]\n")

    if raw_markdown and report_file_path.is_file():
        console.print(Rule("[bold cyan]RAW CAPSULE MARKDOWN[/bold cyan]", style="cyan"))
        console.print(Markdown(report_file_path.read_text(encoding="utf-8")))


@app.command(name="scan")
def scan_command(
    path: str = typer.Argument(
        ".",
        help="Target local directory or Git repository URL (e.g. . or https://github.com/user/repo.git)",
    ),
    verify: bool = typer.Option(
        False,
        "--verify",
        "-v",
        help="Execute real pytest in the target repository to verify test suite health.",
    ),
    api_key: Optional[str] = typer.Option(
        None,
        "--api-key",
        "-k",
        help="Google Gemini API key (or set GEMINI_API_KEY environment variable).",
    ),
    model: str = typer.Option(
        "gemini-2.5-flash",
        "--model",
        "-m",
        help="Google Gemini / Gemma model name.",
    ),
    output: Optional[Path] = typer.Option(
        None,
        "--output",
        "-o",
        help="Custom output path for DEPENDENCY_EXIT_CAPSULE.md.",
    ),
    raw_markdown: bool = typer.Option(
        False,
        "--raw-markdown",
        help="Also dump the entire unformatted markdown document to the terminal.",
    ),
    json_output: bool = typer.Option(
        False,
        "--json",
        help="Output raw scan results as JSON.",
    ),
) -> None:
    """Perform real dependency discovery, AST mapping, pytest execution, and AI migration planning."""
    is_git_url = path.startswith(("http://", "https://", "git@", "ssh://")) or path.endswith(".git")
    temp_dir_obj = None

    if is_git_url:
        repo_name = path.rstrip("/").split("/")[-1]
        if repo_name.endswith(".git"):
            repo_name = repo_name[:-4]

        temp_dir = tempfile.mkdtemp(prefix=f"exit_capsule_{repo_name}_")
        temp_dir_obj = temp_dir
        target_path = Path(temp_dir).resolve()

        if not json_output:
            console.print(f"[bold cyan]Cloning remote repository:[/bold cyan] {path} ➜ {repo_name}")
        try:
            subprocess.run(
                ["git", "clone", "--depth", "1", path, str(target_path)],
                check=True,
                capture_output=True,
                text=True,
            )
        except subprocess.CalledProcessError as e:
            console.print(f"[bold red]Failed to clone Git repository:[/bold red] {e.stderr or e}")
            if temp_dir_obj:
                shutil.rmtree(temp_dir_obj, ignore_errors=True)
            raise typer.Exit(code=1)
        except FileNotFoundError:
            console.print("[bold red]Error:[/bold red] 'git' is not installed or not in system PATH.")
            raise typer.Exit(code=1)

        # Default output location for cloned repo: save in current working directory
        if not output:
            output = Path.cwd() / f"{repo_name}_DEPENDENCY_EXIT_CAPSULE.md"
    else:
        target_path = Path(path).resolve()
        if not target_path.exists() or not target_path.is_dir():
            console.print(f"[bold red]Error:[/bold red] Directory '{path}' does not exist.")
            raise typer.Exit(code=1)

    try:
        # Step 1: Scan Manifests and AST
        with console.status("[bold cyan]Scanning repository manifests and AST imports...[/bold cyan]", spinner="dots"):
            scanner = RepoScanner(target_path)
            scan_result = scanner.scan()

        if json_output:
            json_data = {
                "repository": str(scan_result.repo_path),
                "scanned_python_files_count": len(scan_result.scanned_python_files),
                "manifests": [
                    {
                        "type": m.manifest_type,
                        "path": str(m.file_path),
                        "requirements": [r.name for r in m.requirements],
                    }
                    for m in scan_result.manifests
                ],
                "declared_dependencies": list(scan_result.declared_dependencies.keys()),
                "used_declared_dependencies": scan_result.used_declared_dependencies,
                "unused_dependencies": scan_result.unused_dependencies,
                "undeclared_dependencies": scan_result.undeclared_dependencies,
                "top_level_imports": list(scan_result.package_to_imports.keys()),
            }
            console.print_json(data=json_data)
            return

        # Step 2: Test Verification (if --verify)
        test_result = None
        if verify:
            with console.status("[bold yellow]Executing real pytest verification suite...[/bold yellow]", spinner="clock"):
                test_runner = TestRunner(target_path)
                test_result = test_runner.run_tests()

        # Step 3: AI Orchestration & Migration Recommendation
        with console.status("[bold magenta]Analyzing dependency modernization vectors...[/bold magenta]", spinner="aesthetic"):
            orchestrator = AgentOrchestrator(target_path, api_key=api_key, model_name=model)
            ai_result = orchestrator.run_ai_analysis(scan_result, test_result)

        # Step 4: Generate DEPENDENCY_EXIT_CAPSULE.md
        with console.status("[bold blue]Compiling DEPENDENCY_EXIT_CAPSULE.md report...[/bold blue]"):
            report = orchestrator.generate_report(scan_result, test_result, ai_result, output_file=output)

        # Step 5: Render Clean, Beautiful Executive Dashboard
        render_clean_dashboard(
            scan_result=scan_result,
            test_result=test_result,
            ai_result=ai_result,
            report_file_path=report.report_file_path,
            repo_name=repo_name if is_git_url else None,
            raw_markdown=raw_markdown,
        )

    finally:
        if temp_dir_obj:
            shutil.rmtree(temp_dir_obj, ignore_errors=True)


@app.command(name="show")
def show_command(
    path: Optional[Path] = typer.Argument(
        None,
        help="Path to DEPENDENCY_EXIT_CAPSULE.md file or directory containing one (defaults to current dir)",
    ),
) -> None:
    """Display any generated Dependency Exit Capsule markdown report directly inside your terminal."""
    target = path or Path.cwd()
    if target.is_dir():
        candidates = sorted(target.glob("*DEPENDENCY_EXIT_CAPSULE.md"))
        if not candidates:
            console.print(f"[bold red]Error:[/bold red] No '*DEPENDENCY_EXIT_CAPSULE.md' found in [yellow]{target}[/yellow]")
            raise typer.Exit(code=1)
        target_file = candidates[-1]  # Most recent
    else:
        target_file = target

    if not target_file.is_file():
        console.print(f"[bold red]Error:[/bold red] Capsule report file not found: [yellow]{target_file}[/yellow]")
        raise typer.Exit(code=1)

    content = target_file.read_text(encoding="utf-8")
    console.print(Rule(f"[bold cyan]📖 {target_file.name}[/bold cyan]", style="cyan"))
    console.print(Markdown(content))
    console.print(Rule("[bold green]END OF REPORT[/bold green]", style="cyan"))


@app.command(name="version")
def version_command() -> None:
    """Print the Exit Capsule Agent version."""
    console.print(f"[bold cyan]Exit Capsule Agent[/bold cyan] version [green]{__version__}[/green]")


if __name__ == "__main__":
    app()
