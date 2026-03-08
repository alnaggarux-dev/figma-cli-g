/**
 * Cross-platform sync HTTP helpers
 * Replaces curl/Invoke-WebRequest with Node.js child process
 */

import { execSync } from 'child_process';

/**
 * Synchronous HTTP GET request using a spawned Node.js process
 * @param {string} url - URL to fetch
 * @param {Object} headers - Request headers
 * @returns {string|null} Response body or null on error
 */
export function httpGetSync(url, headers = {}) {
    try {
        const nodeScript = `const http = require('http'); const url = new URL('${url}'); const opts = { hostname: url.hostname, port: url.port, path: url.pathname, timeout: 2000, headers: ${JSON.stringify(headers)} }; const req = http.get(opts, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { process.stdout.write(d); }); }); req.on('error', () => process.exit(1)); req.end();`;
        return execSync(`node -e "${nodeScript.replace(/"/g, '\\"')}"`, { encoding: 'utf8', stdio: 'pipe', timeout: 3000 });
    } catch {
        return null;
    }
}

/**
 * Synchronous HTTP POST request using a spawned Node.js process
 * @param {string} url - URL to post to
 * @param {Object} body - JSON body to send
 * @param {Object} headers - Request headers
 * @returns {string|null} Response body or null on error
 */
export function httpPostSync(url, body, headers = {}) {
    try {
        const allHeaders = { 'Content-Type': 'application/json', ...headers };
        const nodeScript = `const http = require('http'); const url = new URL('${url}'); const data = Buffer.from(${JSON.stringify(JSON.stringify(body))}); const opts = { hostname: url.hostname, port: url.port, path: url.pathname, method: 'POST', timeout: 60000, headers: { ${Object.entries(allHeaders).map(([k, v]) => `'${k}': '${v}'`).join(', ')}, 'Content-Length': data.length } }; const req = http.request(opts, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => process.stdout.write(d)); }); req.on('error', e => { process.stderr.write(e.message); process.exit(1); }); req.write(data); req.end();`;
        return execSync(`node -e "${nodeScript.replace(/"/g, '\\"')}"`, { encoding: 'utf8', stdio: 'pipe', timeout: 62000 });
    } catch {
        return null;
    }
}
