'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiSave, FiEye, FiPlus, FiTrash2, FiRefreshCw, FiLoader } from 'react-icons/fi';
import { PortfolioData, ThemeStyle, Project, Experience, Link as PortfolioLink } from '@/types/portfolio';

const themeOptions: ThemeStyle[] = ['minimal', 'glassmorphism', 'neobrutalism', 'y2k', 'clay'];

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>('minimal');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'projects' | 'experience' | 'links'>('basic');
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
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeStyle,
          content: data,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleRegenerate() {
    if (!data || !confirm('This will use AI to regenerate your portfolio content based on your current bio and title. Your current manual changes may be lost. Continue?')) return;
    
    setRegenerating(true);
    try {
      const res = await fetch('/api/portfolio/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: id,
          // We use the bio/title as "resume text" for regeneration if they want to pivot
          resumeText: `Name: ${data.name}\nTitle: ${data.title}\nBio: ${data.bio}`,
        }),
      });

      if (!res.ok) throw new Error('Regeneration failed');
      
      const { content } = await res.json();
      setData({
        name: content.name,
        title: content.title,
        tagline: content.tagline,
        bio: content.bio,
        skills: JSON.parse(content.skills),
        projects: JSON.parse(content.projects),
        experience: JSON.parse(content.experience),
        links: JSON.parse(content.links),
      });
      alert('Portfolio regenerated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to regenerate portfolio');
    } finally {
      setRegenerating(false);
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
            <button
              onClick={handleRegenerate}
              disabled={regenerating || saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-colors disabled:opacity-50"
              title="Regenerate with AI"
            >
              {regenerating ? <FiLoader size={14} className="animate-spin" /> : <FiRefreshCw size={14} />}
              AI Regenerate
            </button>
            <Link
              href={`/portfolio/${slug}`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 transition-colors"
            >
              <FiEye size={14} /> View
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || regenerating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500 text-sm font-medium transition-all disabled:opacity-50"
            >
              <FiSave size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-48 flex-shrink-0 space-y-1">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'links', label: 'Links' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-grow space-y-8 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold">Basic Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Theme Style</label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Full Name"
                      value={data.name}
                      onChange={(v) => setData({ ...data, name: v })}
                    />
                    <Field
                      label="Professional Title"
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
                      rows={8}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none text-sm leading-relaxed"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Skills</h2>
                    <button
                      onClick={() => setData({ ...data, skills: [...data.skills, { name: '', category: 'General' }] })}
                      className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <FiPlus size={14} /> Add Skill
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.skills.map((skill, idx) => (
                      <div key={idx} className="flex gap-3 items-start group">
                        <div className="flex-grow grid grid-cols-2 gap-3">
                          <input
                            placeholder="Skill Name"
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...data.skills];
                              newSkills[idx].name = e.target.value;
                              setData({ ...data, skills: newSkills });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                          />
                          <input
                            placeholder="Category"
                            value={skill.category}
                            onChange={(e) => {
                              const newSkills = [...data.skills];
                              newSkills[idx].category = e.target.value;
                              setData({ ...data, skills: newSkills });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newSkills = data.skills.filter((_, i) => i !== idx);
                            setData({ ...data, skills: newSkills });
                          }}
                          className="p-2.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div
                  key="projects"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Projects</h2>
                    <button
                      onClick={() => setData({ ...data, projects: [...data.projects, { name: '', description: '', technologies: [] }] })}
                      className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <FiPlus size={14} /> Add Project
                    </button>
                  </div>

                  <div className="space-y-6">
                    {data.projects.map((project, idx) => (
                      <div key={idx} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-4 relative group">
                        <button
                          onClick={() => {
                            const newProjects = data.projects.filter((_, i) => i !== idx);
                            setData({ ...data, projects: newProjects });
                          }}
                          className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiTrash2 size={16} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field
                            label="Project Name"
                            value={project.name}
                            onChange={(v) => {
                              const newProjects = [...data.projects];
                              newProjects[idx].name = v;
                              setData({ ...data, projects: newProjects });
                            }}
                          />
                          <Field
                            label="Technologies (comma-separated)"
                            value={project.technologies.join(', ')}
                            onChange={(v) => {
                              const newProjects = [...data.projects];
                              newProjects[idx].technologies = v.split(',').map(s => s.trim()).filter(Boolean);
                              setData({ ...data, projects: newProjects });
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">Description</label>
                          <textarea
                            value={project.description}
                            onChange={(e) => {
                              const newProjects = [...data.projects];
                              newProjects[idx].description = e.target.value;
                              setData({ ...data, projects: newProjects });
                            }}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field
                            label="Live Link"
                            value={project.link || ''}
                            onChange={(v) => {
                              const newProjects = [...data.projects];
                              newProjects[idx].link = v;
                              setData({ ...data, projects: newProjects });
                            }}
                          />
                          <Field
                            label="GitHub Link"
                            value={project.github || ''}
                            onChange={(v) => {
                              const newProjects = [...data.projects];
                              newProjects[idx].github = v;
                              setData({ ...data, projects: newProjects });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'experience' && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Experience</h2>
                    <button
                      onClick={() => setData({ ...data, experience: [...data.experience, { title: '', organization: '', period: '', description: '', type: 'work' }] })}
                      className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <FiPlus size={14} /> Add Experience
                    </button>
                  </div>

                  <div className="space-y-6">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-4 relative group">
                        <button
                          onClick={() => {
                            const newExp = data.experience.filter((_, i) => i !== idx);
                            setData({ ...data, experience: newExp });
                          }}
                          className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiTrash2 size={16} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field
                            label="Title"
                            value={exp.title}
                            onChange={(v) => {
                              const newExp = [...data.experience];
                              newExp[idx].title = v;
                              setData({ ...data, experience: newExp });
                            }}
                          />
                          <Field
                            label="Organization"
                            value={exp.organization}
                            onChange={(v) => {
                              const newExp = [...data.experience];
                              newExp[idx].organization = v;
                              setData({ ...data, experience: newExp });
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Field
                            label="Period (e.g., 2020 - Present)"
                            value={exp.period}
                            onChange={(v) => {
                              const newExp = [...data.experience];
                              newExp[idx].period = v;
                              setData({ ...data, experience: newExp });
                            }}
                          />
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">Type</label>
                            <select
                              value={exp.type}
                              onChange={(e) => {
                                const newExp = [...data.experience];
                                newExp[idx].type = e.target.value as any;
                                setData({ ...data, experience: newExp });
                              }}
                              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                            >
                              <option value="work">Work</option>
                              <option value="education">Education</option>
                              <option value="internship">Internship</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => {
                              const newExp = [...data.experience];
                              newExp[idx].description = e.target.value;
                              setData({ ...data, experience: newExp });
                            }}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'links' && (
                <motion.div
                  key="links"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Social Links</h2>
                    <button
                      onClick={() => setData({ ...data, links: [...data.links, { platform: 'github', url: '', label: '' }] })}
                      className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <FiPlus size={14} /> Add Link
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.links.map((link, idx) => (
                      <div key={idx} className="flex gap-3 items-start group">
                        <div className="flex-grow grid grid-cols-3 gap-3">
                          <select
                            value={link.platform}
                            onChange={(e) => {
                              const newLinks = [...data.links];
                              newLinks[idx].platform = e.target.value as any;
                              setData({ ...data, links: newLinks });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                          >
                            <option value="email">Email</option>
                            <option value="github">GitHub</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter</option>
                            <option value="website">Website</option>
                          </select>
                          <input
                            placeholder="Label (e.g., GitHub)"
                            value={link.label}
                            onChange={(e) => {
                              const newLinks = [...data.links];
                              newLinks[idx].label = e.target.value;
                              setData({ ...data, links: newLinks });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                          />
                          <input
                            placeholder="URL"
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...data.links];
                              newLinks[idx].url = e.target.value;
                              setData({ ...data, links: newLinks });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const newLinks = data.links.filter((_, i) => i !== idx);
                            setData({ ...data, links: newLinks });
                          }}
                          className="p-2.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm"
      />
    </div>
  );
}
