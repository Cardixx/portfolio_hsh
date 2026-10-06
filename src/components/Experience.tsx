import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api, ExperienceItem } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'

const defaultExperiences: ExperienceItem[] = [
  {
    id: 1,
    title: 'Full-Stack Developer (Internship)',
    company: 'Port Security Project — SMMC',
    period: '2025',
    description: 'Designed and built a port incident management platform with role-based access control and real-time camera monitoring. Led the React frontend and Spring Boot / Laravel API integration.',
    skills: ['React', 'Spring Boot', 'PostgreSQL', 'JWT', 'Team Collaboration'],
    sortOrder: 1,
  },
  {
    id: 2,
    title: 'Freelance Web Developer',
    company: 'SaaS & Custom Apps',
    period: '2024 — Present',
    description: 'Building stock-management SaaS dashboards and bespoke web applications for small businesses. Full project ownership: UML, database, API, UI, and deployment.',
    skills: ['React', 'Spring Boot', 'PostgreSQL', 'UML', 'Chart.js'],
    sortOrder: 2,
  },
  {
    id: 3,
    title: 'Computer Science Student',
    company: 'University of Madagascar',
    period: '2024 — Present',
    description: 'Studying software engineering fundamentals: algorithms, databases, web architecture, and security. Active in coding clubs and hackathons.',
    skills: ['Algorithms', 'Data Structures', 'Software Design', 'Security'],
    sortOrder: 3,
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' }
}

export function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(defaultExperiences)
  const { t } = useSettings()

  useEffect(() => {
    api.getExperiences()
      .then((data) => {
        if (data && data.length > 0) setExperiences(data)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="experience" className="section-padding bg-card/30">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeInUp} className="mb-12 md:mb-16">
          <span className="font-mono text-xs text-primary tracking-widest uppercase inline-flex items-center gap-2">
            <span className="w-8 h-px bg-primary" />
            {t('exp.title')}
          </span>
        </motion.div>

        <motion.h2
          {...fadeInUp}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-16 md:mb-24"
        >
          {t('exp.heading_1')}<br />
          <span className="text-primary">{t('exp.heading_2')}.</span>
        </motion.h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-secondary/40 to-transparent md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-20">
            {experiences.map((exp, index) => (
              <motion.article
                key={exp.id || exp.company}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className={`relative grid md:grid-cols-2 gap-6 md:gap-12 pl-8 md:pl-0 ${index % 2 === 0 ? '' : 'md:[&>*:first-child]:order-2'}`}
              >
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 top-2 w-3 h-3 rounded-full bg-primary glow-primary md:-translate-x-1/2" />

                <div className={index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}>
                  <p className="font-mono text-xs text-primary tracking-widest uppercase mb-2">{exp.period}</p>
                  <h3 className="text-xl md:text-2xl text-foreground font-medium mb-1">{exp.title}</h3>
                  <p className="text-base text-muted-foreground">{exp.company}</p>
                </div>

                <div className={index % 2 === 0 ? 'md:pl-12' : 'md:text-right md:pr-12'}>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? '' : 'md:justify-end'}`}>
                    {exp.skills && exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs font-mono text-muted-foreground border border-border rounded-md hover:border-primary/60 hover:text-primary transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

