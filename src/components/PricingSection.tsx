import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { Link } from 'react-router-dom'

export function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useLanguage()

  return (
    <section id="precios" ref={ref} className="relative py-20 px-4 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900/50 to-navy-950" />
      <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-400">
            <Sparkles className="h-4 w-4" />
            {t.pricing.badge}
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-lg text-white/50">{t.pricing.subtitle}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {t.pricing.plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative rounded-2xl border p-8 transition-all ${
                plan.popular
                  ? 'border-orange-500/40 bg-gradient-to-b from-orange-500/10 to-transparent shadow-lg shadow-orange-500/10'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-orange-500 px-4 py-1 text-xs font-semibold text-white">
                    {t.pricing.mostPopular}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-white/40">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-white/40">$</span>
                  <span className="font-display text-5xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm text-white/40">{t.pricing.monthly}</span>
                </div>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-white/60">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${
                  plan.popular
                    ? 'bg-orange-500 text-white hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25'
                    : 'border border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {t.pricing.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
        >
          <p className="text-sm text-white/40">
            <span className="font-semibold text-white/60">{t.pricing.futureTitle}:</span>{' '}
            {t.pricing.futureDescription}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
