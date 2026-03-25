'use client';

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { PortfolioData } from '@/types/portfolio';

export function AboutSection({ data }: { data: PortfolioData }) {
  const { theme, style } = useTheme();

  return (
    <section className="px-6 py-24" id="about">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-12"
            style={{
              fontFamily: theme.fonts.heading,
              ...(style === 'neobrutalism' && {
                textShadow: `2px 2px 0px ${theme.colors.primary}`,
              }),
              ...(style === 'y2k' && {
                background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }),
            }}
          >
            About Me
          </h2>
        </motion.div>

        <motion.div
          className="p-8 md:p-10"
          style={{
            background: theme.colors.surface,
            borderRadius: theme.borderRadius,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadow,
            ...(style === 'glassmorphism' && {
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }),
            ...(style === 'neobrutalism' && {
              border: `3px solid ${theme.colors.text}`,
              boxShadow: `6px 6px 0px ${theme.colors.primary}`,
            }),
            ...(style === 'clay' && {
              boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }),
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {data.bio.split('\n\n').map((paragraph, i) => (
            <motion.p
              key={i}
              className="text-lg leading-relaxed mb-4 last:mb-0"
              style={{ color: theme.colors.textSecondary }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
