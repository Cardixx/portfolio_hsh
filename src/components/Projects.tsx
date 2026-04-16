import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Port Security Management Platform',
    subtitle: 'SMMC',
    description: 'Smart dashboard for managing port incidents and surveillance cameras. Secure authentication and role-based access control.',
    stack: ['React', 'Laravel', 'MySQL', 'JWT'],
    accent: 'from-primary/30 to-secondary/30',
    tag: 'Featured',
    year: '2024',
  },
  {
    title: 'SaaS Commercial Management',
    subtitle: 'Stock & Sales',
    description: 'Product and stock management system with interactive analytics dashboard powered by Chart.js.',
    stack: ['React', 'Laravel', 'Chart.js', 'MySQL'],
    accent: 'from-accent/30 to-primary/30',
    tag: 'SaaS',
    year: '2024',
  },
  {
    title: 'Intelligent Feedback Platform',
    subtitle: 'NLP-Powered',
    description: 'Automatic sentiment analysis of student feedback with an insights dashboard for teachers.',
    stack: ['React', 'Node.js', 'NLP', 'PostgreSQL'],
    accent: 'from-secondary/30 to-accent/30',
    tag: 'AI / NLP',
    year: '2024',
  },
  {
    title: 'Secure REST API',
    subtitle: 'Auth Service',
    description: 'JWT authentication and user management following REST best practices, with rate limiting and validation.',
    stack: ['Node.js', 'Laravel', 'JWT', 'PostgreSQL'],
    accent: 'from-primary/30 to-accent/30',
    tag: 'Backend',
    year: '2024',
  },
  {
    title: 'Interactive Developer Portfolio',
    subtitle: 'This Site',
    description: 'Immersive UI inspired by creative portfolios — modern animations, scroll storytelling, and a focus on UX.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Framer Motion'],
    accent: 'from-secondary/30 to-primary/30',
    tag: 'Design',
    year: '2025',
  },
]

export function Projects() {
  return (
    <section id="projects" className="section-padding relative">
      <div className="absolute top-40 left-1/3 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-16"
        >
          <span className="font-mono text-xs text-primary tracking-widest uppercase inline-flex items-center gap-2">
            <span className="w-8 h-px bg-primary" />
            03 / Selected Work
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-16 md:mb-24"
        >
          Projects<span className="text-primary">.</span>
        </motion.h2>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              className={`project-card group relative rounded-2xl border border-border bg-card overflow-hidden ${i === 0 ? 'md:col-span-2' : ''}`}
            >
              {/* Visual area */}
              <div className={`relative h-64 md:h-80 ${i === 0 ? 'md:h-[28rem]' : ''} overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.4),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.3),transparent_50%)]" />

                {/* Code-like decoration */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-700">
                  <pre className="font-mono text-xs md:text-sm text-foreground/70 leading-relaxed">
{`{
  "project": "${project.subtitle}",
  "stack": ${JSON.stringify(project.stack.slice(0, 2))},
  "status": "shipped"
}`}
                  </pre>
                </div>

                {/* Top tag */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-background/70 backdrop-blur border border-border text-xs font-mono text-primary">
                    {project.tag}
                  </span>
                  <span className="font-mono text-xs text-foreground/70">{project.year}</span>
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-background/70 backdrop-blur border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-500">
                  <span className="text-primary text-lg">↗</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 md:p-8 relative z-10">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
                  {project.subtitle}
                </p>
                <h3 className="text-xl md:text-2xl lg:text-3xl text-foreground font-medium mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono text-muted-foreground border border-border rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
