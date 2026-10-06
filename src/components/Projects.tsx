import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProjectItem, api, resolveMediaUrl } from '@/lib/api'
import { ProjectModal } from './ProjectModal'
import { Play, Sparkles, Eye, ArrowUpRight } from 'lucide-react'

const fallbackProjects: ProjectItem[] = [
  {
    id: 1,
    title: 'Secure REST API',
    subtitle: 'Auth Service',
    description: 'JWT authentication and user management following REST best practices, with rate limiting and validation.',
    longDescription: 'A production-grade RESTful API built with Spring Boot / Node.js architecture. Features include stateless JWT authentication with refresh token rotation, BCrypt password hashing, role-based authorization (RBAC), rate-limiting middleware, SQL injection prevention, input sanitization, and structured API documentation.',
    stack: ['Node.js', 'Spring Boot', 'JWT', 'PostgreSQL'],
    accent: 'from-primary/30 to-accent/30',
    tag: 'Backend',
    year: '2024',
    presentationImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    presentationVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    githubUrl: 'https://github.com/Cardixx',
    viewCount: 124,
  },
  {
    id: 2,
    title: 'Port Security Management Platform',
    subtitle: 'SMMC',
    description: 'Smart dashboard for managing port incidents and surveillance cameras. Secure authentication and role-based access control.',
    longDescription: 'Comprehensive enterprise dashboard designed for port safety and surveillance operations at SMMC. Allows real-time incident logging, patrol dispatch tracking, dynamic camera grid feeds, and incident severity level classification. Built with clean separation of concerns and responsive design for control room operators.',
    stack: ['React', 'Spring Boot', 'PostgreSQL', 'JWT'],
    accent: 'from-primary/30 to-secondary/30',
    tag: 'Featured',
    year: '2025',
    presentationImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    presentationVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    githubUrl: 'https://github.com/Cardixx',
    viewCount: 248,
  },
  {
    id: 3,
    title: 'SaaS Commercial Management',
    subtitle: 'Stock & Sales',
    description: 'Product and stock management system with interactive analytics dashboard powered by Chart.js.',
    longDescription: 'Cloud-ready commercial inventory & point-of-sale application. Supports multi-warehouse inventory movements, automated low-stock notifications, invoice generation, customer history records, and interactive business intelligence metrics for revenue forecasting.',
    stack: ['React', 'Laravel', 'Chart.js', 'PostgreSQL'],
    accent: 'from-accent/30 to-primary/30',
    tag: 'SaaS',
    year: '2024',
    presentationImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    presentationVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    githubUrl: 'https://github.com/Cardixx',
    viewCount: 180,
  },
  {
    id: 4,
    title: 'Intelligent Feedback Platform',
    subtitle: 'NLP-Powered',
    description: 'Automatic sentiment analysis of student feedback with an insights dashboard for teachers.',
    longDescription: 'Educational technology platform applying Natural Language Processing (NLP) models to student course evaluations. Automatically detects sentiment polarity, tags recurrent themes (e.g. course pace, clarity, exercises), and generates actionable improvement summaries for teachers.',
    stack: ['React', 'Node.js', 'NLP', 'PostgreSQL'],
    accent: 'from-secondary/30 to-accent/30',
    tag: 'AI / NLP',
    year: '2025',
    presentationImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    presentationVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    githubUrl: 'https://github.com/Cardixx',
    viewCount: 95,
  },
  {
    id: 5,
    title: 'Interactive Developer Portfolio',
    subtitle: 'This Site',
    description: 'Immersive UI inspired by creative portfolios — modern animations, scroll storytelling, and a focus on UX.',
    longDescription: 'Personal portfolio web application showcasing full-stack capabilities with React, TypeScript, Framer Motion, and a Spring Boot + PostgreSQL backend. Features dynamic project presentation with high-res media, video demonstrations, full admin CRUD suite, and real-time visitor telemetry.',
    stack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Framer Motion'],
    accent: 'from-secondary/30 to-primary/30',
    tag: 'Design',
    year: '2025',
    presentationImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    presentationVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    githubUrl: 'https://github.com/Cardixx/portfolio_hsh',
    viewCount: 310,
  },
]

export function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>(fallbackProjects)
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    api.getProjects()
      .then((data) => {
        if (data && data.length > 0) {
          setProjects(data)
        }
      })
      .catch(() => {
        // Keeps fallbackProjects gracefully if backend is offline or starting
      })
  }, [])

  const handleOpenProject = (project: ProjectItem) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

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

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-4"
        >
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter">
            Projects<span className="text-primary">.</span>
          </h2>
          <p className="font-mono text-xs md:text-sm text-muted-foreground">
            ⚡ Cliquez sur un projet pour lancer sa présentation vidéo & galerie
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <motion.article
              key={project.id || project.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              onClick={() => handleOpenProject(project)}
              className={`project-card group relative rounded-2xl border border-border bg-card overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 ${
                i === 0 ? 'md:col-span-2' : ''
              }`}
            >
              {/* Visual area */}
              <div className={`relative h-64 md:h-80 ${i === 0 ? 'md:h-[28rem]' : ''} overflow-hidden bg-black/40`}>
                {project.presentationImageUrl ? (
                  <img
                    src={resolveMediaUrl(project.presentationImageUrl)}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
                  />
                ) : (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.accent || 'from-primary/30 to-accent/30'}`} />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.4),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.3),transparent_50%)]" />
                  </>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent opacity-90" />

                {/* Top tags */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                  <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur border border-border text-xs font-mono text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    {project.tag || 'Project'}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.viewCount !== undefined && project.viewCount > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur border border-border text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <Eye className="w-3 h-3 text-primary/70" />
                        {project.viewCount}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-background/80 backdrop-blur border border-border text-xs font-mono text-foreground/80">
                      {project.year || '2025'}
                    </span>
                  </div>
                </div>

                {/* Interactive presentation callout in center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="px-4 py-2 rounded-full bg-background/90 backdrop-blur border border-primary/40 text-xs font-mono text-primary flex items-center gap-2 shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Lancer la présentation vidéo & images</span>
                  </div>
                </div>

                {/* Hover arrow button */}
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary/90 text-primary-foreground backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 z-10 shadow-lg shadow-primary/30">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Info */}
              <div className="p-6 md:p-8 relative z-10">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">
                  {project.subtitle}
                </p>
                <h3 className="text-xl md:text-2xl lg:text-3xl text-foreground font-medium mb-3 group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>{project.title}</span>
                  {project.presentationVideoUrl && (
                    <span className="text-xs font-mono text-muted-foreground bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current text-primary" /> Vidéo incluse
                    </span>
                  )}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack && project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs font-mono text-muted-foreground border border-border rounded-md bg-muted/30"
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

      {/* Presentation Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  )
}
