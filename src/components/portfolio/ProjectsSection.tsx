'use client';

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Project } from '@/types/portfolio';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const { theme, style } = useTheme();

  return (
    <section className="px-6 py-24" id="projects">
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
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              className="p-6 flex flex-col h-full group"
              style={{
                background: theme.colors.surface,
                borderRadius: theme.borderRadius,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: theme.shadow,
                ...(style === 'glassmorphism' && {
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }),
                ...(style === 'neobrutalism' && {
                  border: `3px solid ${theme.colors.text}`,
                  boxShadow: `5px 5px 0px ${theme.colors.accent}`,
                }),
                ...(style === 'clay' && {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                }),
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
            >
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontFamily: theme.fonts.heading }}
              >
                {project.name}
              </h3>

              <p
                className="text-sm mb-4 flex-grow"
                style={{ color: theme.colors.textSecondary }}
              >
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1"
                    style={{
                      borderRadius: style === 'neobrutalism' ? '0' : '4px',
                      background: `${theme.colors.primary}20`,
                      color: theme.colors.primary,
                      fontFamily: theme.fonts.mono,
                      ...(style === 'neobrutalism' && {
                        border: `1px solid ${theme.colors.primary}`,
                      }),
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 mt-auto pt-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm transition-colors duration-200"
                    style={{ color: theme.colors.textSecondary }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textSecondary)}
                  >
                    <FiGithub size={16} /> Code
                  </a>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm transition-colors duration-200"
                    style={{ color: theme.colors.textSecondary }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textSecondary)}
                  >
                    <FiExternalLink size={16} /> Live
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
