import { ThemeConfig, ThemeStyle } from '@/types/portfolio';

export const themes: Record<ThemeStyle, ThemeConfig> = {
  minimal: {
    name: 'Minimal Developer',
    style: 'minimal',
    colors: {
      primary: '#10b981',
      secondary: '#6366f1',
      accent: '#f59e0b',
      background: '#0a0a0a',
      surface: '#141414',
      text: '#e5e7eb',
      textSecondary: '#9ca3af',
      border: '#262626',
    },
    fonts: {
      heading: "'Geist', system-ui, sans-serif",
      body: "'Geist', system-ui, sans-serif",
      mono: "'Geist Mono', monospace",
    },
    borderRadius: '8px',
    shadow: '0 1px 3px rgba(0,0,0,0.3)',
  },
  glassmorphism: {
    name: 'Glassmorphism',
    style: 'glassmorphism',
    colors: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      accent: '#ec4899',
      background: '#0f0320',
      surface: 'rgba(255,255,255,0.05)',
      text: '#f8fafc',
      textSecondary: '#c4b5fd',
      border: 'rgba(255,255,255,0.1)',
    },
    fonts: {
      heading: "'Geist', system-ui, sans-serif",
      body: "'Geist', system-ui, sans-serif",
      mono: "'Geist Mono', monospace",
    },
    borderRadius: '16px',
    shadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
  },
  neobrutalism: {
    name: 'Neobrutalism',
    style: 'neobrutalism',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
      background: '#1a1a2e',
      surface: '#16213e',
      text: '#f0f0f0',
      textSecondary: '#b8b8d4',
      border: '#f0f0f0',
    },
    fonts: {
      heading: "'Geist', system-ui, sans-serif",
      body: "'Geist', system-ui, sans-serif",
      mono: "'Geist Mono', monospace",
    },
    borderRadius: '0px',
    shadow: '4px 4px 0px #f0f0f0',
  },
  y2k: {
    name: 'Y2K Web',
    style: 'y2k',
    colors: {
      primary: '#00ff88',
      secondary: '#ff00ff',
      accent: '#00ffff',
      background: '#0a0015',
      surface: '#1a0030',
      text: '#e0e0ff',
      textSecondary: '#a0a0d0',
      border: '#ff00ff55',
    },
    fonts: {
      heading: "'Geist', system-ui, sans-serif",
      body: "'Geist', system-ui, sans-serif",
      mono: "'Geist Mono', monospace",
    },
    borderRadius: '4px',
    shadow: '0 0 20px rgba(0, 255, 136, 0.3)',
  },
  clay: {
    name: 'Clay UI',
    style: 'clay',
    colors: {
      primary: '#7c3aed',
      secondary: '#f472b6',
      accent: '#fbbf24',
      background: '#1e1b2e',
      surface: '#2a2640',
      text: '#f1f0f5',
      textSecondary: '#a8a4c0',
      border: '#3d3860',
    },
    fonts: {
      heading: "'Geist', system-ui, sans-serif",
      body: "'Geist', system-ui, sans-serif",
      mono: "'Geist Mono', monospace",
    },
    borderRadius: '20px',
    shadow: '0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
};

export function getTheme(style: ThemeStyle): ThemeConfig {
  return themes[style] || themes.minimal;
}
