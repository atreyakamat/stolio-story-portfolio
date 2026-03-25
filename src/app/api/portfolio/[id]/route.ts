import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: { content: true },
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const portfolio = await prisma.portfolio.findUnique({ where: { id } });

    if (!portfolio || portfolio.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    const body = await request.json();
    const { themeStyle, themeMode, content } = body;

    // Update portfolio metadata
    const updateData: Record<string, unknown> = {};
    if (themeStyle) updateData.themeStyle = themeStyle;
    if (themeMode) updateData.themeMode = themeMode;

    await prisma.portfolio.update({
      where: { id },
      data: updateData,
    });

    // Update content if provided
    if (content) {
      await prisma.portfolioContent.update({
        where: { portfolioId: id },
        data: {
          name: content.name,
          title: content.title,
          tagline: content.tagline,
          bio: content.bio,
          skills: typeof content.skills === 'string' ? content.skills : JSON.stringify(content.skills),
          projects: typeof content.projects === 'string' ? content.projects : JSON.stringify(content.projects),
          experience: typeof content.experience === 'string' ? content.experience : JSON.stringify(content.experience),
          links: typeof content.links === 'string' ? content.links : JSON.stringify(content.links),
        },
      });
    }

    const updated = await prisma.portfolio.findUnique({
      where: { id },
      include: { content: true },
    });

    return NextResponse.json({ portfolio: updated });
  } catch (error) {
    console.error('Portfolio update error:', error);
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const portfolio = await prisma.portfolio.findUnique({ where: { id } });

    if (!portfolio || portfolio.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    await prisma.portfolio.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Portfolio delete error:', error);
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 });
  }
}
