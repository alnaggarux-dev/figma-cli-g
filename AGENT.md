# Figma-cli-g

CLI that controls Figma Desktop directly. No API key needed.
Works with **any AI CLI**: Antigravity, Gemini CLI, Claude Code, Cursor, GitHub Copilot, etc.

---

## How This Works

This tool connects directly to **Figma Desktop** via WebSocket (CDP protocol).
The AI reads this file and translates your natural language into terminal commands.

```
┌─────────────┐      WebSocket (CDP)      ┌─────────────┐
│  AI + CLI   │ ◄───────────────────────► │   Figma     │
└─────────────┘    localhost:random port  └─────────────┘
```

No Figma API key. No cloud. All local.

---

## AI Assistant Instructions

> If you are an AI reading this file: use the commands in the Quick Reference below.
> Always run `node src/index.js` from the project root directory.
> Never show raw terminal commands to the user unless they ask.
> Translate user intent → run the command → report the result in friendly language.

---

## Quick Reference

| User says | Command |
|-----------|---------|
| "connect to figma" | `node src/index.js connect` |
| "add shadcn colors" | `node src/index.js tokens preset shadcn` |
| "add tailwind colors" | `node src/index.js tokens tailwind` |
| "show colors on canvas" | `node src/index.js var visualize` |
| "create cards/buttons" | `render-batch` + `node to-component` |
| "create a rectangle/frame" | `node src/index.js render '<Frame>...'` |
| "convert to component" | `node src/index.js node to-component "ID"` |
| "list variables" | `node src/index.js var list` |
| "find nodes named X" | `node src/index.js find "X"` |
| "what's on canvas" | `node src/index.js canvas info` |
| "export as PNG/SVG" | `node src/index.js export png` |

**Full command reference:** See REFERENCE.md

---

## Design Tokens

"Add shadcn colors":
```bash
node src/index.js tokens preset shadcn   # 244 primitives + 32 semantic (Light/Dark)
```

"Add tailwind colors":
```bash
node src/index.js tokens tailwind        # 242 primitive colors only
```

"Create design system":
```bash
node src/index.js tokens ds              # IDS Base colors
```

**shadcn vs tailwind:**
- `tokens preset shadcn` = Full shadcn system (primitives + semantic tokens with Light/Dark mode)
- `tokens tailwind` = Just the Tailwind color palette (primitives only)

"Delete all variables":
```bash
node src/index.js var delete-all                    # All collections
node src/index.js var delete-all -c "primitives"    # Only specific collection
```

**Note:** `var list` only SHOWS existing variables. Use `tokens` commands to CREATE them.

---

## Connection Modes

### 🚀 Yolo Mode (Recommended)
Patches Figma once, then connects directly. Fully automatic.
```bash
node src/index.js connect
```
> Windows: Run your terminal as **Administrator** the first time only.

### 🔒 Safe Mode (No patching needed)
Uses a Figma plugin. No Figma modification. Start plugin each session.
```bash
node src/index.js connect --safe
```
Then in Figma: Plugins → Development → FigCli

---

## Creating Components

When user asks to "create cards", "design buttons":

1. **Each component = separate frame** (NOT inside parent gallery)
2. **Convert to component** after creation
3. **Use variables** for colors

```bash
# Step 1: Create separately
node src/index.js render-batch '[
  "<Frame name=\"Card 1\" w={320} h={200} bg=\"#18181b\" rounded={12} flex=\"col\" p={24}><Text color=\"#fff\">Title</Text></Frame>",
  "<Frame name=\"Card 2\" w={320} h={200} bg=\"#18181b\" rounded={12} flex=\"col\" p={24}><Text color=\"#fff\">Title</Text></Frame>"
]'

# Step 2: Convert
node src/index.js node to-component "ID1" "ID2"

# Step 3: Bind variables
node src/index.js bind fill "zinc/900" -n "ID1"
```

---

## Creating Webpages

Create ONE parent frame with vertical auto-layout containing all sections:

```bash
node src/index.js render '<Frame name="Landing Page" w={1440} flex="col" bg="#0a0a0f">
  <Frame name="Hero" w="fill" h={800} flex="col" justify="center" items="center" gap={24} p={80}>
    <Text size={64} weight="bold" color="#fff">Headline</Text>
    <Frame bg="#3b82f6" px={32} py={16} rounded={8}><Text color="#fff">CTA</Text></Frame>
  </Frame>
  <Frame name="Features" w="fill" flex="row" gap={40} p={80} bg="#111">
    <Frame flex="col" gap={12} grow={1}><Text size={24} weight="bold" color="#fff">Feature 1</Text></Frame>
  </Frame>
</Frame>'
```

---

## JSX Syntax (render command)

```jsx
// Layout
flex="row"        // or "col"
gap={16}
p={24}            // padding all sides
px={16} py={8}    // padding x/y

// Size
w={320} h={200}   // fixed
w="fill"          // fill parent

// Appearance
bg="#fff"         // fill color
rounded={16}      // corner radius
stroke="#000"     // stroke color

// Text
<Text size={18} weight="bold" color="#000">Hello</Text>
```

**Common mistakes:**
```
WRONG                    RIGHT
layout="horizontal"   →  flex="row"
padding={24}          →  p={24}
fill="#fff"           →  bg="#fff"
cornerRadius={12}     →  rounded={12}
```

---

## Key Rules

1. **Always use `render` for frames** — has smart positioning
2. **Never use `eval` to create** — no positioning, overlaps at (0,0)
3. **For multiple frames:** Use `render-batch`
4. **Convert to components:** `node to-component` after creation

---

## Onboarding ("Connect to Figma" / "Set up")

Run silently, give friendly feedback. The steps are:

1. Make sure you're in the project directory: `d:\Design\AI\Figma_CLI` (or wherever installed)
2. Run: `node src/index.js connect` (Yolo Mode) or `node src/index.js connect --safe` (Safe Mode)
3. On **Windows**: must run terminal as **Administrator** for Yolo Mode (one-time only)
4. When connected, say: "Connected to Figma! What would you like to design?"

**Windows permission error?**
→ Close terminal → Right-click terminal → "Run as Administrator" → try again

**Figma not connecting?**
1. Make sure Figma Desktop is running (not the browser version)
2. Open a design file in Figma (not just the home screen)
3. Re-run: `node src/index.js connect`

---

## Variable Visualization

"Show colors on canvas" / "display variables" / "create palette":
```bash
node src/index.js var visualize              # All collections
node src/index.js var visualize "primitives" # Filter by collection name
```

Creates shadcn-style color swatches bound to variables.

---

## Website Recreation

```bash
node src/index.js recreate-url "https://example.com" --name "Page"
node src/index.js screenshot-url "https://example.com"
```

---

## Speed Daemon

`connect` auto-starts a daemon for 10x faster commands.

```bash
node src/index.js daemon status
node src/index.js daemon restart
```

---

## Windows-Specific Notes

- Run as **Administrator** for Yolo Mode (patches Figma once)
- Safe Mode works without admin rights
- Figma path: `%LOCALAPPDATA%\Figma\Figma.exe`
- plugin path: `plugin\manifest.json` (use backslash on Windows)
- All temp files use `os.tmpdir()` — no `/tmp/` issues

---

## Supported AI Tools

This file (`AGENT.md`) is designed for:
- **Antigravity** (Google DeepMind) — reads `AGENT.md` automatically
- **Gemini CLI** — reads `AGENT.md` automatically
- **Claude Code** — reads `CLAUDE.md` (identical content, different filename)
- **Cursor** — add to `.cursorrules` or project context
- **GitHub Copilot** — add to `.github/copilot-instructions.md`
- Any other AI that reads project files for context
