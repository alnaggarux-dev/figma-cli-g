# Custom Figma-CLI-G Modifications (v1.2.0)

This repository is a modified extension of the original [silships/figma-cli](https://github.com/silships/figma-cli). 
It has been customized to fully support **Windows** environments, optimized core source scaling, and deep integration capabilities for **all AI Assistants** (not just Claude).

## 1. Windows Compatibility Fixes
The original codebase relied heavily on macOS/Linux specific commands and paths. The following changes were implemented to ensure native Windows support:

- **Path Handling**: Replaced hardcoded Unix temporary paths (`/tmp/`) with Node's cross-platform `os.tmpdir()`.
- **Health Checks**: Replaced the macOS/Linux `curl` daemon health checks with cross-platform network equivalents.
- **Port Management**: Handled proper Node.js process killing vs default `lsof` Unix executions.
- **Synchronous Delays**: Implemented correct Atomic waits instead of breaking on `sleep` terminals.

## 2. Universal AI Assistant Support
The tool was originally designed specifically for "Claude Code". It has been fully abstracted to work as an engine for **any** terminal-based AI assistant (Antigravity, Gemini, Cursor, Copilot, etc.).

- **`AGENT.md` Created**: A robust universal system ruleset file. AI agents load this to immediately know how to operate the CLI dynamically.
- **CLI Output Updates**: Stripped hardcoded references tying the terminal output to "Claude", redirecting instructions simply to the "AI Assistant".

## 3. Structural & Architectural Refactoring
To decrease coupling and optimize the CLI logic structure, the following large-scale architectural changes occurred matching standard production systems:

- **`src` Modularization**: Extracted heavy logic structures out of a monolithic `index.js`. 
  - Separated client core (`figma-client.js`)
  - Separated FigJam logic (`figjam-client.js`)
  - Separated Daemon execution paths (`daemon.js`)
  - Prepared `src/utils`, `src/config`, and `src/types` subsystems.
- **Root Cleanup**: All technical documentation, references, CLI manual charts, and setup instructions were migrated into a cleanly categorized `docs/` folder (e.g. `docs/COMMANDS.md`, `docs/setup.md`).
- **Standardized Setup Folders**: Implemented necessary layout endpoints like `templates/`, `test/unit`, `test/integration`, and compiled output `dist/` directories.

## 4. Bug Fixes & Improvements
- **`status` command fix**: Removed an undefined `checkDependencies` call that caused the `node src/index.js status` command to crash on first run.
- **Git Tracking**: Added a proper `.gitignore` file to ensure `node_modules/` and random downloaded `.zip` files are safely ignored.

**For more help contact with me:**
[LinkedIn: Alnaggar UX](https://www.linkedin.com/in/alnaggar-ux/)
---
*Documented on: February / March 2026*
