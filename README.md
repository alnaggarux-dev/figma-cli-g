# Figma-cli-g

<p align="center">
  <a href="https://www.linkedin.com/in/alnaggar-ux/"><img src="https://img.shields.io/badge/Contact-LinkedIn-blue" alt="LinkedIn"></a>
  <img src="https://img.shields.io/badge/Figma-Desktop-purple" alt="Figma Desktop">
  <img src="https://img.shields.io/badge/No_API_Key-Required-green" alt="No API Key">
  <img src="https://img.shields.io/badge/AI_Ready-Universal-blue" alt="AI Ready">
</p>

<p align="center">
  <b>Control Figma Desktop from your terminal or any AI-powered IDE/CLI.</b><br>
  Full local read/write access to Figma Desktop. No Figma API key required.<br>
  Use it directly in the terminal or let your AI assistant drive the commands for you.
</p>

```
  ███████╗██╗ ██████╗ ███╗   ███╗ █████╗       ██████╗██╗     ██╗      ██████╗
  ██╔════╝██║██╔════╝ ████╗ ████║██╔══██╗      ██╔════╝██║     ██║     ██╔════╝
  █████╗  ██║██║  ███╗██╔████╔██║███████║█████╗██║     ██║     ██║     ██║  ███╗
  ██╔══╝  ██║██║   ██║██║╚██╔╝██║██╔══██║╚════╝██║     ██║     ██║     ██║   ██║
  ██║     ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║      ╚██████╗███████╗██║     ╚██████╔╝
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝       ╚═════╝╚══════╝╚═╝      ╚═════╝
```

## What is This?

**Figma-cli-g** is a cross‑platform CLI that connects directly to **Figma Desktop** (via the Chrome DevTools / WebSocket protocol) and gives you complete local control over your files:

- **Design Tokens** — Create variables, collections, and modes (Light/Dark, etc.), then bind them to nodes
- **Create Anything** — Frames, text, shapes, icons (150k+ from Iconify), components, and variants
- **Team Libraries** — Use variables, components, styles, and tokens from Figma libraries
- **Analyze Designs** — Inspect colors, typography, spacing, and repeated patterns
- **Lint & Accessibility** — Contrast checks, touch targets, and design rules
- **Export** — PNG, SVG, JSX, Storybook stories, CSS variables, Tailwind config
- **Batch Operations** — Rename layers, find/replace text, or generate hundreds of variables at once
- **AI-Friendly** — Designed to be driven by AI tools (Claude Code, Cursor, Gemini CLI, Copilot, Antigravity, etc.) or by you directly in the terminal

## Why This CLI?

This fork focuses on **Windows support** and **universal AI integration** while keeping macOS/Linux fully supported.

The project ships with two instruction files that AI tools can read automatically:

- `CLAUDE.md` — optimized for Claude Code and similar AI IDEs
- `AGENT.md` — a vendor‑neutral version for tools like Antigravity, Gemini CLI, Cursor, Copilot, etc.

These contain:

- All available high‑level commands and their syntax
- Best practices (for example: *“use `render` instead of raw eval for text‑heavy layouts”*)
- Mappings from common user phrases to concrete CLI commands

**Want to teach your AI assistant new tricks?** Update `CLAUDE.md` or `AGENT.md` (or mirror them into your own tool‑specific instruction file). No code changes are required.

**Example:** You say to your AI: “Create Tailwind colors for this file” → the assistant knows to run `node src/index.js tokens tailwind` because that mapping lives in the instruction files.

---

## What You Need

- **Figma Desktop** (free account works)
- **Node.js** v18 or later
- **Optional – AI tooling**:
  - **Claude Code** ([download](https://www.anthropic.com/claude-code))
  - **Cursor**, **Gemini CLI**, **GitHub Copilot**, **Antigravity**, or any IDE/CLI that can read project files and run terminal commands

You can always use `figma-cli-g` directly from the terminal even without an AI assistant.

---

## Setup & Installation

**Please see [SETUP_GUIDE.md](./SETUP_GUIDE.md) for full installation instructions for this fork.**

The guide covers:

- Windows (PowerShell / CMD) usage and common permission issues
- macOS / Linux setup notes
- Yolo Mode (recommended auto‑connect to Figma Desktop)
- Safe Mode (plugin‑based connection for restricted or locked‑down environments)

---

## 🛠 What's New in v1.2.0 (The Windows & Universal AI Update)

This fork has been significantly modified from the original `figma-use`‑based CLI to:

- Support **Windows** natively (no WSL required)
- Use **`figma-cli-g`** as the primary entrypoint (`npx` not required)
- Work with **any AI assistant** that understands project files and can run terminal commands
- Normalize paths and temp‑file handling across platforms

See [WHAT_WE_DID.md](./WHAT_WE_DID.md) for a detailed changelog of what changed compared to the upstream project.

---
### 1. Clone & Open

```bash
git clone https://github.com/silships/figma-cli.git
cd figma-cli
```

Then:

- Open the folder in your preferred AI IDE (Claude Code, Cursor, etc.), **or**
- Stay in the terminal and use `node src/index.js` / `figma-cli-g` directly

**IMPORTANT:** If you use an AI IDE, open it from the project root so it can read `CLAUDE.md`, `AGENT.md`, and the docs.

### 2. Connect

With an AI assistant, you can simply say something like:

> “Connect to Figma.”

The assistant will choose and run one of the connection modes:

- **Yolo Mode (Recommended)** — Fully automatic, uses a local debug port
- **Safe Mode** — Uses a Figma plugin, ideal for corporate / restricted environments

Or run it yourself from the terminal:

```bash
node src/index.js connect            # Yolo Mode
node src/index.js connect --safe     # Safe Mode
```

Once connected, you can either type commands or just describe what you want to your AI assistant.

---

## Using It

Once connected, you can either:

- **Run commands directly** in your terminal, or
- **Talk to your AI assistant**, which will translate your requests into the correct commands

Examples of things you can say:

> “Add shadcn colors to my project.”  
> “Create a card component with a title, description, and CTA button.”  
> “Check accessibility for this page.”  
> “Export all variables as CSS custom properties.”

The included `CLAUDE.md` and `AGENT.md` files teach AI tools the key workflows automatically, so they rarely need the full manual.

**Safe Mode users:** Remember to start the FigCli plugin each time you open Figma (Plugins → Development → FigCli).

## Two Connection Modes

### 🚀 Yolo Mode (Recommended)

**What it does:** Patches Figma Desktop once to enable a local debug port, then connects directly over WebSocket.

**Pros:**

- Fully automatic after the first run
- Slightly faster execution
- Secure: random local port (9222–9322) per session, bound to `localhost`

**Cons:**

- Requires a one‑time patch of the Figma Desktop app
- On macOS: needs Full Disk Access for the terminal app (one‑time)
- On Windows: first run should be from an **elevated** (Run as Administrator) terminal

```
┌─────────────┐      WebSocket (CDP)      ┌─────────────┐
│     CLI     │ ◄───────────────────────► │   Figma     │
└─────────────┘    localhost:random port  └─────────────┘
```

```bash
node src/index.js connect
```

---

### 🔒 Safe Mode — For Restricted Environments

**What it does:** Uses a small Figma plugin as a bridge between the CLI and Figma. No binary patching or app modification is required.

**Pros:**

- No patching of the Figma app
- Works well in corporate / locked‑down environments
- No Full Disk Access or admin rights required on most systems

**Cons:**

- You need to start the plugin manually each session (two quick clicks)

```
┌─────────────┐     WebSocket     ┌─────────────┐     Plugin API     ┌─────────────┐
│     CLI     │ ◄───────────────► │   Daemon    │ ◄────────────────► │   Plugin    │
└─────────────┘   localhost:3456  └─────────────┘                    └─────────────┘
```

**Step 1:** Start Safe Mode
```bash
node src/index.js connect --safe
```

**Step 2:** Import plugin (one-time only)
1. In Figma: **Plugins → Development → Import plugin from manifest**
2. Select `plugin/manifest.json` from this project
3. Click **Open**

**Step 3:** Start the plugin (each session)
1. In Figma: **Plugins → Development → FigCli**
2. Terminal shows: `Plugin connected!`

**Tip:** Right-click the plugin → **Add to toolbar** for quick access.

---

### Which Mode Should I Use?

| Situation | Recommended Mode |
|---|---|
| First time user | **Yolo Mode** |
| Personal Mac | **Yolo Mode** |
| Corporate laptop | **Safe Mode** |
| Permission errors with Yolo | **Safe Mode** |
| Can't modify apps | **Safe Mode** |

---

## Troubleshooting

### Permission Error When Patching (macOS)

If you see `EPERM: operation not permitted, open '.../app.asar'`:

**1. Grant Full Disk Access to Terminal**

macOS blocks file access without this permission, even with sudo.

1. Open **System Settings** → **Privacy & Security** → **Full Disk Access**
2. Click the **+** button
3. Add **Terminal** (or iTerm, VS Code, Warp, etc.)
4. **Restart Terminal completely** (quit and reopen)

**2. Make sure Figma is completely closed**
```bash
# Check if Figma is still running
ps aux | grep -i figma

# Force quit if needed
killall Figma
```

**3. Run connect again**
```bash
node src/index.js connect
```

If still failing, try with sudo: `sudo node src/index.js connect`

**4. Manual patch (last resort)**

If nothing works, you can patch manually:

```bash
# Backup original
sudo cp /Applications/Figma.app/Contents/Resources/app.asar ~/app.asar.backup

# The patch changes one string in the file
# From: removeSwitch("remote-debugging-port")
# To:   removeSwitch("remote-debugXing-port")

# Use a hex editor or this command:
sudo sed -i '' 's/remote-debugging-port/remote-debugXing-port/g' /Applications/Figma.app/Contents/Resources/app.asar

# Re-sign the app
sudo codesign --force --deep --sign - /Applications/Figma.app
```

### Windows Permission Error

Run Command Prompt or PowerShell as Administrator, then run `node src/index.js connect`.

### Figma Not Connecting

1. Make sure Figma Desktop is running (not the web version)
2. Open a design file in Figma (not just the home screen)
3. Restart connection: `node src/index.js connect`

---

## Full Feature List

### Design Tokens & Variables

- **Color presets** — shadcn (276 vars with Light/Dark mode), Radix UI (156 vars)
- Create Tailwind CSS color palettes (all 22 color families, 50-950 shades)
- Create and manage variable collections
- **Variable modes** (Light/Dark/Mobile) with per-mode values
- **Batch create** up to 100 variables at once
- **Batch update** variable values across modes
- Bind variables to node properties (fill, stroke, gap, padding, radius)
- Export variables as CSS custom properties
- Export variables as Tailwind config

### Create Elements

- Frames with auto-layout
- Rectangles, circles, ellipses
- Text with custom fonts, sizes, weights
- Lines
- Icons (150,000+ from Iconify: Lucide, Material Design, Heroicons, etc.)
- Groups
- Components from frames
- Component instances
- **Component sets with variants**

### Modify Elements

- Change fill and stroke colors
- Set corner radius
- Resize and move
- Apply auto-layout (row/column, gap, padding)
- Set sizing mode (hug/fill/fixed)
- Rename nodes
- Duplicate nodes
- Delete nodes
- **Flip nodes** (horizontal/vertical)
- **Scale vectors**

### Find & Select

- Find nodes by name
- Find nodes by type (FRAME, COMPONENT, TEXT, etc.)
- **XPath-like queries** (`//FRAME[@width > 300]`)
- Select nodes by ID
- Get node properties
- Get node tree structure

### Canvas Operations

- List all nodes on canvas
- Arrange frames in grid or column
- Delete all nodes
- Zoom to fit content
- Smart positioning (auto-place without overlaps)

### Export

- Export nodes as PNG (with scale factor)
- Export nodes as SVG
- **Export multiple sizes** (@1x, @2x, @3x)
- Take screenshots
- **Export to JSX** (React code)
- **Export to Storybook** stories
- Export variables as CSS
- Export variables as Tailwind config

### FigJam Support

- Create sticky notes
- Create shapes with text
- Connect elements with arrows
- List FigJam elements
- Run JavaScript in FigJam context

### Team Libraries

- List available library variable collections
- Import variables from libraries
- Import components from libraries
- Create instances of library components
- Import and apply library styles (color, text, effect)
- Bind library variables to node properties
- Swap component instances to different library components
- List all enabled libraries

### Designer Utilities

- **Batch rename layers** (with patterns: {n}, {name}, {type})
- **Case conversion** (camelCase, PascalCase, snake_case, kebab-case)
- **Lorem ipsum generator** (words, sentences, paragraphs)
- **Fill text with placeholder content**
- **Insert images from URL**
- **Unsplash integration** (random stock photos by keyword)
- **Contrast checker** (WCAG AA/AAA compliance)
- **Check text contrast** against background
- **Find and replace text** across all layers
- **Select same** (fill, stroke, font, size)
- **Color blindness simulation** (deuteranopia, protanopia, tritanopia)

### Query & Analysis

- **Analyze colors** — usage frequency, variable bindings
- **Analyze typography** — all font combinations used
- **Analyze spacing** — gap/padding values, grid compliance
- **Find clusters** — detect repeated patterns (potential components)
- **Visual diff** — compare two nodes
- **Create diff patch** — structural patches between versions

### Lint & Accessibility

- **Design linting** with 8+ rules:
  - `no-default-names` — detect unnamed layers
  - `no-deeply-nested` — flag excessive nesting
  - `no-empty-frames` — find empty frames
  - `prefer-auto-layout` — suggest auto-layout
  - `no-hardcoded-colors` — check variable usage
  - `color-contrast` — WCAG AA/AAA compliance
  - `touch-target-size` — minimum 44x44 check
  - `min-text-size` — minimum 12px text
- **Accessibility snapshot** — extract interactive elements tree

### Component Variants

- Create component sets with variants
- Add variant properties
- Combine frames into component sets
- **Organize variants** into grid with labels
- **Auto-generate component sets** from similar frames

### Component Documentation

- **Add descriptions** to components (supports markdown)
- **Document with template** (usage, props, notes)
- Read component descriptions

### CSS Grid Layout

- Set up grid layout with columns and rows
- Configure column/row gaps
- Auto-reorganize children into grid

### Console & Debugging

- **Capture console logs** from Figma
- **Execute code with log capture**
- **Reload page**
- **Navigate to files**

### Advanced

- Execute any Figma Plugin API code directly
- Render complex UI from JSX-like syntax
- Full programmatic control over Figma
- Match vectors to Iconify icons

### Not Supported (requires REST API)

- Comments (read/write/delete) — requires Figma API key
- Version history
- Team/project management

---

## Author

**[Alnaggar UX](https://www.linkedin.com/in/alnaggar-ux/)** — for more help contact me

## Powered By

This fork is based on **[silships/figma-cli](https://github.com/silships/figma-cli)** by [Sil Bormüller](https://github.com/silships), which in turn is built on top of **[figma-use](https://github.com/dannote/figma-use)** by [dannote](https://github.com/dannote) — an excellent Figma CLI with JSX rendering, XPath queries, design linting, and much more.

We rely on `figma-use` for:
- JSX rendering (`render` command)
- Node operations (`node tree`, `node to-component`, etc.)
- Design analysis (`analyze colors`, `analyze typography`)
- Design linting (`lint`)
- Many other core capabilities

**Huge thanks to both [silships](https://github.com/silships) for `figma-cli` and [dannote](https://github.com/dannote) for `figma-use`.**

## License

MIT
