import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug: username },
      include: { content: true },
    });

    if (!portfolio || !portfolio.isPublished) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error('Portfolio fetch by username error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}
