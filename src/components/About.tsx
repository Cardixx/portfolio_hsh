import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api, ProfileItem } from '@/lib/api'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' }
}

export function About() {
  const [profile, setProfile] = useState<ProfileItem>({
    fullName: 'Harentsoa Sarobidy Harivelo',
    title: 'Full-Stack Developer & Software Engineering Student',
    subtitle: 'Building the web, one commit at a time.',
    bio: "I'm a Computer Science student passionate about web development and digital solutions. My focus is on building secure and scalable web applications that solve real problems.\n\nCapable of developing full-stack systems with a user-centered approach — I move comfortably between crafting clean React interfaces and architecting robust Laravel, Node.js and Spring Boot APIs.\n\nI care deeply about code quality, performance, and writing software that I'd be proud to maintain six months later.",
    currentStatus: 'Open to junior dev opportunities',
    languages: 'French · English · Malagasy',
    focus: 'Full-stack web · APIs · Security · Spring Boot',
    location: 'Fianarantsoa · Madagascar 🇲🇬',
    email: 'hariveloharentsoasarobidy@gmail.com',
    githubUrl: 'https://github.com/Cardixx',
    linkedinUrl: 'https://linkedin.com/in/harentsoa-harivelo11'
  })

  useEffect(() => {
    api.getProfile()
      .then((data) => {
        if (data) setProfile(data)
      })
      .catch(() => {})
  }, [])

  const paragraphs = profile.bio ? profile.bio.split('\n\n') : []

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
          {profile.subtitle ? (
            profile.subtitle
          ) : (
            <>
              Building the web,<br />
              <span className="text-gradient">one commit at a time.</span>
            </>
          )}
        </motion.h2>

        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          <motion.div {...fadeInUp} className="md:col-span-7 space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))
            ) : (
              <p>{profile.bio}</p>
            )}
          </motion.div>

          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }} className="md:col-span-5">
            <div className="border border-border rounded-lg p-6 md:p-8 bg-card/50 backdrop-blur space-y-6">
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Currently</p>
                <p className="text-foreground">{profile.currentStatus}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Languages</p>
                <p className="text-foreground">{profile.languages}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Focus</p>
                <p className="text-foreground">{profile.focus}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Location</p>
                <p className="text-foreground">{profile.location}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
