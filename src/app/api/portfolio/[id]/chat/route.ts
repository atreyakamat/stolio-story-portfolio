import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-lite:preview';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { message, chatHistory } = await request.json();

    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: { content: true },
    });

    if (!portfolio || !portfolio.content) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const context = `
      You are an AI assistant representing ${portfolio.content.name}, a ${portfolio.content.title}.
      Your job is to answer questions from recruiters or potential collaborators based on the portfolio data provided.
      Be professional, polite, and confident. 

      ${portfolio.content.name}'s Profile:
      - Tagline: ${portfolio.content.tagline}
      - Bio: ${portfolio.content.bio}
      - Skills: ${portfolio.content.skills}
      - Projects: ${portfolio.content.projects}
      - Experience: ${portfolio.content.experience}

      Keep answers relatively concise (1-2 paragraphs). If you don't know the answer because it's not in the data, 
      be honest but helpful, e.g., "I don't have that specific information here, but you can reach out via the contact form!"
    `;

    // Try Ollama first
    try {
      const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          messages: [
            { role: 'system', content: context },
            ...(chatHistory || []),
            { role: 'user', content: message }
          ],
          stream: false,
        }),
      });

      if (ollamaRes.ok) {
        const data = await ollamaRes.json();
        return NextResponse.json({ response: data.message.content });
      }
    } catch (e) {
      console.warn('Ollama chat failed, falling back...');
    }

    // Fallback to OpenRouter
    if (OPENROUTER_API_KEY) {
      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://stolio.app',
          'X-Title': 'Stolio AI Twin',
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: 'system', content: context },
            ...(chatHistory || []),
            { role: 'user', content: message }
          ],
        }),
      });

      if (openRouterRes.ok) {
        const data = await openRouterRes.json();
        return NextResponse.json({ response: data.choices[0]?.message?.content });
      }
    }

    return NextResponse.json({ response: "I'm sorry, I'm having trouble thinking right now. Please try again or use the contact form!" });
  } catch (error) {
    console.error('AI Twin Error:', error);
    return NextResponse.json({ error: 'Failed to chat' }, { status: 500 });
  }
}
