import { useState } from 'react'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrollVisibility } from '@/hooks/useScrollVisibility'
import { cn } from '@/lib/utils'

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

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
              'flex flex-col items-start gap-3 mt-6 transition-all duration-300',
              mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            )}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'text-sm text-foreground mix-blend-difference transition-all duration-300 relative py-1 font-mono',
                  'hover:text-primary',
                  activeSection === item.id && 'text-primary'
                )}
              >
                {item.label}
              </button>
            ))}
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
        </div>
      </div>

      {/* Desktop Logo - Top Left */}
      <div className="hidden md:block fixed top-0 left-0 z-50 p-6 md:p-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm text-foreground mix-blend-difference hover:text-primary transition-colors font-mono"
        >
          HSH<span className="text-primary">.</span>dev
        </button>
      </div>

      {/* Desktop Nav - Bottom Right */}
      <nav
        className={cn(
          'hidden md:block fixed bottom-0 right-0 z-50 p-6 md:p-10 transition-all duration-500',
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
        )}
      >
        <div className="flex flex-col items-end gap-3">
          {navItems.map((item) => (
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
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
