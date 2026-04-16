import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' }
}

export function About() {
  return (
    <section id="about" className="section-padding relative">
      <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div {...fadeInUp} className="mb-12 md:mb-16">
          <span className="font-mono text-xs text-primary tracking-widest uppercase inline-flex items-center gap-2">
            <span className="w-8 h-px bg-primary" />
            01 / About
          </span>
        </motion.div>

        <motion.h2
          {...fadeInUp}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-12 md:mb-16 leading-[0.95]"
        >
          Building the web,<br />
          <span className="text-gradient">one commit at a time.</span>
        </motion.h2>

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <motion.div {...fadeInUp} className="md:col-span-7 space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              I'm a <span className="text-foreground">Computer Science student</span> passionate
              about web development and digital solutions. My focus is on building <span className="text-primary">secure</span> and <span className="text-primary">scalable</span> web applications
              that solve real problems.
            </p>
            <p>
              Capable of developing full-stack systems with a user-centered approach — I move
              comfortably between crafting clean React interfaces and architecting robust
              Laravel & Node.js APIs.
            </p>
            <p>
              I care deeply about <span className="text-foreground">code quality</span>, <span className="text-foreground">performance</span>, and writing software
              that I'd be proud to maintain six months later.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} className="md:col-span-5">
            <div className="border border-border rounded-lg p-6 md:p-8 bg-card/50 backdrop-blur space-y-6">
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Currently</p>
                <p className="text-foreground">Open to junior dev opportunities</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Languages</p>
                <p className="text-foreground">French · English · Malagasy</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Focus</p>
                <p className="text-foreground">Full-stack web · APIs · Security</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
