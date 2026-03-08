/**
 * Color conversion and variable binding utilities for Figma
 */

/**
 * Convert hex color string to Figma RGB object (0-1 range)
 * Supports both #RGB and #RRGGBB formats
 * @param {string} hex - Hex color string (e.g., '#FF0000' or '#F00')
 * @returns {{ r: number, g: number, b: number }}
 */
export function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');

    // Expand 3-char hex to 6-char
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new Error(`Invalid hex color: #${hex}`);
    }
    return {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    };
}

/**
 * Check if a value is a Figma variable reference (var:name syntax)
 * @param {string} value
 * @returns {boolean}
 */
export function isVarRef(value) {
    return typeof value === 'string' && value.startsWith('var:');
}

/**
 * Extract variable name from var:name syntax
 * @param {string} value
 * @returns {string}
 */
export function getVarName(value) {
    return value.slice(4);
}

/**
 * Generate Figma Plugin API fill code (hex or variable binding)
 * @param {string} color - Hex color or var:name reference
 * @param {string} nodeVar - Variable name of the node in generated code
 * @param {string} property - Property name ('fills' or 'strokes')
 * @returns {{ code: string, usesVars: boolean }}
 */
export function generateFillCode(color, nodeVar = 'node', property = 'fills') {
    if (isVarRef(color)) {
        const varName = getVarName(color);
        return {
            code: `${nodeVar}.${property} = [boundFill(vars['${varName}'])];`,
            usesVars: true
        };
    }
    const { r, g, b } = hexToRgb(color);
    return {
        code: `${nodeVar}.${property} = [{ type: 'SOLID', color: { r: ${r}, g: ${g}, b: ${b} } }];`,
        usesVars: false
    };
}

/**
 * Generate Figma Plugin API stroke code (hex or variable binding)
 * @param {string} color - Hex color or var:name reference
 * @param {string} nodeVar - Variable name of the node in generated code
 * @param {number} weight - Stroke weight in pixels
 * @returns {{ code: string, usesVars: boolean }}
 */
export function generateStrokeCode(color, nodeVar = 'node', weight = 1) {
    if (isVarRef(color)) {
        const varName = getVarName(color);
        return {
            code: `${nodeVar}.strokes = [boundFill(vars['${varName}'])]; ${nodeVar}.strokeWeight = ${weight};`,
            usesVars: true
        };
    }
    const { r, g, b } = hexToRgb(color);
    return {
        code: `${nodeVar}.strokes = [{ type: 'SOLID', color: { r: ${r}, g: ${g}, b: ${b} } }]; ${nodeVar}.strokeWeight = ${weight};`,
        usesVars: false
    };
}

/**
 * Generate Figma Plugin API variable loading code (for shadcn collections)
 * @returns {string} JavaScript code string to load variables
 */
export function varLoadingCode() {
    return `
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const vars = {};
// Load variables from shadcn collections (shadcn/semantic and shadcn/primitives)
for (const col of collections) {
  if (col.name.startsWith('shadcn')) {
    for (const id of col.variableIds) {
      const v = await figma.variables.getVariableByIdAsync(id);
      if (v) vars[v.name] = v;
    }
  }
}
const boundFill = (variable) => figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }, 'color', variable
);
`;
}

/**
 * Generate smart positioning code for Figma canvas
 * Returns JS code that calculates the next free X position
 * @param {number} gap - Pixels of gap after the rightmost element
 * @returns {string} JavaScript code string
 */
export function smartPosCode(gap = 100) {
    return `
const children = figma.currentPage.children;
let smartX = 0;
if (children.length > 0) {
  children.forEach(n => { smartX = Math.max(smartX, n.x + n.width); });
  smartX += ${gap};
}
`;
}
