'use client';

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Skill } from '@/types/portfolio';

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const { theme, style } = useTheme();

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section className="px-6 py-24" id="skills">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12"
          style={{
            fontFamily: theme.fonts.heading,
            ...(style === 'neobrutalism' && { textShadow: `2px 2px 0px ${theme.colors.primary}` }),
            ...(style === 'y2k' && {
              background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }),
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Skills & Expertise
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(grouped).map(([category, categorySkills], catIdx) => (
            <motion.div
              key={category}
              className="p-6"
              style={{
                background: theme.colors.surface,
                borderRadius: theme.borderRadius,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.shadow,
                ...(style === 'glassmorphism' && {
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }),
                ...(style === 'neobrutalism' && {
                  border: `3px solid ${theme.colors.text}`,
                  boxShadow: `4px 4px 0px ${theme.colors.secondary}`,
                }),
                ...(style === 'clay' && {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                }),
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h3
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: theme.colors.primary }}
              >
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill, i) => (
                  <motion.span
                    key={skill.name}
                    className="px-3 py-1.5 text-sm font-medium"
                    style={{
                      borderRadius: style === 'neobrutalism' ? '0' : style === 'clay' ? '12px' : '6px',
                      background: style === 'glassmorphism'
                        ? 'rgba(255,255,255,0.08)'
                        : style === 'y2k'
                          ? 'transparent'
                          : `${theme.colors.primary}15`,
                      color: theme.colors.text,
                      border: style === 'neobrutalism'
                        ? `2px solid ${theme.colors.text}`
                        : style === 'y2k'
                          ? `1px solid ${theme.colors.primary}50`
                          : 'none',
                      ...(style === 'clay' && {
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.15)',
                        background: `${theme.colors.primary}20`,
                      }),
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIdx * 0.1 + i * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
