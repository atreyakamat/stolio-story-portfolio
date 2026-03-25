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

    const { resumeText, themeStyle, themeMode } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    // Check portfolio limit (2 for free plan)
    const existingCount = await prisma.portfolio.count({
      where: { userId: authUser.userId },
    });
    if (existingCount >= 2) {
      return NextResponse.json(
        { error: 'You have reached the maximum number of portfolios (2). Delete one to create a new one.' },
        { status: 403 }
      );
    }

    // Generate portfolio content using AI
    const portfolioData = await generatePortfolio(resumeText);

    // Create unique slug
    const baseSlug = portfolioData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = baseSlug;
    let attempt = 0;
    while (await prisma.portfolio.findUnique({ where: { slug } })) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    // Create portfolio with content
    const portfolio = await prisma.portfolio.create({
      data: {
        userId: authUser.userId,
        name: portfolioData.name,
        slug,
        themeStyle: themeStyle || 'minimal',
        themeMode: themeMode || 'dark',
        content: {
          create: {
            name: portfolioData.name,
            title: portfolioData.title,
            tagline: portfolioData.tagline,
            bio: portfolioData.bio,
            skills: JSON.stringify(portfolioData.skills),
            projects: JSON.stringify(portfolioData.projects),
            experience: JSON.stringify(portfolioData.experience),
            links: JSON.stringify(portfolioData.links),
          },
        },
      },
      include: { content: true },
    });

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error('Portfolio generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate portfolio' },
      { status: 500 }
    );
  }
}

// GET all portfolios for current user
export async function GET() {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const portfolios = await prisma.portfolio.findMany({
      where: { userId: authUser.userId },
      include: { content: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ portfolios });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}
