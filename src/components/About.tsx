import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api, ProfileItem } from '@/lib/api'
import { useSettings } from '@/contexts/SettingsContext'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' }
}

export function About() {
  const { t, language } = useSettings()

  
  const defaultProfileEn: ProfileItem = {
    fullName: 'Harentsoa Sarobidy Harivelo',
    title: 'Full-Stack Developer & Software Engineering Student',
    subtitle: '',
    bio: "I'm a Computer Science student passionate about web development and digital solutions. My focus is on building secure and scalable web applications that solve real problems.\n\nCapable of developing full-stack systems with a user-centered approach — I move comfortably between crafting clean React interfaces and architecting robust Laravel, Node.js and Spring Boot APIs.\n\nI care deeply about code quality, performance, and writing software that I'd be proud to maintain six months later.",
    currentStatus: 'Open to junior dev opportunities',
    languages: 'French · English · Malagasy',
    focus: 'Full-stack web · APIs · Security · Spring Boot',
    location: 'Fianarantsoa · Madagascar 🇲🇬',
    email: 'hariveloharentsoasarobidy@gmail.com',
    githubUrl: 'https://github.com/Cardixx',
    linkedinUrl: 'https://linkedin.com/in/harentsoa-harivelo11'
  }

  const defaultProfileFr: ProfileItem = {
    fullName: 'Harentsoa Sarobidy Harivelo',
    title: 'Développeur Full-Stack & Étudiant en Informatique',
    subtitle: '',
    bio: "Je suis un étudiant en informatique passionné par le développement web et les solutions numériques. Mon objectif est de créer des applications web sécurisées et évolutives qui résolvent des problèmes réels.\n\nCapable de développer des systèmes full-stack avec une approche centrée sur l'utilisateur — je navigue confortablement entre la création d'interfaces React propres et l'architecture d'API robustes avec Laravel, Node.js et Spring Boot.\n\nJ'accorde une grande importance à la qualité du code, aux performances et à l'écriture de logiciels que je serais fier de maintenir six mois plus tard.",
    currentStatus: 'Ouvert aux opportunités (Dev Junior)',
    languages: 'Français · Anglais · Malgache',
    focus: 'Web Full-stack · APIs · Sécurité · Spring Boot',
    location: 'Fianarantsoa · Madagascar 🇲🇬',
    email: 'hariveloharentsoasarobidy@gmail.com',
    githubUrl: 'https://github.com/Cardixx',
    linkedinUrl: 'https://linkedin.com/in/harentsoa-harivelo11'
  }

  const [profile, setProfile] = useState<ProfileItem>(language === 'fr' ? defaultProfileFr : defaultProfileEn)

  const { parseBilingual } = useSettings()

  useEffect(() => {
    setProfile(language === 'fr' ? defaultProfileFr : defaultProfileEn)
    api.getProfile()
      .then((data) => {
        if (data && data.fullName) {
          // If data uses [EN]/[FR] markers, parseBilingual will handle it automatically.
          // If it matches defaults exactly, swap to translated defaults.
          if (language === 'fr' && data.bio === defaultProfileEn.bio) {
            setProfile({
              ...data,
              title: defaultProfileFr.title,
              bio: defaultProfileFr.bio,
              currentStatus: defaultProfileFr.currentStatus,
              languages: defaultProfileFr.languages,
              focus: defaultProfileFr.focus,
            })
          } else {
            setProfile(data)
          }
        }
      })
      .catch(() => {})
  }, [language])

  // Use parseBilingual so admin-entered [EN]/[FR] fields display correctly
  const displayBio = parseBilingual(profile.bio) || profile.bio
  const displayStatus = parseBilingual(profile.currentStatus) || profile.currentStatus
  const displayLanguages = parseBilingual(profile.languages) || profile.languages
  const displayFocus = parseBilingual(profile.focus) || profile.focus
  const displayTitle = parseBilingual(profile.title) || profile.title

  const paragraphs = displayBio ? displayBio.split('\n\n') : []

  return (
    <section id="about" className="section-padding relative">
      <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div {...fadeInUp} className="mb-12 md:mb-16">
          <span className="font-mono text-xs text-primary tracking-widest uppercase inline-flex items-center gap-2">
            <span className="w-8 h-px bg-primary" />
            {t('about.title')}
          </span>
        </motion.div>

        <motion.h2
          {...fadeInUp}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-12 md:mb-16 leading-[0.95]"
        >
          {profile.subtitle ? (
            parseBilingual(profile.subtitle)
          ) : (
            <>
              {parseBilingual(profile.title) !== profile.title ? parseBilingual(profile.title) : t('about.heading_1')}<br />
              <span className="text-gradient">{t('about.heading_2')}</span>
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
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">{t('about.currently')}</p>
                <p className="text-foreground">{displayStatus}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">{t('about.languages')}</p>
                <p className="text-foreground">{displayLanguages}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">{t('about.focus')}</p>
                <p className="text-foreground">{displayFocus}</p>
              </div>
              <div className="h-px bg-border" />
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">{t('about.location')}</p>
                <p className="text-foreground">{parseBilingual(profile.location) || profile.location}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

