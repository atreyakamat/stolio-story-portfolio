'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiZap, FiLayout, FiEdit3, FiGlobe, FiLayers } from 'react-icons/fi';

const features = [
  { icon: <FiZap size={24} />, title: 'AI-Powered', desc: 'Paste your resume and watch AI transform it into a compelling narrative.' },
  { icon: <FiLayout size={24} />, title: '5 Stunning Themes', desc: 'Choose from Minimal, Glassmorphism, Neobrutalism, Y2K, or Clay UI.' },
  { icon: <FiEdit3 size={24} />, title: 'Easy Editing', desc: 'Update your portfolio with simple field edits or AI-powered prompts.' },
  { icon: <FiGlobe size={24} />, title: 'Instant Publishing', desc: 'Get a shareable public link to send to recruiters and connections.' },
  { icon: <FiLayers size={24} />, title: 'Animated Sections', desc: 'Hero, About, Skills, Projects, Timeline, and Contact — all animated.' },
];

const themePreviewColors = [
  { name: 'Minimal', color: '#10b981', bg: '#0a0a0a' },
  { name: 'Glass', color: '#8b5cf6', bg: '#0f0320' },
  { name: 'Neobrutal', color: '#ff6b6b', bg: '#1a1a2e' },
  { name: 'Y2K', color: '#00ff88', bg: '#0a0015' },
  { name: 'Clay', color: '#7c3aed', bg: '#1e1b2e' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Stolio
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16 relative">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] bg-gradient-to-r from-violet-500 to-emerald-500 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-300 text-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              ✨ AI-Powered Portfolio Generation
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]">
              Your resume,{' '}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
                reimagined
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stolio transforms your professional experience into a stunning, story-driven
              portfolio website. No design skills needed — just paste your resume and let AI do the magic.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold text-base transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
              >
                Create Your Portfolio
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="px-8 py-4 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all text-base"
              >
                See How It Works
              </Link>
            </div>
          </motion.div>

          {/* Theme preview pills */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {themePreviewColors.map((t, i) => (
              <motion.div
                key={t.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5"
                style={{ background: `${t.bg}cc` }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                whileHover={{ scale: 1.05, borderColor: t.color }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                <span className="text-xs text-gray-300">{t.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for a{' '}
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                perfect portfolio
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              From AI-powered content generation to stunning visual themes — Stolio handles it all.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Three steps to your{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
              dream portfolio
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Paste Your Resume', desc: 'Simply paste your resume text or upload a file. Our AI handles the rest.' },
              { step: '02', title: 'Choose a Style', desc: 'Pick from 5 stunning visual themes. Each one creates a unique look and feel.' },
              { step: '03', title: 'Publish & Share', desc: 'Get an instant public URL to share with recruiters, on LinkedIn, or anywhere.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div
                  className="text-5xl font-bold mb-4 bg-gradient-to-br from-violet-400/30 to-emerald-400/30 bg-clip-text text-transparent"
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent pointer-events-none" />
        <motion.div
          className="max-w-2xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to stand out?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join Stolio and create your AI-powered portfolio in minutes. It&apos;s free to start.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white font-semibold transition-all shadow-lg shadow-violet-500/20"
          >
            Get Started Free <FiArrowRight />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm text-gray-500">
            © 2026 <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent font-semibold">Stolio</span>. All rights reserved.
          </span>
          <span className="text-xs text-gray-600">AI-powered portfolio generation</span>
        </div>
      </footer>
    </div>
  );
}
