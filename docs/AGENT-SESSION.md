# Figma-CLI-G Agent Session Quick Reference

## Project Overview

`figma-cli-g` is a CLI tool for managing Figma design systems. It connects to Figma Desktop via Chrome DevTools Protocol and executes JavaScript against the Figma Plugin API.

**Location:** `/Users/sil/claude/figma-cli`
**npm package:** `figma-cli-g` (v1.2.0)
**GitHub:** https://github.com/silships/figma-cli

## Key Commands for AI Agents

### Execute JavaScript in Figma

```bash
node src/index.js eval "YOUR_JAVASCRIPT_HERE"
```

### Fast Variable Render Syntax

```bash
node src/index.js render '<Frame name="Card" bg="var:card" w={320} h={320} p={24} rounded={16} flex="col" gap={16}>
  <Text color="var:foreground" size={24} weight="bold">Header Component</Text>
</Frame>'
```

### Export

```bash
node src/index.js node "NODE_ID" --format png --scale 2 -o "output.png"
```

## FigJam Commands

```bash
# List pages
node src/index.js fj list

# Create sticky
node src/index.js fj sticky "Text" -x 100 -y 100

# Create shape
node src/index.js fj shape "Label" -x 200 -y 100

# Connect nodes
node src/index.js fj connect "2:30" "2:34"

# List elements
node src/index.js fj nodes

# Execute JS
node src/index.js fj eval "figma.currentPage.children.length"
```

## Common Operations

### Scale and Center Content

```bash
node src/index.js eval "
const ids = ['1:92', '1:112', '1:134'];  // content group IDs
const frameW = 1920, frameH = 1080;

ids.forEach(id => {
  const n = figma.getNodeById(id);
  if (n) {
    n.rescale(1.2);  // or 0.9 for scale down
    n.x = (frameW - n.width) / 2;
    n.y = (frameH - n.height) / 2;
  }
});
"
```

### Switch Variable Mode (Light/Dark)

```bash
node src/index.js eval "
const node = figma.getNodeById('1:92');

function findModeCollection(n) {
  if (n.boundVariables) {
    for (const [prop, binding] of Object.entries(n.boundVariables)) {
      const b = Array.isArray(binding) ? binding[0] : binding;
      if (b && b.id) {
        try {
          const variable = figma.variables.getVariableById(b.id);
          if (variable) {
            const col = figma.variables.getVariableCollectionById(variable.variableCollectionId);
            if (col && col.modes.length > 1) {
              return { col, modes: col.modes };
            }
          }
        } catch(e) {}
      }
    }
  }
  if (n.children) {
    for (const c of n.children) {
      const found = findModeCollection(c);
      if (found) return found;
    }
  }
  return null;
}

const found = findModeCollection(node);
if (found) {
  const mode = found.modes.find(m => m.name.includes('Light'));  // or 'Dark'
  if (mode) {
    const ids = ['1:92', '1:112', '1:134'];
    ids.forEach(id => {
      const n = figma.getNodeById(id);
      if (n) n.setExplicitVariableModeForCollection(found.col, mode.modeId);
    });
  }
}
"
```

### Rename Nodes

```bash
node src/index.js eval "
const page = figma.currentPage;
page.children.filter(n => n.name.startsWith('Stream-')).forEach((f, i) => {
  f.name = 'session-' + (i + 1);
});
"
```

## Important Notes

1. **Eval often returns no output** but code still executes. Verify with queries.
2. **Use `jsx` rendering frames over rigid node manipulations**, it builds proper auto-layouts directly on the canvas.
3. **Library variables** cannot be accessed via `getLocalVariableCollections()`. Must find through `boundVariables` on nodes.
4. **Agent File Structure** is guided strictly by `AGENT.md`.

## File Structure

```
figma-cli-g/
├── src/             # Source files (index.js, figma-client.js, daemon.js)
├── package.json     # npm config
├── README.md        # User docs
├── AGENT.md         # AI Agent directives
└── docs/
    ├── ARCHITECTURE.md   # Structure overview
    ├── COMMANDS.md       # Full command docs
    ├── setup.md          # Setup guides
    └── what-we-did.md    # Changelogs of the implementation
```
