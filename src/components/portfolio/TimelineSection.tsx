'use client';

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Experience } from '@/types/portfolio';
import { FiBriefcase, FiBookOpen, FiAward } from 'react-icons/fi';

const typeIcons: Record<string, React.ReactNode> = {
  work: <FiBriefcase size={18} />,
  education: <FiBookOpen size={18} />,
  internship: <FiAward size={18} />,
};

export function TimelineSection({ experience }: { experience: Experience[] }) {
  const { theme, style } = useTheme();

  return (
    <section className="px-6 py-24" id="timeline">
      <div className="max-w-4xl mx-auto">
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
          Journey
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{
              background: style === 'y2k'
                ? `linear-gradient(180deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                : theme.colors.border,
            }}
          />

          <div className="space-y-8">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                className="flex gap-6 relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Timeline dot */}
                <div
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center z-10"
                  style={{
                    borderRadius: style === 'neobrutalism' ? '0' : '50%',
                    background: theme.colors.surface,
                    border: `2px solid ${theme.colors.primary}`,
                    color: theme.colors.primary,
                    boxShadow: style === 'neobrutalism'
                      ? `3px 3px 0 ${theme.colors.primary}`
                      : style === 'y2k'
                        ? `0 0 15px ${theme.colors.primary}40`
                        : style === 'clay'
                          ? '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                          : 'none',
                  }}
                >
                  {typeIcons[exp.type] || <FiBriefcase size={18} />}
                </div>

                {/* Content card */}
                <div
                  className="flex-grow p-5"
                  style={{
                    background: theme.colors.surface,
                    borderRadius: theme.borderRadius,
                    border: `1px solid ${theme.colors.border}`,
                    ...(style === 'glassmorphism' && {
                      background: 'rgba(255,255,255,0.04)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }),
                    ...(style === 'neobrutalism' && {
                      border: `2px solid ${theme.colors.text}`,
                      boxShadow: `4px 4px 0 ${theme.colors.accent}`,
                    }),
                    ...(style === 'clay' && {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                    }),
                  }}
                >
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h3 className="text-lg font-semibold" style={{ fontFamily: theme.fonts.heading }}>
                      {exp.title}
                    </h3>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: `${theme.colors.primary}15`,
                        color: theme.colors.primary,
                        fontFamily: theme.fonts.mono,
                        borderRadius: style === 'neobrutalism' ? '0' : '12px',
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-2" style={{ color: theme.colors.primary }}>
                    {exp.organization}
                  </p>
                  <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
