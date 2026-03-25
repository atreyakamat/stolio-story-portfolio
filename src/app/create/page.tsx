'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiCheck, FiLoader } from 'react-icons/fi';
import { ThemeStyle } from '@/types/portfolio';
import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import type { PortfolioData } from '@/types/portfolio';

const themeOptions: { id: ThemeStyle; name: string; color: string; desc: string }[] = [
  { id: 'minimal', name: 'Minimal Developer', color: '#10b981', desc: 'Clean, neutral, developer-focused' },
  { id: 'glassmorphism', name: 'Glassmorphism', color: '#8b5cf6', desc: 'Frosted glass, translucent panels' },
  { id: 'neobrutalism', name: 'Neobrutalism', color: '#ff6b6b', desc: 'Bold borders, bright colors' },
  { id: 'y2k', name: 'Y2K Web', color: '#00ff88', desc: 'Metallic gradients, neon colors' },
  { id: 'clay', name: 'Clay UI', color: '#7c3aed', desc: 'Soft 3D, rounded shapes' },
];

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [resumeText, setResumeText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<ThemeStyle>('minimal');
  const [generating, setGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<PortfolioData | null>(null);
  const [portfolioSlug, setPortfolioSlug] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check auth
    fetch('/api/auth/me').then((res) => {
      if (!res.ok) router.push('/login');
    });
  }, [router]);

  async function handleGenerate() {
    if (!resumeText.trim()) {
      setError('Please paste your resume text');
      return;
    }

    setError('');
    setGenerating(true);

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          themeStyle: selectedTheme,
          themeMode: 'dark',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Generation failed');
        return;
      }

      const content = data.portfolio.content;
      setPortfolioSlug(data.portfolio.slug);
      setGeneratedData({
        name: content.name,
        title: content.title,
        tagline: content.tagline,
        bio: content.bio,
        skills: JSON.parse(content.skills),
        projects: JSON.parse(content.projects),
        experience: JSON.parse(content.experience),
        links: JSON.parse(content.links),
      });

      setStep(4); // Jump to preview
    } catch {
      setError('Something went wrong');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <FiArrowLeft size={16} /> Dashboard
          </Link>
          <span className="text-sm text-gray-400">Step {Math.min(step, 3)} of 3</span>
        </div>
      </nav>

      {/* Step indicators */}
      {step < 4 && (
        <div className="max-w-2xl mx-auto px-6 pt-8">
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-1 rounded-full overflow-hidden bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: step >= s ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Resume Input */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="max-w-2xl mx-auto px-6 py-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h1 className="text-3xl font-bold mb-2">Paste your resume</h1>
            <p className="text-gray-400 mb-8">
              Paste your resume text, LinkedIn summary, or professional experience. Our AI will transform it into a compelling portfolio.
            </p>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                {error}
              </div>
            )}

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={14}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none font-mono text-sm leading-relaxed"
              placeholder={`John Doe
Software Developer

EXPERIENCE
Senior Developer at TechCorp (2022-Present)
- Led team of 5 developers building microservices
- Improved system performance by 40%

Junior Developer at StartupHub (2020-2022)
- Built core product features from scratch
- Implemented CI/CD pipeline

EDUCATION
B.S. Computer Science, University of Technology (2016-2020)

SKILLS
JavaScript, TypeScript, React, Node.js, Python, PostgreSQL

PROJECTS
CloudSync - Real-time collaboration platform
AI Analyzer - ML-powered content analysis tool`}
            />

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  if (!resumeText.trim()) {
                    setError('Please paste your resume text');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold transition-all"
              >
                Next <FiArrowRight />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Theme Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="max-w-2xl mx-auto px-6 py-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h1 className="text-3xl font-bold mb-2">Choose your style</h1>
            <p className="text-gray-400 mb-8">
              Select a visual theme for your portfolio. Each theme creates a unique look and feel.
            </p>

            <div className="space-y-3">
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                    selectedTheme === t.id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0"
                    style={{
                      background: t.color,
                      borderRadius: t.id === 'neobrutalism' ? '0' : t.id === 'clay' ? '14px' : '8px',
                      boxShadow: t.id === 'neobrutalism'
                        ? `3px 3px 0 ${t.color}80`
                        : t.id === 'glassmorphism'
                          ? `0 0 20px ${t.color}40`
                          : 'none',
                    }}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-gray-400">{t.desc}</p>
                  </div>
                  {selectedTheme === t.id && (
                    <FiCheck size={20} className="text-violet-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white transition-all"
              >
                <FiArrowLeft /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold transition-all"
              >
                Next <FiArrowRight />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generate */}
        {step === 3 && (
          <motion.div
            key="step3"
            className="max-w-2xl mx-auto px-6 py-8 text-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h1 className="text-3xl font-bold mb-2">Ready to generate</h1>
            <p className="text-gray-400 mb-8">
              Your portfolio will be created using the{' '}
              <span className="font-semibold capitalize text-white">{selectedTheme}</span> theme.
              AI will process your resume and generate all sections.
            </p>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4 text-left">
                {error}
              </div>
            )}

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white transition-all"
                disabled={generating}
              >
                <FiArrowLeft /> Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-semibold transition-all disabled:opacity-60 shadow-lg shadow-violet-500/20"
              >
                {generating ? (
                  <>
                    <FiLoader size={18} className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    Generate Portfolio <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && generatedData && (
          <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Success bar */}
            <div className="border-b border-white/5 bg-emerald-500/5">
              <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <FiCheck size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Portfolio generated!</p>
                    <p className="text-xs text-gray-400">
                      Public URL: <span className="font-mono text-emerald-400">/portfolio/{portfolioSlug}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/portfolio/${portfolioSlug}`}
                    target="_blank"
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                  >
                    View Public Page
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 text-sm font-medium transition-all"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>

            {/* Rendered Portfolio Preview */}
            <PortfolioRenderer data={generatedData} themeStyle={selectedTheme} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
