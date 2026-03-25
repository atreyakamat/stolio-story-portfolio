'use client';

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { SocialLink } from '@/types/portfolio';
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiExternalLink, FiArrowUpRight } from 'react-icons/fi';

const iconMap: Record<string, React.ReactNode> = {
  github: <FiGithub size={24} />,
  linkedin: <FiLinkedin size={24} />,
  twitter: <FiTwitter size={24} />,
  email: <FiMail size={24} />,
};

export function ContactSection({ links }: { links: SocialLink[] }) {
  const { theme, style } = useTheme();

  return (
    <section className="px-6 py-24" id="contact">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
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
          Get in Touch
        </motion.h2>

        <motion.p
          className="text-lg mb-12 max-w-lg mx-auto"
          style={{ color: theme.colors.textSecondary }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          I&apos;m always open to new opportunities and interesting conversations. Feel free to reach out!
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {links.map((link, i) => (
            <motion.a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 transition-all duration-300 group"
              style={{
                background: theme.colors.surface,
                borderRadius: theme.borderRadius,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text,
                textDecoration: 'none',
                ...(style === 'glassmorphism' && {
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }),
                ...(style === 'neobrutalism' && {
                  border: `3px solid ${theme.colors.text}`,
                  boxShadow: `4px 4px 0px ${theme.colors.secondary}`,
                }),
                ...(style === 'clay' && {
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                }),
              }}
              whileHover={{
                y: -3,
                borderColor: theme.colors.primary,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span style={{ color: theme.colors.primary }}>
                {iconMap[link.platform] || <FiExternalLink size={24} />}
              </span>
              <div className="text-left flex-grow">
                <p className="font-semibold capitalize">{link.platform}</p>
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  {link.label || link.url}
                </p>
              </div>
              <FiArrowUpRight
                size={18}
                style={{ color: theme.colors.textSecondary }}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </motion.a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-16 text-sm"
          style={{ color: theme.colors.textSecondary }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Built with{' '}
          <span style={{ color: theme.colors.primary }}>Stolio</span>
          {' '}— AI-powered portfolio generation
        </motion.p>
      </div>
    </section>
  );
}
