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

  const portfolioData: PortfolioData = {
    name: portfolio.content.name,
    title: portfolio.content.title,
    tagline: portfolio.content.tagline,
    bio: portfolio.content.bio,
    skills: JSON.parse(portfolio.content.skills),
    projects: JSON.parse(portfolio.content.projects),
    experience: JSON.parse(portfolio.content.experience),
    links: JSON.parse(portfolio.content.links),
  };

  return (
    <PortfolioRendererWrapper
      data={portfolioData}
      themeStyle={portfolio.themeStyle as ThemeStyle}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug: username },
    include: { content: true },
  });

  if (!portfolio || !portfolio.content) {
    return { title: 'Portfolio Not Found' };
  }

  return {
    title: `${portfolio.content.name} — ${portfolio.content.title} | Stolio`,
    description: portfolio.content.tagline,
  };
}
