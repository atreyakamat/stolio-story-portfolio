export interface Skill {
  name: string;
  category?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

export interface Experience {
  title: string;
  organization: string;
  period: string;
  description: string;
  type: 'work' | 'education' | 'internship';
}

export interface SocialLink {
  platform: string;
  url: string;
  label?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  links: SocialLink[];
}

export type ThemeStyle = 'minimal' | 'glassmorphism' | 'neobrutalism' | 'y2k' | 'clay';
export type ThemeMode = 'light' | 'dark' | 'mixed';

export interface ThemeConfig {
  name: string;
  style: ThemeStyle;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  borderRadius: string;
  shadow: string;
}

export interface PortfolioWithContent {
  id: string;
  slug: string;
  themeStyle: ThemeStyle;
  themeMode: ThemeMode;
  name: string;
  isPublished: boolean;
  createdAt: string;
  content: PortfolioData;
}
