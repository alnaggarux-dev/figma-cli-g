# Architecture

## How Figma-CLI-G Works

```
┌─────────────────┐      Chrome DevTools      ┌─────────────────┐
│   figma-cli-g   │ ◄────── Protocol ───────► │  Figma Desktop  │
│     (CLI)       │      (localhost:9222)     │                 │
└─────────────────┘                           └─────────────────┘
```

### Technology Stack

1. **Chrome DevTools Protocol (CDP)**: Figma Desktop is an Electron app with a Chromium runtime. We connect via CDP on port 9222.

2. **figma-use**: The underlying library that handles CDP connection and JavaScript execution. Our CLI wraps this.

3. **Figma Plugin API**: We execute JavaScript against the global `figma` object, which provides full access to the Figma Plugin API.

4. **WebSocket Daemon**: A persistent background HTTP/WebSocket server running on port `49428` (`src/daemon.js`) to provide incredibly fast `< 10ms` executions by avoiding repeated DevTools connections.

### Connection Flow

1. User runs `figma-cli-g connect`
2. CLI patches Figma to enable remote debugging (adds `--remote-debugging-port=9222` flag)
3. Figma restarts with debugging enabled
4. CLI connects via WebSocket to `localhost:9222`
5. The connection daemon starts to keep a constant, low-latency bridge open.
6. Commands are evaluated as JavaScript tightly bound within Figma's Context.

### Key Directories & Files

```
figma-cli-g/
├── src/
│   ├── index.js          # Main CLI entry point (commander)
│   ├── figma-client.js   # Heavy lifting figma interactions and CDP connections
│   ├── daemon.js         # The background acceleration HTTP/WS server
│   ├── figma-patch.js    # Local patching tools (Yolo mode)
│   └── figjam-client.js  # FigJam specific commands
├── docs/                 # Documentation (API, Commands, Architecture, Setup)
├── plugin/               # Safe-mode visual plugin bridging
├── test/                 # Test suites (unit/integration)
└── package.json          # npm configuration mapping `figma-cli-g`
```

### No API Key Required

Unlike the Figma REST API which requires authentication, we use the Plugin API directly through the desktop app. This means:

- Full read/write access to everything
- No rate limits
- Access to features not available in REST API (like variable modes)
- Works with the user's existing Figma session directly on canvas

### Limitations
- Windowns native & macOS.
- Designed to drive Figma Desktop, not web.
- Requires one Figma instance at a time to determine correct WebSocket targets.
- Some complex structural manipulations require specific scaling and bounding boxes adjustments.
