import { useState } from 'react'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrollVisibility } from '@/hooks/useScrollVisibility'
import { useSettings } from '@/contexts/SettingsContext'
import { cn } from '@/lib/utils'
import { Moon, Sun, Globe } from 'lucide-react'

const navItemKeys = [
  { id: 'about', labelKey: 'nav.about' },
  { id: 'skills', labelKey: 'nav.skills' },
  { id: 'projects', labelKey: 'nav.projects' },
  { id: 'experience', labelKey: 'nav.experience' },
  { id: 'contact', labelKey: 'nav.contact' },
]

const socialLinks = [
  { label: 'Mail', href: 'mailto:harentsoa@example.com' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
]

export function Navigation() {
  const activeSection = useActiveSection()
  const isVisible = useScrollVisibility()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme, language, setLanguage, t } = useSettings()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => setLanguage(language === 'fr' ? 'en' : 'fr');

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start md:hidden">
        <div className="relative">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-sm text-foreground mix-blend-difference font-mono"
          >
            {mobileMenuOpen ? '× Close' : '☰ Menu'}
          </button>
          <div
            className={cn(
              'flex flex-col items-start gap-3 mt-6 transition-all duration-300 bg-background/80 backdrop-blur-md p-4 rounded-lg',
              mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            )}
          >
            {navItemKeys.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'text-sm text-foreground transition-all duration-300 relative py-1 font-mono',
                  'hover:text-primary',
                  activeSection === item.id && 'text-primary'
                )}
              >
                {t(item.labelKey)}
              </button>
            ))}
            <a
              href="/admin/login"
              className="text-xs text-primary py-1 font-mono hover:underline flex items-center gap-1"
            >
              🔒 {t('admin.login')}
            </a>
            
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border w-full">
               <button onClick={toggleTheme} className="text-foreground hover:text-primary transition-colors">
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>
               <button onClick={toggleLanguage} className="text-foreground hover:text-primary transition-colors flex items-center gap-1 text-xs font-mono uppercase font-bold">
                  <Globe className="w-4 h-4" /> {language}
               </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="text-xs text-foreground mix-blend-difference hover:text-primary transition-colors font-mono"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* Desktop Social Links - Top Right */}
      <div className="hidden md:block fixed top-0 right-0 z-50 p-6 md:p-10">
        <div className="flex items-center gap-6 justify-end">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="text-sm text-foreground mix-blend-difference hover:text-primary transition-colors font-mono"
            >
              {link.label}
            </a>
          ))}
          
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border/50">
               <button onClick={toggleTheme} className="text-foreground mix-blend-difference hover:text-primary transition-colors">
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>
               <button onClick={toggleLanguage} className="text-foreground mix-blend-difference hover:text-primary transition-colors flex items-center gap-1 text-sm font-mono uppercase font-bold">
                  <Globe className="w-4 h-4" /> {language}
               </button>
          </div>
        </div>
      </div>

      {/* Desktop Admin Login - Top Left */}
      <div className="hidden md:block fixed top-0 left-0 z-50 p-6 md:p-10">
        <a
          href="/admin/login"
          className="text-sm text-foreground mix-blend-difference hover:text-primary transition-colors font-mono flex items-center gap-2"
        >
          HSH<span className="text-primary">.</span>dev
        </a>
      </div>

      {/* Desktop Nav - Bottom Right */}
      <nav
        className={cn(
          'hidden md:block fixed bottom-0 right-0 z-50 p-6 md:p-10 transition-all duration-500',
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
        )}
      >
        <div className="flex flex-col items-end gap-3">
          {navItemKeys.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                'text-sm transition-all duration-300 relative py-1 font-mono',
                'hover:text-primary',
                activeSection === item.id ? 'text-primary' : 'text-foreground/70'
              )}
            >
              {activeSection === item.id && <span className="text-primary mr-2">→</span>}
              {t(item.labelKey)}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}

