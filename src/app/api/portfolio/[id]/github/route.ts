import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'GitHub username required' }, { status: 400 });
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers,
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ repos: [] });
      }
      return NextResponse.json({ error: 'Failed to fetch repos' }, { status: res.status });
    }

    const repos = await res.json();

    const formattedRepos = repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated: repo.updated_at,
    }));

    return NextResponse.json({ repos: formattedRepos });
  } catch (error) {
    console.error('GitHub sync error:', error);
    return NextResponse.json({ error: 'Failed to sync GitHub' }, { status: 500 });
  }
}