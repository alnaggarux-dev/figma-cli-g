/**
 * IDS (Into Design Systems) Base color and token data
 * Includes color primitives, semantic colors, spacing, typography, and radii
 * Pure data — no logic, no dependencies
 */

export const idsColors = {
    gray: { 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' },
    primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
    accent: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e' }
};

export const idsSemanticColors = {
    'background/default': '#ffffff',
    'background/muted': '#f4f4f5',
    'background/emphasis': '#18181b',
    'foreground/default': '#18181b',
    'foreground/muted': '#71717a',
    'foreground/emphasis': '#ffffff',
    'border/default': '#e4e4e7',
    'border/focus': '#3b82f6',
    'action/primary': '#3b82f6',
    'action/primary-hover': '#2563eb',
    'feedback/success': '#22c55e',
    'feedback/success-muted': '#dcfce7',
    'feedback/warning': '#f59e0b',
    'feedback/warning-muted': '#fef3c7',
    'feedback/error': '#ef4444',
    'feedback/error-muted': '#fee2e2'
};

export const idsSpacing = {
    'xs': 4, 'sm': 8, 'md': 16, 'lg': 24, 'xl': 32, '2xl': 48, '3xl': 64
};

export const idsTypography = {
    'size/xs': 12, 'size/sm': 14, 'size/base': 16, 'size/lg': 18,
    'size/xl': 20, 'size/2xl': 24, 'size/3xl': 30, 'size/4xl': 36,
    'weight/normal': 400, 'weight/medium': 500, 'weight/semibold': 600, 'weight/bold': 700
};

export const idsRadii = {
    'none': 0, 'sm': 4, 'md': 8, 'lg': 12, 'xl': 16, 'full': 9999
};

// Component colors (derived from IDS base palette)
export const idsComponentColors = {
    primary500: '#3b82f6',
    primary600: '#2563eb',
    gray100: '#f4f4f5',
    gray200: '#e4e4e7',
    gray500: '#71717a',
    gray900: '#18181b',
    white: '#ffffff',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444'
};
