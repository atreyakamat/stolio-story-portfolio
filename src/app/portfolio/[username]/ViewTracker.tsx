'use client';

import { useEffect } from 'react';
import { useTheme } from '@/components/portfolio/ThemeProvider';

export function ViewTracker({ portfolioId }: { portfolioId: string }) {
  const { style, theme } = useTheme();

  useEffect(() => {
    fetch(`/api/portfolio/${portfolioId}/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }, [portfolioId]);

  return null;
}