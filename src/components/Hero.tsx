import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import heroBg from '@/assets/hero-bg.webp'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setRotate({ x: y * -45, y: x * 45 })
    }

    const handleMouseLeave = () => {
      setRotate({ x: 0, y: 0 })
      setIsHovering(false)
    }

    const handleMouseEnter = () => setIsHovering(true)

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    el.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      el.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  const shadowX = rotate.y * 2
  const shadowY = rotate.x * 2

  return (
    <section className="relative min-h-screen w-full overflow-hidden hero-glow flex flex-col md:flex-row items-center">
      {/* 3D Image Card */}
      <div
        ref={containerRef}
        className="relative w-full md:w-1/2 h-[40vh] md:h-screen flex-shrink-0 flex items-center justify-center"
        style={{ perspective: '600px' }}
      >
        <motion.div
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${isHovering ? 60 : 0}px) scale(${isHovering ? 1.03 : 1})`,
            transformStyle: 'preserve-3d',
            boxShadow: `${shadowX}px ${shadowY}px 60px hsl(var(--primary) / 0.2), ${shadowX * 2}px ${shadowY * 2}px 120px hsl(var(--secondary) / 0.1)`,
          }}
          transition={{ type: 'tween', duration: 0.2 }}
          className="w-[80%] max-w-lg rounded-full overflow-hidden border-[6px] border-white/10"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative">
            <img
              src={heroBg}
              alt="Futuristic developer workspace"
              className="w-full aspect-square object-cover object-top block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-transparent" />
          </div>
          <div className="absolute inset-0 rounded-full ring-1 ring-white/10 pointer-events-none" />
          <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full md:w-1/2 px-6 sm:px-8 md:px-12 lg:px-20 py-16 md:py-32">
        <div className="max-w-2xl mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="font-mono text-xs md:text-sm text-primary tracking-widest uppercase inline-flex items-center gap-2">
              <span className="w-8 h-px bg-primary" />
              Portfolio / 2025
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="font-display leading-[0.9] tracking-tighter text-[12vw] md:text-[6vw] lg:text-[5rem] mb-6"
          >
            <span className="block text-foreground">Harentsoa</span>
            <span className="block text-gradient">Sarobidy</span>
            <span className="block text-foreground/90">Harivelo<span className="text-primary">.</span></span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-2">Role</p>
              <p className="text-lg md:text-xl text-foreground/90">
                Junior Full-Stack Developer
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-2">Based in</p>
              <p className="text-lg md:text-xl text-foreground/90">
                Fianarantsoa, Madagascar 🇲🇬
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed mb-10"
          >
            Crafting <span className="text-primary">secure</span>, <span className="text-secondary-glow">scalable</span> web applications
            with a user-centered approach — from elegant interfaces to robust backends.
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground tracking-widest"
      >
        <div className="flex flex-col items-center gap-2 animate-float">
          <span>SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}
