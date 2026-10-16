# 🤖 Exit Capsule Agent: Gemini AI Integration Guide

Exit Capsule Agent provides powerful built-in dependency analysis out of the box using its local rule engine. When you connect **Google Gemini AI**, the agent unlocks next-generation automated migration intelligence.

---

## 🌟 What Gemini AI Adds When Enabled

| Capability | Without API Key (Local Engine) | With Gemini AI (`GEMINI_API_KEY`) |
| :--- | :--- | :--- |
| **Analysis Engine** | Heuristic knowledge base of known Python migrations | Live Gemini 2.5 generative reasoning |
| **Context Awareness** | General rules for recognized packages | Reads your actual code context, call sites, and AST usage patterns |
| **Custom Code Diffs** | Standard migration recipes | Generates exact before/after migration code diffs for your specific files |
| **Breaking Change Audit** | Static warnings | Cross-references specific version delta changelogs against your imports |
| **Transitive & Niche Libs** | Covers top ~50 popular Python libraries | Analyzes any of the 500,000+ packages on PyPI dynamically |
| **Test Failure Triage** | Displays pytest exit code and trace | Diagnoses test failures from pytest logs and writes targeted fixes |

---

## 🔑 How to Add Your Gemini API Key

### Method 1: Environment Variable (Recommended)
Set `GEMINI_API_KEY` in your shell:

**PowerShell (Windows):**
```powershell
$env:GEMINI_API_KEY = "AIzaSy..."
```

**Bash / Zsh (Linux / macOS):**
```bash
export GEMINI_API_KEY="AIzaSy..."
```

---

### Method 2: `.env` File
Create a `.env` file in the root of your project or the target repository:
```env
GEMINI_API_KEY=AIzaSy...
```
Exit Capsule Agent will automatically detect and load it on launch.

---

### Method 3: Command-Line Flag
Pass the key directly during scan:
```bash
exit-capsule scan . --verify --api-key "AIzaSy..."
```

---

## 🎯 Model Selection
By default, the agent uses `gemini-2.5-flash` for high-speed, cost-effective analysis. You can specify other models:
```bash
# Use Gemini 2.5 Pro for deep architectural refactoring plans
exit-capsule scan . --model gemini-2.5-pro

# Use Gemma for open-weights execution
exit-capsule scan . --model gemma-2-9b-it
```

