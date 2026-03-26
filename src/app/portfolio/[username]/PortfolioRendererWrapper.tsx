'use client';

import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import { PortfolioData, ThemeStyle } from '@/types/portfolio';

export function PortfolioRendererWrapper({
  data,
  themeStyle,
  portfolioId,
}: {
  data: PortfolioData;
  themeStyle: ThemeStyle;
  portfolioId?: string;
}) {
  return <PortfolioRenderer data={data} themeStyle={themeStyle} portfolioId={portfolioId} />;
}
