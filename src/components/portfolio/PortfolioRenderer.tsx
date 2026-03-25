'use client';

import { ThemeProvider } from './ThemeProvider';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { TimelineSection } from './TimelineSection';
import { ContactSection } from './ContactSection';
import { PortfolioData, ThemeStyle } from '@/types/portfolio';

interface PortfolioRendererProps {
  data: PortfolioData;
  themeStyle: ThemeStyle;
}

export function PortfolioRenderer({ data, themeStyle }: PortfolioRendererProps) {
  return (
    <ThemeProvider style={themeStyle}>
      <HeroSection data={data} />
      <AboutSection data={data} />
      <SkillsSection skills={data.skills} />
      <ProjectsSection projects={data.projects} />
      <TimelineSection experience={data.experience} />
      <ContactSection links={data.links} />
    </ThemeProvider>
  );
}
