'use client';

import { ThemeProvider } from './ThemeProvider';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { TimelineSection } from './TimelineSection';
import { ContactSection } from './ContactSection';
import { PortfolioAssistant } from './PortfolioAssistant';
import { PortfolioData, ThemeStyle } from '@/types/portfolio';

interface PortfolioRendererProps {
  data: PortfolioData;
  themeStyle: ThemeStyle;
  portfolioId?: string;
}

export function PortfolioRenderer({ data, themeStyle, portfolioId }: PortfolioRendererProps) {
  return (
    <ThemeProvider style={themeStyle}>
      <HeroSection data={data} />
      <AboutSection data={data} />
      <SkillsSection skills={data.skills} />
      <ProjectsSection projects={data.projects} />
      <TimelineSection experience={data.experience} />
      <ContactSection links={data.links} />
      
      {portfolioId && (
        <PortfolioAssistant portfolioId={portfolioId} name={data.name} />
      )}
    </ThemeProvider>
  );
}
