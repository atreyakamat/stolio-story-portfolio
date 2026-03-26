import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { senderName, senderEmail, message } = await request.json();

    if (!senderName || !senderEmail || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.findUnique({ where: { id } });
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        portfolioId: id,
        senderName,
        senderEmail,
        message,
      },
    });

    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
