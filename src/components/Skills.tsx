import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api, SkillItem } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'

const defaultGroups = [
  {
    label: 'Frontend',
    items: ['React.js', 'JavaScript ES6+', 'HTML5', 'CSS3', 'Responsive Design', 'TailwindCSS'],
  },
  {
    label: 'Backend',
    items: ['Spring Boot', 'Java 21', 'Laravel', 'Node.js', 'REST APIs', 'JWT Authentication'],
  },
  {
    label: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'Hibernate / JPA', 'Database Modeling'],
  },
  {
    label: 'Tools & DevOps',
    items: ['Git', 'GitHub', 'Docker', 'Maven', 'Postman', 'Linux CLI'],
  },
  {
    label: 'Other',
    items: ['Web Security', 'MVC Architecture', 'Performance Optimization', 'Clean Code'],
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' }
}

export function Skills() {
  const [skillGroups, setSkillGroups] = useState(defaultGroups)
  const { t } = useSettings()

  useEffect(() => {
    api.getSkills()
      .then((skills: SkillItem[]) => {
        if (skills && skills.length > 0) {
          const map = new Map<string, string[]>()
          skills.forEach((s) => {
            const cat = s.category || 'Other'
            if (!map.has(cat)) {
              map.set(cat, [])
            }
            map.get(cat)!.push(s.name)
          })
          const groups = Array.from(map.entries()).map(([label, items]) => ({
            label,
            items,
          }))
          setSkillGroups(groups)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="skills" className="section-padding relative bg-card/30">
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div {...fadeInUp} className="mb-12 md:mb-16">
          <span className="font-mono text-xs text-primary tracking-widest uppercase inline-flex items-center gap-2">
            <span className="w-8 h-px bg-primary" />
            {t('skills.title')}
          </span>
        </motion.div>

        <motion.h2
          {...fadeInUp}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-16 md:mb-20"
        >
          {t('skills.heading_1')}<br />
          <span className="text-gradient">{t('skills.heading_2')}</span>
        </motion.h2>

        <div className="space-y-12 md:space-y-16">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="grid md:grid-cols-12 gap-6 md:gap-8 items-start border-t border-border pt-8 md:pt-12"
            >
              <div className="md:col-span-3">
                <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">
                  0{i + 1}
                </p>
                <h3 className="text-xl md:text-2xl text-foreground font-medium">{group.label}</h3>
              </div>
              <div className="md:col-span-9 flex flex-wrap gap-2 md:gap-3">
                {group.items.map((skill, j) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: j * 0.05 }}
                    whileHover={{ scale: 1.05, borderColor: 'hsl(var(--primary))' }}
                    className="px-4 py-2 rounded-full border border-border bg-background/50 backdrop-blur text-sm text-foreground/90 hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all cursor-default font-mono"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

