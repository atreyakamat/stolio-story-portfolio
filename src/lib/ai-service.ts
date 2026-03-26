import { PortfolioData } from '@/types/portfolio';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-lite:preview';

function generateMockPortfolio(resumeText: string): PortfolioData {
  // Parse some basic info from resume text
  const lines = resumeText.split('\n').filter(l => l.trim());
  const name = lines[0]?.trim() || 'Professional';

  // Try to detect title from second line or fallback
  const title = lines[1]?.trim() || 'Software Engineer';

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
        name: 'Portfolio Builder',
        description: 'An AI-powered portfolio generator that helps developers showcase their work beautifully.',
        technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
      },
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        organization: 'Innovation Lab',
        period: '2022 - Present',
        description: 'Building modern web applications using cutting-edge technologies.',
        type: 'work',
      },
    ],
    links: [
      { platform: 'email', url: 'mailto:hello@example.com', label: 'Email' },
    ],
  };
}

const GENERATION_PROMPT = (resumeText: string) => `You are an expert personal branding consultant and copywriter.
Given the following resume text, extract information and write a highly compelling, personalized story for a developer portfolio.
Be creative and ensure the tone is professional but unique and engaging.

Resume text:
${resumeText}

Generate a JSON object with this exact structure:
{
  "name": "Full Name",
  "title": "Professional Title (make it catchy and accurate)",
  "tagline": "A unique and compelling one-sentence professional tagline that captures their essence",
  "bio": "A 2-3 paragraph professional bio written in first person. Focus on their story, passion, and unique value proposition.",
  "skills": [{"name": "Skill", "category": "Category (e.g., Frontend, Backend, Tools, Soft Skills)"}],
  "projects": [{"name": "Project Name", "description": "Engaging description of the project and its impact", "technologies": ["Tech"], "link": "Optional URL", "github": "Optional GitHub URL"}],
  "experience": [{"title": "Job Title or Degree", "organization": "Company or School", "period": "e.g., 2020 - 2024", "description": "Key achievements and responsibilities", "type": "work|education|internship"}],
  "links": [{"platform": "email|github|linkedin|twitter|website", "url": "URL", "label": "Label"}]
}

IMPORTANT:
1. Return ONLY valid JSON, no other text or explanation.
2. If certain links or projects are missing from the resume, create reasonable placeholders or omit them.
3. Ensure the bio is high-quality and flows well.
4. Categories for skills should be consistent (e.g., all "Frontend" not "Front-end").`;

async function generateWithOllama(resumeText: string): Promise<PortfolioData | null> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (OLLAMA_API_KEY) {
      headers['Authorization'] = `Bearer ${OLLAMA_API_KEY}`;
    }

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: GENERATION_PROMPT(resumeText),
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      console.warn(`Ollama failed: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const parsed = JSON.parse(data.response);
    return parsed as PortfolioData;
  } catch (error) {
    console.error('Ollama error:', error);
    return null;
  }
}

async function generateWithOpenRouter(resumeText: string): Promise<PortfolioData | null> {
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API Key not configured');
    return null;
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://stolio.app', // Required by OpenRouter
        'X-Title': 'Stolio Story Portfolio',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional portfolio writer. You always respond with valid JSON.'
          },
          {
            role: 'user',
            content: GENERATION_PROMPT(resumeText),
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      console.warn(`OpenRouter failed: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content) as PortfolioData;
  } catch (error) {
    console.error('OpenRouter error:', error);
    return null;
  }
}

export async function generatePortfolio(resumeText: string): Promise<PortfolioData> {
  // Try Ollama first
  const ollamaResult = await generateWithOllama(resumeText);
  if (ollamaResult) {
    console.log('Successfully generated with Ollama');
    return ollamaResult;
  }

  // Fallback to OpenRouter
  const openRouterResult = await generateWithOpenRouter(resumeText);
  if (openRouterResult) {
    console.log('Successfully generated with OpenRouter');
    return openRouterResult;
  }

  console.warn('All AI generators failed, falling back to mock data');
  return generateMockPortfolio(resumeText);
}
