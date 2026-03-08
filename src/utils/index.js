/**
 * Utility barrel export
 * Import all utilities from a single import path:
 *   import { httpGetSync, IS_WINDOWS, hexToRgb, loadConfig } from './utils/index.js';
 */

export { httpGetSync, httpPostSync } from './http.js';
export { IS_WINDOWS, IS_MAC, IS_LINUX, getFigmaPath, startFigma, killFigma, getManualStartCommand } from './platform.js';
export { hexToRgb, isVarRef, getVarName, generateFillCode, generateStrokeCode, varLoadingCode, smartPosCode } from './color.js';
export { loadConfig, saveConfig, CONFIG_DIR, CONFIG_FILE } from './config.js';
