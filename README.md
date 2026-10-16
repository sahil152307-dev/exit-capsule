# 📦 Exit Capsule Agent

A production-ready, local Python CLI tool built with **Typer** and **Rich** that performs **REAL analysis** on target Python repositories (no mock data, no hardcoded simulations).

Exit Capsule Agent scans dependency manifests, uses Python's built-in `ast` module to map exact import locations and call sites, executes actual `pytest` suites via subprocess to capture live test outcomes, orchestrates AI migration recommendations using Google GenAI SDK (Gemini / Gemma) with fallback to an offline modernization knowledge base, and compiles findings into a comprehensive `DEPENDENCY_EXIT_CAPSULE.md` report.

---

## 🌟 Key Features

1. **Real Manifest Parser (`repo_scanner.py`)**:
   - Parses `requirements.txt` (including `-r` references, version specifiers, dev flags, and inline comments).
   - Parses PEP 621 `pyproject.toml` (`[project.dependencies]`, `[project.optional-dependencies]`) and Poetry (`[tool.poetry.dependencies]`, `[tool.poetry.group]`).
   - Parses `setup.py` via AST inspection of `setup()` keyword arguments (`install_requires` and `extras_require`).

2. **Real AST Code Scanner (`repo_scanner.py`)**:
   - Walks all real `.py` files in the target repository.
   - Ignores `.git`, virtual environments (`.venv`, `venv`), cache directories (`__pycache__`, `.pytest_cache`), and build artifacts.
   - Maps exact `import` and `from ... import` statements down to file path and line number.
   - Automatically cross-references PyPI distribution names to top-level import names (e.g., `pyyaml` ↔ `yaml`, `pillow` ↔ `PIL`, `google-genai` ↔ `google`, `python-dotenv` ↔ `dotenv`).
   - Identifies:
     - **Active (Used) Dependencies**: Declared in manifests and actively imported in code.
     - **Unused (Bloat) Dependencies**: Declared in manifests but never imported in AST.
     - **Undeclared Dependencies**: Third-party packages imported in code but missing from manifests.

3. **Real Subprocess Pytest Runner (`test_runner.py`)**:
   - Executes real `pytest` inside the target repository directory via `subprocess`.
   - Captures actual exit codes, stdout, stderr, and runtime duration.
   - No mock test outputs: accurately parses pass, fail, skip, and error counts.

4. **Real AI Orchestrator (`agent_orchestrator.py`)**:
   - Integrates with the **Google GenAI SDK** (`google-genai`).
   - Analyzes manifests, AST usages, and real test outcomes to generate architecture assessments, migration risks, and step-by-step modernization roadmaps.
   - Graceful offline fallback: includes an embedded Python modernization rule engine covering standard modern migrations (`requests` ➜ `httpx`, `pytz` ➜ `zoneinfo`, `marshmallow` ➜ `pydantic`, `distutils` ➜ `setuptools/packaging`, etc.) if no API key is provided.

5. **Real Markdown Capsule Generator (`agent_orchestrator.py`)**:
   - Compiles all findings into `DEPENDENCY_EXIT_CAPSULE.md` inside the target repository.

6. **Production Typer & Rich CLI (`cli.py`)**:
   - Commands: `exit-capsule scan <path> --verify` and `exit-capsule version`.
   - UTF-8 safe across Windows, macOS, and Linux terminals.
   - Real-time spinners, rich tables, status panels, and JSON export support (`--json`).

---

## 🚀 Installation

```bash
# Clone or navigate to the repository
cd exitkit

# Install in editable mode
pip install -e .
```

---

## 🛠️ Usage

### 1. Basic Scan (Auto-Renders Report in Terminal)
Scan a target repository, display the full formatted report right in your CLI, and save `DEPENDENCY_EXIT_CAPSULE.md`:
```bash
exit-capsule scan /path/to/target-repo
```

### 2. Scan a GitHub / Git URL Directly
Scan any remote Git repository without manual cloning:
```bash
exit-capsule scan https://github.com/jamiepine/voicebox.git
```

### 3. Display Existing Capsule Report in Terminal (`show`)
Instantly view any previously generated capsule in beautiful terminal markdown (works in PowerShell, CMD, Claude Code, Codex, iTerm, etc.):
```bash
# View the capsule in the current directory:
exit-capsule show

# Or view a specific report file:
exit-capsule show voicebox_DEPENDENCY_EXIT_CAPSULE.md
```

### 4. Scan with Real Pytest Verification (`--verify`)
Run the test suite inside the target repository, measure execution time, capture test exit codes, and include stdout/stderr traces in the capsule:
```bash
exit-capsule scan . --verify
```

### 5. Connect with Google Gemini AI (`--api-key` / `GEMINI_API_KEY`)
Enable Google Gemini AI to analyze dependency technical debt and propose modern replacements:
```bash
# Via CLI option
exit-capsule scan . --verify --api-key "YOUR_GEMINI_API_KEY"

# Or via environment variable
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
exit-capsule scan . --verify
```

### 6. Quiet Mode (Save File Only, Don't Dump Full Text)
```bash
exit-capsule scan . --no-print
```

### 7. Machine-Readable JSON Output
Output scan results as raw JSON for CI/CD pipelines:
```bash
exit-capsule scan . --json
```

---

## 📁 Project Architecture

```
exitkit/
├── pyproject.toml              # Build configuration and CLI script entry point
├── README.md                   # Documentation and usage guide
├── exit_capsule/
│   ├── __init__.py             # Package metadata
│   ├── __main__.py             # python -m exit_capsule entrypoint
│   ├── models.py               # Data models (ScanResult, TestRunResult, AIAnalysisResult)
│   ├── repo_scanner.py         # Real manifest parser & AST import visitor
│   ├── test_runner.py          # Real subprocess pytest executor
│   ├── agent_orchestrator.py   # Google GenAI integration & DEPENDENCY_EXIT_CAPSULE.md generator
│   └── cli.py                  # Typer & Rich CLI interface
└── tests/
    ├── __init__.py
    ├── test_repo_scanner.py    # Unit tests for manifest and AST parsing
    ├── test_test_runner.py     # Subprocess pytest execution tests
    ├── test_agent_orchestrator.py # AI orchestrator & report generation tests
    └── test_cli.py             # CLI commands & JSON output tests
```

---

## 🧪 Running the Test Suite

```bash
pytest -v
```

All 12 unit and integration tests execute against real mock directories and verify genuine AST parsing, manifest parsing, pytest subprocess execution, report generation, and CLI commands.

