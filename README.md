# figma-cli-g

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

## Quick Start

```bash
# Install
npm install

# Connect to Figma
node src/index.js connect

# Then use AI or run commands directly
node src/index.js var list
node src/index.js canvas info
```

## Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation and setup
- [USER_MANUAL.md](./USER_MANUAL.md) - Full user guide
- [REFERENCE.md](./REFERENCE.md) - Command reference
- [WHAT_WE_DID.md](./WHAT_WE_DID.md) - Changelog

## License

MIT
