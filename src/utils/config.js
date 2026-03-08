/**
 * Configuration management for figma-cli-g
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export const CONFIG_DIR = join(homedir(), '.figma-cli-g');
export const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

/**
 * Load the CLI configuration from disk
 * @returns {Object} Config object (empty object if file doesn't exist)
 */
export function loadConfig() {
    try {
        if (existsSync(CONFIG_FILE)) {
            return JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
        }
    } catch { }
    return {};
}

/**
 * Save the CLI configuration to disk
 * @param {Object} config - Configuration object to persist
 */
export function saveConfig(config) {
    if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
