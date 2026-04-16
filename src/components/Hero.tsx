import { motion } from 'framer-motion'
import heroBg from '@/assets/hero-bg.jpg'

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden hero-glow flex items-center">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroBg}
          alt="Futuristic developer workspace"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        {/* Glowing orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-20 py-32 md:py-0">
        <div className="max-w-6xl mx-auto">
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
            className="font-display leading-[0.9] tracking-tighter text-[14vw] md:text-[10vw] lg:text-[9rem]"
          >
            <span className="block text-foreground">Harentsoa</span>
            <span className="block text-gradient">Sarobidy</span>
            <span className="block text-foreground/90">Harivelo<span className="text-primary">.</span></span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 md:mt-14 grid md:grid-cols-2 gap-8 max-w-4xl"
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
                Antananarivo, Madagascar 🇲🇬
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
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
