/**
 * Connection and daemon management for figma-cli-g
 * Handles daemon lifecycle, health checks, eval helpers, and connection verification
 */

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { homedir, tmpdir } from 'os';
import { randomBytes } from 'crypto';
import chalk from 'chalk';
import { FigmaClient } from './figma-client.js';
import { getCdpPort } from './figma-patch.js';
import { httpGetSync, httpPostSync } from './utils/http.js';
import { IS_WINDOWS } from './utils/platform.js';

// Daemon configuration
export const DAEMON_PORT = 3456;
const DAEMON_PID_FILE = join(homedir(), '.figma-cli-daemon.pid');
const DAEMON_TOKEN_FILE = join(homedir(), '.figma-cli-g', '.daemon-token');

// ─── Token Management ────────────────────────────────────────

export function generateDaemonToken() {
    const configDir = join(homedir(), '.figma-cli-g');
    if (!existsSync(configDir)) mkdirSync(configDir, { recursive: true });
    const token = randomBytes(32).toString('hex');
    writeFileSync(DAEMON_TOKEN_FILE, token, { mode: 0o600 });
    return token;
}

export function getDaemonToken() {
    try {
        return readFileSync(DAEMON_TOKEN_FILE, 'utf8').trim();
    } catch {
        return null;
    }
}

// ─── Health Check (with 5s TTL cache) ────────────────────────

let _healthCache = null;
let _healthCacheTime = 0;
const HEALTH_CACHE_TTL = 5000;

export function getDaemonHealthSync() {
    try {
        const token = getDaemonToken();
        const headers = {};
        if (token) headers['X-Daemon-Token'] = token;
        const raw = httpGetSync(`http://127.0.0.1:${DAEMON_PORT}/health`, headers);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function isDaemonRunning() {
    const now = Date.now();
    if (_healthCache !== null && now - _healthCacheTime < HEALTH_CACHE_TTL) {
        return _healthCache;
    }

    try {
        const token = getDaemonToken();
        const headers = {};
        if (token) headers['X-Daemon-Token'] = token;
        const result = httpGetSync(`http://127.0.0.1:${DAEMON_PORT}/health`, headers);
        if (!result) {
            _healthCache = false;
        } else {
            JSON.parse(result); // Validate JSON
            _healthCache = true;
        }
    } catch {
        _healthCache = false;
    }
    _healthCacheTime = Date.now();
    return _healthCache;
}

export function invalidateDaemonCache() {
    _healthCache = null;
    _healthCacheTime = 0;
}

// ─── Daemon Lifecycle ────────────────────────────────────────

export function startDaemon(forceRestart = false, mode = 'auto') {
    if (forceRestart) {
        stopDaemon();
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300);
        invalidateDaemonCache();
    } else if (isDaemonRunning()) {
        return true;
    }

    if (!getDaemonToken()) {
        generateDaemonToken();
    }

    const daemonScript = join(dirname(fileURLToPath(import.meta.url)), 'daemon.js');
    const child = spawn('node', [daemonScript], {
        detached: true,
        stdio: 'ignore',
        env: { ...process.env, DAEMON_PORT: String(DAEMON_PORT), DAEMON_MODE: mode }
    });
    child.unref();

    writeFileSync(DAEMON_PID_FILE, String(child.pid));
    invalidateDaemonCache();
    return true;
}

export function stopDaemon() {
    try {
        if (existsSync(DAEMON_PID_FILE)) {
            const pid = readFileSync(DAEMON_PID_FILE, 'utf8').trim();
            try { process.kill(parseInt(pid), 'SIGTERM'); } catch { }
            try { unlinkSync(DAEMON_PID_FILE); } catch { }
        }
        if (IS_WINDOWS) {
            try {
                const netstatOut = execSync(`netstat -ano | findstr :${DAEMON_PORT} | findstr LISTENING`, { encoding: 'utf8', stdio: 'pipe' });
                const pidMatch = netstatOut.trim().match(/(\d+)\s*$/);
                if (pidMatch) {
                    try { process.kill(parseInt(pidMatch[1]), 'SIGTERM'); } catch { }
                }
            } catch { }
        } else {
            try {
                execSync(`lsof -ti:${DAEMON_PORT} | xargs kill -9 2>/dev/null || true`, { stdio: 'pipe' });
            } catch { }
        }
    } catch { }
    invalidateDaemonCache();
}

// ─── Command Execution ──────────────────────────────────────

export async function daemonExec(action, data = {}) {
    const token = getDaemonToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['X-Daemon-Token'] = token;

    const response = await fetch(`http://localhost:${DAEMON_PORT}/exec`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, ...data }),
        signal: AbortSignal.timeout(60000)
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result.result;
}

// ─── Eval Helpers ───────────────────────────────────────────

// Singleton FigmaClient
let _figmaClient = null;

export async function getFigmaClient() {
    if (!_figmaClient) {
        _figmaClient = new FigmaClient();
        await _figmaClient.connect();
    }
    return _figmaClient;
}

export async function figmaEval(code) {
    const client = await getFigmaClient();
    return await client.eval(code);
}

export async function fastEval(code) {
    if (isDaemonRunning()) {
        try {
            return await daemonExec('eval', { code });
        } catch { }
    }
    const client = await getFigmaClient();
    return await client.eval(code);
}

export async function fastRender(jsx) {
    if (isDaemonRunning()) {
        try {
            return await daemonExec('render', { jsx });
        } catch { }
    }
    const client = await getFigmaClient();
    return await client.render(jsx);
}

export function figmaEvalSync(code) {
    const daemonRunning = isDaemonRunning();
    if (daemonRunning) {
        try {
            let wrappedCode = code.trim();
            const payload = { action: 'eval', code: wrappedCode };
            const daemonToken = getDaemonToken();
            const headers = {};
            if (daemonToken) headers['X-Daemon-Token'] = daemonToken;
            const result = httpPostSync(`http://127.0.0.1:${DAEMON_PORT}/exec`, payload, headers);
            if (!result || result.trim() === '') {
                throw new Error('Empty response from daemon');
            }
            const data = JSON.parse(result);
            if (data.error) throw new Error(data.error);
            return data.result;
        } catch (e) {
            try {
                const healthToken = getDaemonToken();
                const healthHeaders = {};
                if (healthToken) healthHeaders['X-Daemon-Token'] = healthToken;
                const healthRes = httpGetSync(`http://127.0.0.1:${DAEMON_PORT}/health`, healthHeaders);
                if (healthRes) {
                    const health = JSON.parse(healthRes);
                    if (health.plugin && !health.cdp) {
                        throw e;
                    }
                }
            } catch { }
        }
    }

    // Fallback: direct connection via temp script
    const TEMP_DIR = tmpdir();
    const tempFile = join(TEMP_DIR, `figma-eval-${Date.now()}.mjs`);
    const resultFile = join(TEMP_DIR, `figma-result-${Date.now()}.json`);
    const resultFileSafe = resultFile.replace(/\\/g, '/');

    const script = `
    import { FigmaClient } from '${join(process.cwd(), 'src/figma-client.js').replace(/\\/g, '/')}';
    import { writeFileSync } from 'fs';

    (async () => {
      try {
        const client = new FigmaClient();
        await client.connect();
        const result = await client.eval(${JSON.stringify(code)});
        writeFileSync('${resultFileSafe}', JSON.stringify({ success: true, result }));
        client.close();
      } catch (e) {
        writeFileSync('${resultFileSafe}', JSON.stringify({ success: false, error: e.message }));
      }
    })();
  `;

    writeFileSync(tempFile, script);
    try {
        execSync(`node "${tempFile}"`, { stdio: 'pipe', timeout: 60000 });
        if (existsSync(resultFile)) {
            const data = JSON.parse(readFileSync(resultFile, 'utf8'));
            try { unlinkSync(tempFile); } catch { }
            try { unlinkSync(resultFile); } catch { }
            if (data.success) return data.result;
            throw new Error(data.error);
        }
    } catch (e) {
        try { unlinkSync(tempFile); } catch { }
        try { unlinkSync(resultFile); } catch { }
        throw e;
    }
    return null;
}

// ─── Compatibility Wrapper ──────────────────────────────────

export function figmaUse(args, options = {}) {
    const evalMatch = args.match(/^eval\s+"(.+)"$/s) || args.match(/^eval\s+'(.+)'$/s);

    if (evalMatch) {
        const code = evalMatch[1].replace(/\\"/g, '"');
        try {
            const result = figmaEvalSync(code);
            if (!options.silent && result !== undefined) {
                console.log(typeof result === 'object' ? JSON.stringify(result, null, 2) : result);
            }
            return typeof result === 'object' ? JSON.stringify(result) : String(result || '');
        } catch (error) {
            if (options.silent) return null;
            throw error;
        }
    }

    if (args === 'status' || args.startsWith('status')) {
        try {
            const port = getCdpPort();
            const result = httpGetSync(`http://localhost:${port}/json`);
            if (!result) return 'Not connected';
            const pages = JSON.parse(result);
            const figmaPage = pages.find(p => p.url?.includes('figma.com/design') || p.url?.includes('figma.com/file'));
            if (figmaPage) {
                const status = `Connected to Figma\n  File: ${figmaPage.title.replace(' – Figma', '')}`;
                if (!options.silent) console.log(status);
                return status;
            }
            return 'Not connected';
        } catch {
            return 'Not connected';
        }
    }

    if (args === 'variable list') {
        const result = figmaEvalSync(`(async () => {
      const vars = await figma.variables.getLocalVariablesAsync();
      return vars.map(v => v.name + ' (' + v.resolvedType + ')').join('\\\\n');
    })()`);
        if (!options.silent) console.log(result);
        return result;
    }

    if (args === 'collection list') {
        const result = figmaEvalSync(`(async () => {
      const cols = await figma.variables.getLocalVariableCollectionsAsync();
      return cols.map(c => c.name + ' (' + c.variableIds.length + ' vars)').join('\\\\n');
    })()`);
        if (!options.silent) console.log(result);
        return result;
    }

    if (args.startsWith('collection create ')) {
        const name = args.replace('collection create ', '').replace(/"/g, '');
        const result = figmaEvalSync(`
      const col = figma.variables.createVariableCollection('${name}');
      col.id
    `);
        if (!options.silent) console.log(chalk.green('✓ Created collection: ' + name));
        return result;
    }

    if (args.startsWith('variable find ')) {
        const pattern = args.replace('variable find ', '').replace(/"/g, '');
        const result = figmaEvalSync(`(async () => {
      const pattern = '${pattern}'.replace('*', '.*');
      const re = new RegExp(pattern, 'i');
      const vars = await figma.variables.getLocalVariablesAsync();
      return vars.filter(v => re.test(v.name)).map(v => v.name).join('\\\\n');
    })()`);
        if (!options.silent) console.log(result);
        return result;
    }

    if (args.startsWith('select ')) {
        const nodeId = args.replace('select ', '').replace(/"/g, '');
        figmaEvalSync(`(async () => {
      const node = await figma.getNodeByIdAsync('${nodeId}');
      if (node) figma.currentPage.selection = [node];
    })()`);
        return 'Selected';
    }

    if (!options.silent) {
        console.log(chalk.yellow('Command not fully supported: ' + args));
    }
    return null;
}

// ─── Connection Checks ──────────────────────────────────────

export async function checkConnection() {
    try {
        const connToken = getDaemonToken();
        const connHeaders = {};
        if (connToken) connHeaders['X-Daemon-Token'] = connToken;
        const health = httpGetSync(`http://127.0.0.1:${DAEMON_PORT}/health`, connHeaders);
        if (health) {
            const data = JSON.parse(health);
            if (data.status === 'ok' && (data.plugin || data.cdp)) {
                return true;
            }
        }
    } catch { }

    const connected = await FigmaClient.isConnected();
    if (!connected) {
        console.log(chalk.red('\n✗ Not connected to Figma\n'));
        console.log(chalk.white('  Make sure Figma is running:'));
        console.log(chalk.cyan('  node src/index.js connect') + chalk.gray(' (Yolo Mode)'));
        console.log(chalk.cyan('  node src/index.js connect --safe') + chalk.gray(' (Safe Mode)\n'));
        process.exit(1);
    }
    return true;
}

export function checkConnectionSync() {
    try {
        const syncToken = getDaemonToken();
        const syncHeaders = {};
        if (syncToken) syncHeaders['X-Daemon-Token'] = syncToken;
        const health = httpGetSync(`http://127.0.0.1:${DAEMON_PORT}/health`, syncHeaders);
        if (health) {
            const data = JSON.parse(health);
            if (data.status === 'ok' && (data.plugin || data.cdp)) {
                return true;
            }
        }
    } catch { }

    try {
        const port = getCdpPort();
        const cdpResult = httpGetSync(`http://localhost:${port}/json`);
        if (cdpResult) return true;
        throw new Error('No CDP response');
    } catch {
        console.log(chalk.red('\n✗ Not connected to Figma\n'));
        console.log(chalk.white('  Make sure Figma is running:'));
        console.log(chalk.cyan('  node src/index.js connect') + chalk.gray(' (Yolo Mode)'));
        console.log(chalk.cyan('  node src/index.js connect --safe') + chalk.gray(' (Safe Mode)\n'));
        process.exit(1);
    }
}
