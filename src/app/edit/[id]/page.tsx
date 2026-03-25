'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiEye } from 'react-icons/fi';
import { PortfolioData, ThemeStyle } from '@/types/portfolio';

const themeOptions: ThemeStyle[] = ['minimal', 'glassmorphism', 'neobrutalism', 'y2k', 'clay'];

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>('minimal');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/portfolio/${id}`);
      if (!res.ok) {
        router.push('/dashboard');
        return;
      }

      const { portfolio } = await res.json();
      setThemeStyle(portfolio.themeStyle as ThemeStyle);
      setSlug(portfolio.slug);
      setData({
        name: portfolio.content.name,
        title: portfolio.content.title,
        tagline: portfolio.content.tagline,
        bio: portfolio.content.bio,
        skills: JSON.parse(portfolio.content.skills),
        projects: JSON.parse(portfolio.content.projects),
        experience: JSON.parse(portfolio.content.experience),
        links: JSON.parse(portfolio.content.links),
      });
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setSaved(false);

    try {
      await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeStyle,
          content: data,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <FiArrowLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-3">
            {saved && (
              <motion.span
                className="text-sm text-emerald-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✓ Saved
              </motion.span>
            )}
            <Link
              href={`/portfolio/${slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors"
            >
              <FiEye size={14} /> Preview
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 text-sm font-medium transition-all disabled:opacity-50"
            >
              <FiSave size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Theme selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
          <div className="flex flex-wrap gap-2">
            {themeOptions.map((t) => (
              <button
                key={t}
                onClick={() => setThemeStyle(t)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                  themeStyle === t
                    ? 'bg-violet-500/20 border-violet-500 text-white'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                } border`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Basic fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Name"
            value={data.name}
            onChange={(v) => setData({ ...data, name: v })}
          />
          <Field
            label="Title"
            value={data.title}
            onChange={(v) => setData({ ...data, title: v })}
          />
        </div>

        <Field
          label="Tagline"
          value={data.tagline}
          onChange={(v) => setData({ ...data, tagline: v })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
          <textarea
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none text-sm"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Skills <span className="text-gray-500">(comma-separated)</span>
          </label>
          <input
            value={data.skills.map((s) => s.name).join(', ')}
            onChange={(e) => {
              const names = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
              setData({ ...data, skills: names.map((name) => ({ name })) });
            }}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
      />
    </div>
  );
}
