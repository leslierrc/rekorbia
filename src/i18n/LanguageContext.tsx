import { createContext, useContext, useState, type ReactNode } from 'react'
import { es } from './es'
import { en } from './en'

export type Language = 'es' | 'en'

const translations = { es, en } as const

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof es | typeof en
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('rekorbia-lang')
    if (saved === 'es' || saved === 'en') return saved
    const browserLang = navigator.language.split('-')[0]
    return browserLang === 'es' ? 'es' : 'en'
  })

  const handleChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('rekorbia-lang', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleChange, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
