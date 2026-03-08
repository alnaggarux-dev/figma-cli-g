/**
 * Platform detection and Figma path/command helpers
 */

import { execSync, spawn } from 'child_process';
import { homedir, platform } from 'os';
import { join } from 'path';
import { getCdpPort } from '../figma-patch.js';

export const IS_WINDOWS = platform() === 'win32';
export const IS_MAC = platform() === 'darwin';
export const IS_LINUX = platform() === 'linux';

/**
 * Get the platform-specific Figma Desktop executable path
 */
export function getFigmaPath() {
    if (IS_MAC) {
        return '/Applications/Figma.app/Contents/MacOS/Figma';
    } else if (IS_WINDOWS) {
        const localAppData = process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local');
        return join(localAppData, 'Figma', 'Figma.exe');
    } else {
        return '/usr/bin/figma';
    }
}

/**
 * Launch Figma Desktop with remote debugging enabled
 */
export function startFigma() {
    const port = getCdpPort();
    const figmaPath = getFigmaPath();
    if (IS_MAC) {
        execSync(`open -a Figma --args --remote-debugging-port=${port}`, { stdio: 'pipe' });
    } else if (IS_WINDOWS) {
        spawn(figmaPath, [`--remote-debugging-port=${port}`], { detached: true, stdio: 'ignore' }).unref();
    } else {
        spawn(figmaPath, [`--remote-debugging-port=${port}`], { detached: true, stdio: 'ignore' }).unref();
    }
}

/**
 * Kill all running Figma Desktop processes
 */
export function killFigma() {
    try {
        if (IS_MAC) {
            execSync('pkill -x Figma 2>/dev/null || true', { stdio: 'pipe' });
        } else if (IS_WINDOWS) {
            execSync('taskkill /IM Figma.exe /F 2>nul', { stdio: 'pipe' });
        } else {
            execSync('pkill -x figma 2>/dev/null || true', { stdio: 'pipe' });
        }
    } catch {
        // Ignore errors if Figma wasn't running
    }
}

/**
 * Get a human-readable manual start command for the current platform
 */
export function getManualStartCommand() {
    const port = getCdpPort();
    if (IS_MAC) {
        return `open -a Figma --args --remote-debugging-port=${port}`;
    } else if (IS_WINDOWS) {
        return `"%LOCALAPPDATA%\\Figma\\Figma.exe" --remote-debugging-port=${port}`;
    } else {
        return `figma --remote-debugging-port=${port}`;
    }
}
