import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Language = 'fr' | 'en';

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    'nav.about': 'À propos',
    'nav.skills': 'Compétences',
    'nav.projects': 'Projets',
    'nav.experience': 'Expérience',
    'nav.contact': 'Contact',
    'admin.login': 'Admin',
    'hero.portfolio': 'Portfolio / 2025',
    'hero.role_title': 'Rôle',
    'hero.role': 'Développeur Full-Stack Junior',
    'hero.based_in': 'Basé à',
    'hero.location': 'Fianarantsoa, Madagascar 🇲🇬',
    'hero.desc_p1': 'Création d\'applications web ',
    'hero.desc_secure': 'sécurisées',
    'hero.desc_p2': ' et ',
    'hero.desc_scalable': 'évolutives',
    'hero.desc_p3': ' avec une approche centrée sur l\'utilisateur — des interfaces élégantes aux backends robustes.',
    'hero.scroll': 'DÉFILER',
    'about.title': '01 / À propos',
    'about.heading_1': 'Construire le web,',
    'about.heading_2': 'un commit à la fois.',
    'about.currently': 'Actuellement',
    'about.languages': 'Langues',
    'about.focus': 'Domaines',
    'about.location': 'Localisation',
    'skills.title': '02 / Stack',
    'skills.heading_1': 'Compétences &',
    'skills.heading_2': 'Technologies',
    'projects.title': '03 / Projets',
    'projects.heading_1': 'Projets',
    'projects.heading_2': 'Sélectionnés',
    'exp.title': '04 / Expérience',
    'exp.heading_1': 'Travail &',
    'exp.heading_2': 'Éducation',
    'contact.title': '05 / Contact',
    'contact.heading_1': 'Construisons',
    'contact.heading_2': 'quelque chose ensemble.',
    'contact.get_in_touch': 'Me contacter',
    'contact.based_in': 'Basé à',
    'contact.desc': 'Ouvert aux rôles de développeur junior, aux projets freelance et aux collaborations intéressantes. N\'hésitez pas à me contacter — je réponds généralement sous 24 heures.',
    'contact.footer_crafted': '© 2026 Harentsoa Sarobidy Harivelo. Fait avec soin.',
  },
  en: {
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',
    'admin.login': 'Admin',
    'hero.portfolio': 'Portfolio / 2025',
    'hero.role_title': 'Role',
    'hero.role': 'Junior Full-Stack Developer',
    'hero.based_in': 'Based in',
    'hero.location': 'Fianarantsoa, Madagascar 🇲🇬',
    'hero.desc_p1': 'Crafting ',
    'hero.desc_secure': 'secure',
    'hero.desc_p2': ', ',
    'hero.desc_scalable': 'scalable',
    'hero.desc_p3': ' web applications with a user-centered approach — from elegant interfaces to robust backends.',
    'hero.scroll': 'SCROLL',
    'about.title': '01 / About',
    'about.heading_1': 'Building the web,',
    'about.heading_2': 'one commit at a time.',
    'about.currently': 'Currently',
    'about.languages': 'Languages',
    'about.focus': 'Focus',
    'about.location': 'Location',
    'skills.title': '02 / Stack',
    'skills.heading_1': 'Skills &',
    'skills.heading_2': 'Technologies',
    'projects.title': '03 / Work',
    'projects.heading_1': 'Selected',
    'projects.heading_2': 'Projects',
    'exp.title': '04 / Experience',
    'exp.heading_1': 'Work &',
    'exp.heading_2': 'Education',
    'contact.title': '05 / Contact',
    'contact.heading_1': 'Let\'s build',
    'contact.heading_2': 'something together.',
    'contact.get_in_touch': 'Get in Touch',
    'contact.based_in': 'Based in',
    'contact.desc': 'Open to junior developer roles, freelance projects, and interesting collaborations. Reach out — I usually reply within 24 hours.',
    'contact.footer_crafted': '© 2026 Harentsoa Sarobidy Harivelo. Crafted with care.',
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // default
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'fr' || saved === 'en') return saved;
    return 'fr'; // default
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('language', newLang);
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
