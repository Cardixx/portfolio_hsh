import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' }
}

const links = [
  { label: 'Email', value: 'hariveloharentsoasarobidy@gmail.com', href: 'mailto:hariveloharentsoasarobidy@gmail.com' },
  { label: 'GitHub', value: '@Cardixx', href: 'https://github.com/Cardixx' },
  { label: 'LinkedIn', value: 'Harentsoa Sarobidy', href: 'https://linkedin.com/in/harentsoa-harivelo11' },
]

export function Contact() {
  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Glowing orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div {...fadeInUp} className="mb-12 md:mb-16">
          <span className="font-mono text-xs text-primary tracking-widest uppercase inline-flex items-center gap-2">
            <span className="w-8 h-px bg-primary" />
            05 / Contact
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="font-display text-6xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tighter mb-10 md:mb-14"
        >
          Let's build<br />
          <span className="text-gradient">something.</span>
        </motion.h2>

        <motion.p
          {...fadeInUp}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-16 md:mb-20 leading-relaxed"
        >
          Open to junior developer roles, freelance projects, and interesting collaborations.
          Reach out — I usually reply within 24 hours.
        </motion.p>

        <div className="space-y-0">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group flex items-center justify-between border-t border-border py-6 md:py-8 hover:bg-card/50 transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
            >
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  {link.label}
                </p>
                <p className="text-xl md:text-2xl lg:text-3xl text-foreground group-hover:text-primary transition-colors">
                  {link.value}
                </p>
              </div>
              <span className="text-2xl md:text-3xl text-muted-foreground group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all">
                ↗
              </span>
            </motion.a>
          ))}
          <div className="border-t border-border" />
        </div>

        <motion.footer
          {...fadeInUp}
          className="mt-20 md:mt-32 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <p className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Harentsoa Sarobidy Harivelo. Crafted with care.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Fianarantsoa · Madagascar 🇲🇬
          </p>
        </motion.footer>
      </div>
    </section>
  )
}
