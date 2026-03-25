import { PortfolioData } from '@/types/portfolio';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

function generateMockPortfolio(resumeText: string): PortfolioData {
  // Parse some basic info from resume text
  const lines = resumeText.split('\n').filter(l => l.trim());
  const name = lines[0]?.trim() || 'John Doe';

  // Try to detect title from second line or fallback
  const title = lines[1]?.trim() || 'Software Developer';

  return {
    name,
    title,
    tagline: `Turning complex problems into elegant solutions — ${title} passionate about building what matters.`,
    bio: `I'm ${name}, a dedicated ${title} with a passion for crafting exceptional digital experiences. My journey in technology has been driven by curiosity and a relentless desire to build solutions that make a real difference. With expertise spanning modern frameworks and cloud technologies, I bring ideas to life through clean code and thoughtful architecture.\n\nBeyond technical skills, I believe in the power of collaboration and continuous learning. Every project is an opportunity to push boundaries and create something meaningful.`,
    skills: [
      { name: 'JavaScript', category: 'Frontend' },
      { name: 'TypeScript', category: 'Frontend' },
      { name: 'React', category: 'Frontend' },
      { name: 'Next.js', category: 'Frontend' },
      { name: 'Node.js', category: 'Backend' },
      { name: 'Python', category: 'Backend' },
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'Docker', category: 'DevOps' },
      { name: 'Git', category: 'Tools' },
      { name: 'Figma', category: 'Design' },
    ],
    projects: [
      {
        name: 'CloudSync Platform',
        description: 'A real-time collaboration platform enabling teams to sync documents and data across devices seamlessly. Built with WebSocket architecture for instant updates.',
        technologies: ['React', 'Node.js', 'WebSocket', 'PostgreSQL'],
        link: 'https://example.com/cloudsync',
        github: 'https://github.com/username/cloudsync',
      },
      {
        name: 'AI Content Analyzer',
        description: 'Machine learning powered tool that analyzes content sentiment, readability, and SEO score. Features an intuitive dashboard with real-time analysis.',
        technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
        github: 'https://github.com/username/ai-analyzer',
      },
      {
        name: 'DevMetrics Dashboard',
        description: 'Developer productivity tracking dashboard that integrates with GitHub, Jira, and Slack to provide actionable insights on team performance.',
        technologies: ['Next.js', 'TypeScript', 'D3.js', 'Prisma'],
        link: 'https://example.com/devmetrics',
      },
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        organization: 'TechCorp Inc.',
        period: '2022 - Present',
        description: 'Leading development of microservices architecture serving 1M+ users. Mentoring junior developers and driving technical decisions.',
        type: 'work',
      },
      {
        title: 'Software Developer',
        organization: 'StartupHub',
        period: '2020 - 2022',
        description: 'Built and scaled the core product from 0 to 100K users. Implemented CI/CD pipelines and automated testing frameworks.',
        type: 'work',
      },
      {
        title: 'B.S. Computer Science',
        organization: 'University of Technology',
        period: '2016 - 2020',
        description: 'Graduated with honors. Focused on algorithms, distributed systems, and machine learning.',
        type: 'education',
      },
    ],
    links: [
      { platform: 'email', url: 'mailto:hello@example.com', label: 'hello@example.com' },
      { platform: 'github', url: 'https://github.com/username', label: 'GitHub' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/username', label: 'LinkedIn' },
      { platform: 'twitter', url: 'https://twitter.com/username', label: 'Twitter' },
    ],
  };
}

async function generateWithOllama(resumeText: string): Promise<PortfolioData | null> {
  try {
    const prompt = `You are an AI that converts resume text into structured portfolio data. 
Given the following resume text, extract and generate a JSON object with this exact structure:
{
  "name": "Full Name",
  "title": "Professional Title",
  "tagline": "A compelling professional tagline",
  "bio": "A 2-3 paragraph professional bio written in first person",
  "skills": [{"name": "Skill", "category": "Category"}],
  "projects": [{"name": "Project", "description": "Description", "technologies": ["Tech"], "link": "URL", "github": "URL"}],
  "experience": [{"title": "Title", "organization": "Org", "period": "Period", "description": "Description", "type": "work|education|internship"}],
  "links": [{"platform": "email|github|linkedin|twitter", "url": "URL", "label": "Label"}]
}

Resume text:
${resumeText}

Return ONLY valid JSON, no other text.`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const parsed = JSON.parse(data.response);
    return parsed as PortfolioData;
  } catch {
    return null;
  }
}

export async function generatePortfolio(resumeText: string): Promise<PortfolioData> {
  // Try Ollama first, fall back to mock
  const ollamaResult = await generateWithOllama(resumeText);
  if (ollamaResult) return ollamaResult;

  return generateMockPortfolio(resumeText);
}
