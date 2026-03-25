'use client';

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { PortfolioData } from '@/types/portfolio';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiExternalLink } from 'react-icons/fi';

const iconMap: Record<string, React.ReactNode> = {
  github: <FiGithub size={20} />,
  linkedin: <FiLinkedin size={20} />,
  twitter: <FiTwitter size={20} />,
  email: <FiMail size={20} />,
};

export function HeroSection({ data }: { data: PortfolioData }) {
  const { theme, style } = useTheme();

  const heroStyles: Record<string, string> = {
    minimal: '',
    glassmorphism: 'backdrop-blur-xl',
    neobrutalism: '',
    y2k: '',
    clay: '',
  };

  return (
    <section
      className={`min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden ${heroStyles[style]}`}
    >
      {/* Background effects per theme */}
      {style === 'glassmorphism' && (
        <>
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-30 blur-3xl" style={{ background: theme.colors.primary }} />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: theme.colors.accent }} />
        </>
      )}
      {style === 'y2k' && (
        <>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.1) 2px, rgba(0,255,136,0.1) 4px)' }} />
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full opacity-10 blur-2xl" style={{ background: theme.colors.secondary }} />
        </>
      )}
      {style === 'clay' && (
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: theme.colors.primary }} />
      )}

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-sm tracking-widest uppercase mb-4"
            style={{ color: theme.colors.primary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data.title}
          </motion.p>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{
              fontFamily: theme.fonts.heading,
              ...(style === 'y2k' && {
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }),
              ...(style === 'neobrutalism' && {
                textShadow: `3px 3px 0px ${theme.colors.primary}`,
              }),
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {data.name}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            style={{ color: theme.colors.textSecondary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {data.tagline}
          </motion.p>

          <motion.div
            className="flex justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {data.links.map((link, i) => (
              <motion.a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full transition-all duration-300"
                style={{
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textSecondary,
                  borderRadius: style === 'neobrutalism' ? '0' : style === 'clay' ? '16px' : '50%',
                  ...(style === 'neobrutalism' && {
                    border: `2px solid ${theme.colors.text}`,
                    boxShadow: `2px 2px 0 ${theme.colors.text}`,
                  }),
                  ...(style === 'glassmorphism' && {
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                  }),
                }}
                whileHover={{ scale: 1.1, color: theme.colors.primary }}
                whileTap={{ scale: 0.95 }}
              >
                {iconMap[link.platform] || <FiExternalLink size={20} />}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
