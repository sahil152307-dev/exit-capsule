# Changelog

All notable changes to **Exit Capsule Agent** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]
- (Future changes go here before a release)

---

## [1.0.0] – 2026-10-16

### Added
- Initial production release of Exit Capsule Agent CLI.
- Real manifest parser: reads `requirements.txt`, `pyproject.toml`, `setup.py`.
- Real AST import mapper: walks all `.py` files using Python's `ast` module.
- Real pytest execution via `subprocess` with `--verify` flag.
- Google Gemini AI integration for migration recommendations.
- Clean Rich executive dashboard in the terminal.
- `DEPENDENCY_EXIT_CAPSULE.md` markdown report generation.
- Remote Git repository scanning via `--path https://github.com/...`.
- `--json` flag for CI/pipeline integration.
- `exit-capsule show` command to render existing reports in the terminal.
- MIT License.

