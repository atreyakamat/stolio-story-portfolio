import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { generatePortfolio } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { portfolioId, resumeText } = await request.json();

    if (!portfolioId || !resumeText) {
      return NextResponse.json(
        { error: 'Portfolio ID and resume text are required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    });

    if (!portfolio || portfolio.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Generate new content
    const portfolioData = await generatePortfolio(resumeText);

    // Update portfolio content
    const updatedContent = await prisma.portfolioContent.update({
      where: { portfolioId },
      data: {
        name: portfolioData.name,
        title: portfolioData.title,
        tagline: portfolioData.tagline,
        bio: portfolioData.bio,
        skills: JSON.stringify(portfolioData.skills),
        projects: JSON.stringify(portfolioData.projects),
        experience: JSON.stringify(portfolioData.experience),
        links: JSON.stringify(portfolioData.links),
      },
    });

    return NextResponse.json({ content: updatedContent });
  } catch (error) {
    console.error('Portfolio regeneration error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate portfolio' },
      { status: 500 }
    );
  }
}
