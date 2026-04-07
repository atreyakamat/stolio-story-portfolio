import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ThemeStyle, PortfolioData } from '@/types/portfolio';
import { PortfolioRendererWrapper } from './PortfolioRendererWrapper';

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    include: { content: true },
  });

  if (!portfolio || !portfolio.isPublished || !portfolio.content) {
    notFound();
  }

  const content = portfolio.content;

  const portfolioData: PortfolioData = {
    name: content.name,
    title: content.title,
    tagline: content.tagline,
    bio: content.bio,
    skills: JSON.parse(content.skills),
    projects: JSON.parse(content.projects),
    experience: JSON.parse(content.experience),
    links: JSON.parse(content.links),
  };

  return (
    <PortfolioRendererWrapper
      data={portfolioData}
      themeStyle={portfolio.themeStyle as ThemeStyle}
      portfolioId={portfolio.id}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    include: { content: true },
  });

  if (!portfolio || !portfolio.content) {
    return { title: 'Portfolio Not Found' };
  }

  const content = portfolio.content;

  return {
    title: `${content.name} — ${content.title} | Stolio`,
    description: content.tagline,
    openGraph: {
      title: `${content.name} — ${content.title}`,
      description: content.tagline,
      type: 'profile',
    },
  };
}