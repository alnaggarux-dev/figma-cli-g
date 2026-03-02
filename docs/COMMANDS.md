# Commands Reference

## FigJam Commands

FigJam has its own command group with direct CDP connection (bypasses figma-use):

```bash
# List open FigJam pages
figma-cli-g figjam list
figma-cli-g fj list  # alias

# Show page info
figma-cli-g fj info

# List elements on page
figma-cli-g fj nodes
figma-cli-g fj nodes --limit 50

# Create sticky note
figma-cli-g fj sticky "Hello World!" -x 100 -y 100
figma-cli-g fj sticky "Yellow Note" -x 200 -y 100 --color "#FEF08A"

# Create shape with text
figma-cli-g fj shape "Box Label" -x 100 -y 200 -w 200 -h 100
figma-cli-g fj shape "Diamond" -x 300 -y 200 --type DIAMOND

# Create text
figma-cli-g fj text "Plain text" -x 100 -y 400 --size 24

# Connect two nodes
figma-cli-g fj connect "2:30" "2:34"

# Move a node
figma-cli-g fj move "2:30" 500 500

# Update text content
figma-cli-g fj update "2:30" "New text content"

# Delete a node
figma-cli-g fj delete "2:30"

# Execute JavaScript in FigJam
figma-cli-g fj eval "figma.currentPage.children.length"
```

### Shape Types

- `ROUNDED_RECTANGLE` (default)
- `RECTANGLE`
- `ELLIPSE`
- `DIAMOND`
- `TRIANGLE_UP`
- `TRIANGLE_DOWN`
- `PARALLELOGRAM_RIGHT`
- `PARALLELOGRAM_LEFT`

### Page Selection

All FigJam commands support `-p` or `--page` to target a specific page:

```bash
figma-cli-g fj sticky "Note" -p "My Board" -x 100 -y 100
```

---

## Setup & Connection

```bash
# Initial setup (patches Figma, installs dependencies)
figma-cli-g

# Connect to running Figma
figma-cli-g connect
```

## Design Tokens

```bash
# IDS Base Design System (71 variables, 5 collections)
figma-cli-g tokens ds

# Tailwind CSS colors (220 variables)
figma-cli-g tokens tailwind

# Spacing scale (4px base)
figma-cli-g tokens spacing

# Border radii
figma-cli-g tokens radii
```

## Variables

```bash
# List all variables
figma-cli-g var list

# Create a variable
figma-cli-g var create "primary/500" -c "CollectionId" -t COLOR -v "#3b82f6"

# Find variables by pattern
figma-cli-g var find "primary/*"
```

## Collections

```bash
# List collections
figma-cli-g col list

# Create collection
figma-cli-g col create "Color - Semantic"
```

## Create Elements

```bash
# Create a frame
figma-cli-g create frame "Card" -w 320 -h 200 --fill "#ffffff" --radius 12

# Create an icon (Iconify, 150k+ icons)
figma-cli-g create icon lucide:star -s 24 -c "#f59e0b"
figma-cli-g create icon mdi:home -s 32 -c "#3b82f6"
```

## JSX Rendering

```bash
# Create complex UI from JSX
figma-cli-g render '<Frame w={320} h={200} bg="#fff" rounded={12} p={24} flex="col" gap={16}>
  <Text size={18} weight="bold" color="#111">Card Title</Text>
  <Text size={14} color="#666">Description</Text>
</Frame>'
```

## Export

```bash
# Screenshot current view
figma-cli-g export screenshot -o screenshot.png

# Export variables as CSS custom properties
figma-cli-g export css

# Export as Tailwind config
figma-cli-g export tailwind
```

## Raw Commands

```bash
# Execute arbitrary JavaScript
figma-cli-g eval "figma.currentPage.name"

# Run figma-use commands directly
figma-cli-g raw query "//COMPONENT"
figma-cli-g raw lint
figma-cli-g raw select "1:234"
figma-cli-g raw export "1:234" --scale 2
```

## Query Syntax

The query command uses XPath-like syntax:

```bash
# All frames
figma-cli-g raw query "//FRAME"

# Frames with specific name
figma-cli-g raw query "//FRAME[@name='Card']"

# All components
figma-cli-g raw query "//COMPONENT"

# All groups
figma-cli-g raw query "//GROUP"

# Name starts with
figma-cli-g raw query "//*[@name^='session-']"

# Name contains
figma-cli-g raw query "//*[contains(@name, 'Button')]"
```

## Selection

```bash
# Select by ID
figma-cli-g raw select "1:234"

# Select multiple
figma-cli-g raw select "1:234,1:235,1:236"

# Clear selection
figma-cli-g eval "figma.currentPage.selection = []"
```

## Export Nodes

```bash
# Export at 2x scale
figma-cli-g raw export "1:234" --scale 2

# Export with suffix
figma-cli-g raw export "1:234" --scale 2 --suffix "_dark"
```
