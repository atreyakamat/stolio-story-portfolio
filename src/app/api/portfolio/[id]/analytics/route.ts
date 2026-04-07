import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { referrer, userAgent } = await request.json();

    const portfolio = await prisma.portfolio.findUnique({ where: { id } });
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    await prisma.viewLog.create({
      data: {
        portfolioId: id,
        referrer: referrer || null,
        userAgent: userAgent || null,
      },
    });

    await prisma.portfolio.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('View log error:', error);
    return NextResponse.json({ error: 'Failed to log view' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    const now = new Date();
    let startDate = new Date(now);
    if (period === '7d') startDate.setDate(now.getDate() - 7);
    else if (period === '30d') startDate.setDate(now.getDate() - 30);
    else if (period === '90d') startDate.setDate(now.getDate() - 90);
    else startDate.setDate(now.getDate() - 365);

    const viewLogs = await prisma.viewLog.findMany({
      where: {
        portfolioId: id,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    const totalViews = viewLogs.length;
    const uniqueReferrers = [...new Set(viewLogs.map(v => v.referrer).filter(Boolean))];
    const dailyViews: Record<string, number> = {};

    viewLogs.forEach(v => {
      const date = v.createdAt.toISOString().split('T')[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    });

    return NextResponse.json({
      totalViews,
      uniqueReferrers: uniqueReferrers.length,
      dailyViews,
      period,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
}