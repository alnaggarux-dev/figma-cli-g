# Figma-cli-g - User Manual Guide

Congratulations on setting up the Figma CLI! This guide will help you master the tools and best practices for a seamless design-to-code workflow on Windows.

## 🛠️ Core Tools & Commands

### 1. Connection & Status
- **`node src/index.js status`**: Your first step. Verifies if you are connected to Figma. 
  - *Tip*: On Windows, if "Direct" connection fails, the CLI automatically uses **Safe Mode** via the bridge.

### 2. Design Creation (Render)
- **`node src/index.js render "<rect width={100} height={100} fill='#ff0000' />"`**: The most powerful command. 
  - **Rule**: You don't need a `<Frame>` at the start; the CLI wraps your elements automatically.
  - **Help**: Supports `<Frame>`, `<Text>`, `<Rectangle>`, `<Rect>`, `<Image>`, `<Icon>`, and `<Instance>`.
  - **Flexibility**: Tags are case-insensitive (`<rect>` works as well as `<Rect>`).

### 3. Discovery & Manipulation
- **`node src/index.js find [name]`**: Find elements on your canvas by name.
- **`node src/index.js get [id]`**: See the full properties of a specific element.
- **`node src/index.js eval "[code]"`**: Run any Figma Plugin API code directly.

---

## 📏 Rules & Guidelines

1.  **Start the Bridge**: Always ensure the **Figma Desktop Bridge** plugin is running in Figma for the best experience.
2.  **Naming Matters**: Use the `name` attribute in your JSX (e.g., `<rect name='Footer' />`) to keep your layers organized.
3.  **Use Hex Colors**: Prefer hex codes (e.g., `#FFFFFF`) for fills and strokes.
4.  **Windows Stability**: If the CLI asks to stop/start the daemon to fix a port conflict, allow it. This is a built-in safety feature for Windows.

---

## 💡 Best Practices

- **Smart Positioning**: The CLI automatically places new renders in free space on your canvas so you don't overlap designs.
- **Component Instances**: Use `<Instance key='...' />` to place your existing design system components instantly.
- **Thumb Zone Optimization**: When designing mobile layouts, place your primary actions (buttons) in the lower third of the screen.

---

## 🆘 Troubleshooting & Support

If you encounter "Address already in use" errors:
- The CLI will attempt to fix this automatically on Windows. If it persists, run `node src/index.js stop` then `node src/index.js start`.

**For more help contact with me:**
[LinkedIn: Alnaggar UX](https://www.linkedin.com/in/alnaggar-ux/)

---
*Documented on: February 2026*

