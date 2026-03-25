'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ThemeConfig, ThemeStyle } from '@/types/portfolio';
import { getTheme } from '@/themes';

interface ThemeContextValue {
  theme: ThemeConfig;
  style: ThemeStyle;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: getTheme('minimal'),
  style: 'minimal',
});

export function ThemeProvider({
  style,
  children,
}: {
  style: ThemeStyle;
  children: ReactNode;
}) {
  const theme = getTheme(style);

  return (
    <ThemeContext.Provider value={{ theme, style }}>
      <div
        style={{
          '--theme-primary': theme.colors.primary,
          '--theme-secondary': theme.colors.secondary,
          '--theme-accent': theme.colors.accent,
          '--theme-bg': theme.colors.background,
          '--theme-surface': theme.colors.surface,
          '--theme-text': theme.colors.text,
          '--theme-text-secondary': theme.colors.textSecondary,
          '--theme-border': theme.colors.border,
          '--theme-radius': theme.borderRadius,
          '--theme-shadow': theme.shadow,
          '--theme-font-heading': theme.fonts.heading,
          '--theme-font-body': theme.fonts.body,
          '--theme-font-mono': theme.fonts.mono,
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
        } as React.CSSProperties}
        className="min-h-screen"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
