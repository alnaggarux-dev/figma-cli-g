# Custom Figma-cli-g Modifications (v1.2.0)

This repository is a modified version of the original [silships/figma-cli](https://github.com/silships/figma-cli). 
It has been customized to fully support **Windows** environments and **all AI Assistants** (not just Claude).

## 1. Windows Compatibility Fixes
The original codebase relied heavily on macOS/Linux specific commands and paths. The following changes were implemented in `src/index.js` to ensure native Windows support:

- **Path Handling**: Replaced hardcoded Unix temporary paths (`/tmp/`) with Node's cross-platform `os.tmpdir()`.
- **Health Checks**: Replaced the macOS/Linux `curl` daemon health check with Windows-native PowerShell `Invoke-WebRequest`.
- **Port Management**: Replaced the Unix `lsof -i` command for finding and killing processes with Windows-native `netstat -ano` and `taskkill /PID /F`.
- **File Deletion**: Replaced the Unix `rm -f` shell command with Node's built-in, cross-platform `fs.unlinkSync()`.
- **Synchronous Delays**: Replaced the Unix `sleep` command and invalid asynchronous `await new Promise()` calls inside synchronous functions with Node's cross-platform `Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)`.

## 2. Universal AI Assistant Support
The tool was originally designed specifically for "Claude Code". It has been abstracted to work with **any** terminal-based AI assistant (Antigravity, Gemini, Cursor, Copilot, etc.).

- **`AGENT.md` Created**: A new, universal system prompt file was created. All AI assistants can read this file to understand how to interact with the Figma CLI.
- **CLI Output Updates**: Hardcoded references to "Claude" in the terminal output (e.g., `showQuickStart()`) were updated to generic "AI Assistant" prompts.
- **Backwards Compatibility**: The original `CLAUDE.md` is preserved but mirrored to match `AGENT.md` for older systems specifically checking for that filename.

## 3. Bug Fixes & Improvements
- **`status` command fix**: Removed an undefined `checkDependencies` call that caused the `node src/index.js status` command to crash on first run.
- **Git Tracking**: Added a proper `.gitignore` file to ensure `node_modules/` and random downloaded `.zip` files are safely ignored.
- **Documentation**: Consolidated detailed Windows setup, troubleshooting, and macOS instructions into a single `SETUP_GUIDE.md`.

**For more help contact with me:**
[LinkedIn: Alnaggar UX](https://www.linkedin.com/in/alnaggar-ux/)
---
*Documented on: February 2026*
