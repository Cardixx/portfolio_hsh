import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectItem, resolveMediaUrl, api } from '@/lib/api'
import { X, Play, Image as ImageIcon, ExternalLink, Github, Eye, Sparkles, Layers } from 'lucide-react'

interface ProjectModalProps {
  project: ProjectItem | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'image'>('video')
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)

  useEffect(() => {
    if (project && project.id) {
      api.recordProjectView(project.id)
      // If project has video, default to video, else default to image
      if (project.presentationVideoUrl) {
        setActiveMediaTab('video')
      } else {
        setActiveMediaTab('image')
      }
      setSelectedGalleryImage(project.presentationImageUrl || null)
    }
  }, [project])

  if (!project || !isOpen) return null

  const isEmbedVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')
  }

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/')
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]
      return `https://www.youtube.com/embed/${id}`
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]
      return `https://player.vimeo.com/video/${id}`
    }
    return url
  }

  const allImages = [
    ...(project.presentationImageUrl ? [project.presentationImageUrl] : []),
    ...(project.galleryImages || [])
  ]

  const activeImage = selectedGalleryImage || project.presentationImageUrl

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border/80 bg-card/95 shadow-2xl z-10 custom-scrollbar flex flex-col"
        >
          {/* Top Bar with Title & Close button */}
          <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 border-b border-border/60 bg-card/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {project.tag || 'Project'}
              </span>
              <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
              {project.viewCount !== undefined && (
                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 ml-2">
                  <Eye className="w-3.5 h-3.5 text-primary/70" />
                  {project.viewCount} vues
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-border/70 hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-8">
            {/* Header info */}
            <div>
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-1.5">
                {project.subtitle}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground">
                {project.title}
              </h2>
            </div>

            {/* Media Presentation Switcher (Video & Image) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                {project.presentationVideoUrl && (
                  <button
                    onClick={() => setActiveMediaTab('video')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all ${
                      activeMediaTab === 'video'
                        ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Présentation Vidéo
                  </button>
                )}

                <button
                  onClick={() => setActiveMediaTab('image')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs transition-all ${
                    activeMediaTab === 'image'
                      ? 'bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Présentation Image & Galerie
                </button>
              </div>

              {/* Media Display Area */}
              <div className="relative rounded-2xl overflow-hidden border border-border/80 bg-black/60 aspect-video flex items-center justify-center shadow-inner">
                {activeMediaTab === 'video' && project.presentationVideoUrl ? (
                  isEmbedVideo(project.presentationVideoUrl) ? (
                    <iframe
                      src={getEmbedUrl(project.presentationVideoUrl)}
                      title={`Vidéo de présentation: ${project.title}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      autoPlay={false}
                      preload="metadata"
                      className="w-full h-full object-contain"
                      src={resolveMediaUrl(project.presentationVideoUrl)}
                    >
                      Votre navigateur ne supporte pas la balise vidéo.
                    </video>
                  )
                ) : activeImage ? (
                  <div className="relative w-full h-full flex items-center justify-center p-2">
                    <img
                      src={resolveMediaUrl(activeImage)}
                      alt={project.title}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <Play className="w-12 h-12 text-primary/40 mb-3" />
                    <p className="font-mono text-sm">Aucun média de présentation configuré pour ce projet.</p>
                  </div>
                )}
              </div>

              {/* Gallery thumbnails if multiple images exist */}
              {activeMediaTab === 'image' && allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedGalleryImage(img)}
                      className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border transition-all ${
                        selectedGalleryImage === img
                          ? 'border-primary ring-2 ring-primary/40 scale-105'
                          : 'border-border/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={resolveMediaUrl(img)}
                        alt={`Aperçu ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* In-depth Narrative & Details */}
            <div className="grid md:grid-cols-3 gap-8 pt-4">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Description & Objectifs
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {project.stack && project.stack.length > 0 && (
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                      Technologies & Outils
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-md text-xs font-mono bg-muted/60 text-foreground border border-border"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar: Meta & Action Links */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl border border-border/80 bg-background/50 space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                    Liens du projet
                  </h4>

                  <div className="space-y-3">
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Voir la Démo Live
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-primary/50 text-foreground font-mono text-sm hover:bg-muted/40 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        Code Source (GitHub)
                      </a>
                    )}

                    {!project.liveDemoUrl && !project.githubUrl && (
                      <p className="text-xs text-muted-foreground font-mono">
                        Dépôt privé / Usage interne
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border/50 bg-background/30 text-xs font-mono space-y-2 text-muted-foreground">
                  <p>Année de réalisation : <span className="text-foreground">{project.year || '2025'}</span></p>
                  <p>Catégorie : <span className="text-foreground">{project.tag}</span></p>
                  {project.viewCount !== undefined && (
                    <p>Consultations : <span className="text-primary font-bold">{project.viewCount}</span></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
