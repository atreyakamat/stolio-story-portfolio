'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiExternalLink, FiEdit, FiLogOut, FiEye, FiMail, FiX, FiClock, FiBarChart2 } from 'react-icons/fi';

interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  message: string;
  createdAt: string;
}

interface PortfolioAnalytics {
  totalViews: number;
  uniqueReferrers: number;
  dailyViews: Record<string, number>;
  period: string;
}

interface Portfolio {
  id: string;
  name: string;
  slug: string;
  themeStyle: string;
  themeMode: string;
  views: number;
  createdAt: string;
  messages?: ContactMessage[];
  analytics?: PortfolioAnalytics;
}

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [selectedPortfolioMessages, setSelectedPortfolioMessages] = useState<ContactMessage[] | null>(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [selectedPortfolioAnalytics, setSelectedPortfolioAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const [userRes, portfolioRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/portfolio'),
        ]);

        if (!userRes.ok) {
          router.push('/login');
          return;
        }

        const userData = await userRes.json();
        setUserName(userData.user?.name || userData.user?.email || 'User');

        if (portfolioRes.ok) {
          const data = await portfolioRes.json();
          // The API needs to return messages too, or we fetch them separately
          setPortfolios(data.portfolios);
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function fetchMessages(id: string) {
    try {
      const res = await fetch(`/api/portfolio/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPortfolioMessages(data.messages);
        setIsMessagesOpen(true);
      }
    } catch {
      alert('Failed to load messages');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPortfolios((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert('Failed to delete portfolio');
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  async function fetchAnalytics(id: string, period: string = '30d') {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/portfolio/${id}/analytics?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPortfolioAnalytics(data);
        setIsAnalyticsOpen(true);
      }
    } catch {
      alert('Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }

  const themeColors: Record<string, string> = {
    minimal: '#10b981',
    glassmorphism: '#8b5cf6',
    neobrutalism: '#ff6b6b',
    y2k: '#00ff88',
    clay: '#7c3aed',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
              Stolio
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Welcome, {userName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FiLogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">Your Portfolios</h1>
            <p className="text-gray-400 mt-1 text-sm">{portfolios.length} of 2 portfolios used</p>
          </div>
          {portfolios.length < 2 && (
            <Link
              href="/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-medium text-sm transition-all shadow-lg shadow-violet-500/20"
            >
              <FiPlus size={16} /> New Portfolio
            </Link>
          )}
        </div>

        {/* Portfolio Grid */}
        {portfolios.length === 0 ? (
          <motion.div
            className="text-center py-20 rounded-2xl border border-dashed border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <FiPlus size={24} className="text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
            <p className="text-gray-400 text-sm mb-6">Create your first AI-generated portfolio in minutes.</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-medium text-sm transition-all"
            >
              <FiPlus size={16} /> Create Portfolio
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolios.map((portfolio, i) => (
              <motion.div
                key={portfolio.id}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{portfolio.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: themeColors[portfolio.themeStyle] || '#888' }}
                      />
                      <span className="text-xs text-gray-400 capitalize">{portfolio.themeStyle}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4 font-mono">
                  /portfolio/{portfolio.slug}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                    <FiEye size={12} className="text-emerald-400" />
                    <span>{portfolio.views} views</span>
                  </div>
                  <button 
                    onClick={() => fetchAnalytics(portfolio.id)}
                    disabled={analyticsLoading}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-blue-500/20 px-2 py-1 rounded-md transition-all disabled:opacity-50"
                  >
                    <FiBarChart2 size={12} className="text-blue-400" />
                    <span>Analytics</span>
                  </button>
                  <button 
                    onClick={() => fetchMessages(portfolio.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-violet-500/20 px-2 py-1 rounded-md transition-all"
                  >
                    <FiMail size={12} className="text-violet-400" />
                    <span>Messages</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/portfolio/${portfolio.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <FiExternalLink size={14} /> View
                  </Link>
                  <Link
                    href={`/edit/${portfolio.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <FiEdit size={14} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(portfolio.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors ml-auto"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Messages Modal */}
      {isMessagesOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setIsMessagesOpen(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Recruiter Messages</h2>
                <p className="text-xs text-gray-500 mt-1">People interested in your portfolio</p>
              </div>
              <button onClick={() => setIsMessagesOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {!selectedPortfolioMessages || selectedPortfolioMessages.length === 0 ? (
                <div className="text-center py-10 opacity-40">
                  <FiMail size={40} className="mx-auto mb-4" />
                  <p>No messages yet. They will appear here when someone reaches out!</p>
                </div>
              ) : (
                selectedPortfolioMessages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-violet-400">{msg.senderName}</h4>
                        <p className="text-xs text-gray-500">{msg.senderEmail}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                        <FiClock />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed italic">&quot;{msg.message}&quot;</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Analytics Modal */}
      {isAnalyticsOpen && selectedPortfolioAnalytics && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setIsAnalyticsOpen(false)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Portfolio Analytics</h2>
                <p className="text-xs text-gray-500 mt-1">View performance over time</p>
              </div>
              <button onClick={() => setIsAnalyticsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-emerald-400">{selectedPortfolioAnalytics.totalViews}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Unique Referrers</p>
                  <p className="text-3xl font-bold text-blue-400">{selectedPortfolioAnalytics.uniqueReferrers}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">Daily Views</p>
                <div className="h-32 flex items-end gap-1">
                  {Object.entries(selectedPortfolioAnalytics.dailyViews).slice(-14).map(([date, count]) => (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-violet-500/60 rounded-t transition-all hover:bg-violet-500"
                        style={{ height: `${Math.max(4, (count / Math.max(...Object.values(selectedPortfolioAnalytics.dailyViews))) * 100)}%` }}
                      />
                      <span className="text-[10px] text-gray-500">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
