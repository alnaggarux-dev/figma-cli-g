# Windows Setup Guide

Complete setup guide for **figma-ds-cli** on Windows.

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18 or later | [nodejs.org](https://nodejs.org) |
| Figma Desktop | Any | [figma.com/downloads](https://www.figma.com/downloads/) |
| Git (optional) | Any | [git-scm.com](https://git-scm.com) |

---

## Step 1: Get the Files

**Option A — Clone with Git (recommended):**
```powershell
# Run in PowerShell
git clone https://github.com/yourusername/figma-cli.git
cd figma-cli
```

**Option B — Download ZIP:**
1. Go to the repo on GitHub → Click **Code** → **Download ZIP**
2. Extract to a folder like `C:\Tools\figma-cli` or `D:\Design\AI\Figma_CLI`
3. Open that folder in PowerShell

---

## Step 2: Install Dependencies

```powershell
# In the figma-cli folder
node --version      # Should show v18 or later
npm install
```

> ⚠️ If you get a script execution error, run:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

---

## Step 3: Connect to Figma

### 🚀 Yolo Mode (Recommended — Automatic)

> **Must run as Administrator the first time!**

1. Search for your terminal (PowerShell or CMD) in Start menu
2. **Right-click → Run as Administrator**
3. Navigate to the project folder:
   ```powershell
   cd D:\Design\AI\Figma_CLI
   ```
4. Run:
   ```powershell
   node src/index.js connect
   ```

After the one-time patch, you **no longer need Administrator** for normal use.

**What it does:**
- Patches `%LOCALAPPDATA%\Figma\resources\app.asar` once
- Connects to Figma via WebSocket on a random local port
- Starts a daemon for fast repeated commands

---

### 🔒 Safe Mode (No Admin Required)

No patch needed. Uses a Figma plugin instead.

**Step 1: Start Safe Mode server**
```powershell
node src/index.js connect --safe
```

**Step 2: Import the plugin (one-time only)**
1. Open Figma Desktop
2. Go to: **Plugins → Development → Import plugin from manifest**
3. Browse to: `plugin\manifest.json` in this project folder
4. Click **Open**

**Step 3: Start the plugin each session**
1. In Figma: **Plugins → Development → FigCli**
2. The terminal will show: `Plugin connected!`

> 💡 Tip: Right-click **FigCli** in the plugins menu → **Add to toolbar** for quick access.

---

## Step 4: Use It With Your AI

### With Antigravity (this tool reads `AGENT.md` automatically)
Just talk to Antigravity in your terminal:
```
"Add shadcn colors to my project"
"Create a button component"
"Show what's on the canvas"
```

### With Claude Code
```powershell
# Open Claude Code from the figma-cli folder
claude
```
Claude reads `CLAUDE.md` automatically.

### With Other AI Tools
Point your AI to `AGENT.md` or `CLAUDE.md` for the full command reference.

---

## Troubleshooting (Windows)

### ❌ Permission denied / EPERM error
**Fix:** Run terminal as Administrator
1. Close current terminal
2. Search "PowerShell" in Start menu
3. Right-click → **Run as Administrator**
4. `cd` back to project folder
5. Run `node src/index.js connect` again

---

### ❌ `npm` is not recognized
**Fix:** Reinstall or repair Node.js from [nodejs.org](https://nodejs.org), then restart terminal.

---

### ❌ Figma not connecting after patch
1. Make sure **Figma Desktop** is running (not the browser version!)
2. Open a **design file** in Figma (not just the home screen)
3. Try restarting Figma and reconnecting:
   ```powershell
   node src/index.js connect
   ```

---

### ❌ Scripts disabled (PowerShell)
```
npm.ps1 cannot be loaded because running scripts is disabled
```
**Fix:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### ❌ `curl` not found errors
With Yolo Mode on Windows, the tool uses PowerShell's `Invoke-WebRequest` instead of `curl`.  
Make sure you have **Windows 10 v1803+** or **Windows 11** (both include PowerShell 5.1+).

---

### ❌ Port already in use
```powershell
# Find what's using port 3456
netstat -ano | findstr :3456
# Kill it (replace 1234 with the actual PID)
taskkill /F /PID 1234
```

---

## Figma Desktop Location

The tool automatically finds Figma at:
```
%LOCALAPPDATA%\Figma\Figma.exe
```
Which is usually:
```
C:\Users\YourName\AppData\Local\Figma\Figma.exe
```

---

## Manual Start (if auto-start fails)

If `node src/index.js connect` can't start Figma automatically, start it manually:

```powershell
# Replace 9222 with your actual port
"%LOCALAPPDATA%\Figma\Figma.exe" --remote-debugging-port=9222
```

---

## Uninstall / Reset

To reset the patch and start fresh:
```powershell
node src/index.js unpatch   # Restores original Figma
```

To remove config:
```powershell
Remove-Item "$env:USERPROFILE\.figma-ds-cli" -Recurse -Force
```
