import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { t, language, setLanguage } = useLanguage()

  const toggleLang = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl glass px-6 py-3">
        <a href="#" className="flex items-center gap-3">
          <img
            src="/assets/rekorbia-logo.png"
            alt="REKORBIA"
            className="h-8 w-auto object-contain"
          />
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {t.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-orange-400"
            >
              {link.label}
            </a>
          ))}

          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-orange-500/40 hover:text-orange-400"
          >
            <Globe className="h-3.5 w-3.5" />
            {language === 'es' ? 'EN' : 'ES'}
          </button>

          <a
            href="#contacto"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25"
          >
            {t.nav.cta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={toggleLang}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white/60"
          >
            <Globe className="h-3 w-3" />
            {language === 'es' ? 'EN' : 'ES'}
          </button>
          <button
            type="button"
            className="text-white/80"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-7xl rounded-2xl glass p-6 md:hidden"
        >
          {t.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-white/70 hover:text-orange-400"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t.nav.cta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      )}
    </motion.header>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const { t } = useLanguage()

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/photos/4484076/pexels-photo-4484076.jpeg?auto=compress&cs=tinysrgb&w=1920"
          className="h-full w-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/4484076/4484076-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/70 to-navy-950" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <img
            src="/assets/rekorbia-logo.png"
            alt="REKORBIA"
            className="mx-auto h-16 md:h-24 w-auto object-contain drop-shadow-2xl"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-orange-400"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-display max-w-5xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-6xl lg:text-7xl"
        >
          {t.hero.titleLine1}
          <span className="gradient-text">{t.hero.titleGradient}</span>
          <br />
          {t.hero.titleLine2}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-6 max-w-2xl text-lg text-white/60 md:text-xl"
          dangerouslySetInnerHTML={{ __html: t.hero.description }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#contacto"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-xl hover:shadow-orange-500/30"
          >
            {t.hero.ctaPrimary}
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="#problema"
            className="inline-flex items-center justify-center gap-2 rounded-full glass px-8 py-4 text-base font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            {t.hero.ctaSecondary}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="h-10 w-6 rounded-full border border-white/20 p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mx-auto h-2 w-1.5 rounded-full bg-orange-500"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute -bottom-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/20 blur-[120px] animate-pulse-glow" />
    </section>
  )
}
