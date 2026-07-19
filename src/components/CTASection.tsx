import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowRight, Mail, User, Building2, Send } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contacto" ref={ref} className="relative py-20 px-4 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900 to-navy-950" />
      <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-500/15 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/assets/logos/principal-sobrenegro.svg"
              alt="REKORBIA"
              className="mb-8 h-14 w-auto"
            />
            <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              {t.cta.title}
              <span className="text-white/40">{t.cta.titleEnd}</span>
            </h2>
            <p className="mt-6 text-lg text-white/50 leading-relaxed">
              {t.cta.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/40">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-orange-400" />
                Lesly
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-orange-400" />
                Andy
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-orange-400" />
                Ramón
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-3xl glass-orange p-12 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-3xl">
                  ✓
                </div>
                <h3 className="font-display text-2xl font-bold">{t.cta.success.title}</h3>
                <p className="mt-3 text-white/50">
                  {t.cta.success.description}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-3xl glass p-8 md:p-10">
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-white/60">{t.cta.form.name}</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        required
                        type="text"
                        placeholder={t.cta.form.namePlaceholder}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 outline-none transition-colors focus:border-orange-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-white/60">{t.cta.form.email}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        required
                        type="email"
                        placeholder={t.cta.form.emailPlaceholder}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 outline-none transition-colors focus:border-orange-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-white/60">{t.cta.form.company}</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        required
                        type="text"
                        placeholder={t.cta.form.companyPlaceholder}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 outline-none transition-colors focus:border-orange-500/50"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25"
                >
                  {t.cta.form.submit}
                  <Send className="h-4 w-4" />
                </button>

                <p className="mt-4 text-center text-xs text-white/30">
                  {t.cta.form.disclaimer}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 py-12 px-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <img
          src="/assets/logos/principal-sobrenegro.svg"
          alt="REKORBIA"
          className="h-8 w-auto opacity-80"
        />
        <p className="text-sm text-white/30">
          {t.footer.copyright.replace('{year}', String(year))}
        </p>
        <a
          href="#contacto"
          className="inline-flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300"
        >
          {t.footer.contact}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </footer>
  )
}
