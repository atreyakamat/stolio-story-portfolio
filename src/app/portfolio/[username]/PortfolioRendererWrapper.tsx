'use client';

import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import { PortfolioData, ThemeStyle } from '@/types/portfolio';

export function PortfolioRendererWrapper({
  data,
  themeStyle,
}: {
  data: PortfolioData;
  themeStyle: ThemeStyle;
}) {
  return <PortfolioRenderer data={data} themeStyle={themeStyle} />;
}
