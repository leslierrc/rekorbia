import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { categoryColors } from '../data/content'
import { Clock, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  const adminHours = t.problem.tasks
    .filter((item) => item.category !== 'break')
    .reduce((acc, item) => {
      const mins = parseInt(item.duration) || 0
      return acc + mins
    }, 0)

  return (
    <section id="problema" ref={ref} className="relative py-20 px-4 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass-orange px-4 py-1.5 text-sm text-orange-400">
            <AlertTriangle className="h-4 w-4" />
            {t.problem.badge}
          </span>
          <h2 className="font-display mt-6 text-3xl font-bold sm:text-4xl md:text-5xl">
            {t.problem.title}{' '}
            <span className="text-white/40">{t.problem.titleSub}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 sm:text-lg">
            {t.problem.description}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:sticky lg:top-28"
          >
            <div className="overflow-hidden rounded-3xl">
              <img
                src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={t.problem.imageAlt}
                className="aspect-[3/4] w-full object-cover lg:aspect-[4/5]"
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl glass p-4 text-center sm:p-5">
                <p className="font-display text-2xl font-bold text-orange-400 sm:text-3xl">{adminHours / 60}h+</p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">{t.problem.statManual}</p>
              </div>
              <div className="rounded-2xl glass p-4 text-center sm:p-5">
                <p className="font-display text-2xl font-bold text-red-400 sm:text-3xl">0</p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">{t.problem.statNoTime}</p>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-white/10 to-transparent sm:left-6" />

            {t.problem.tasks.map((item, i) => (
              <motion.div
                key={item.time + item.task}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className={`relative mb-3 pl-10 sm:mb-4 sm:pl-16 ${item.category === 'break' ? 'opacity-60' : ''}`}
              >
                <div
                  className="absolute left-2 top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-navy-950 sm:left-4 sm:h-4 sm:w-4"
                  style={{ backgroundColor: categoryColors[item.category] }}
                />

                <div className={`rounded-xl p-3 transition-all hover:scale-[1.02] sm:rounded-2xl sm:p-5 ${item.category === 'break' ? 'glass' : 'glass hover:border-white/15'}`}>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-lg sm:text-2xl">{item.icon}</span>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-orange-400 sm:text-sm">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {item.time}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium sm:px-2.5 sm:text-xs"
                      style={{
                        backgroundColor: `${categoryColors[item.category]}20`,
                        color: categoryColors[item.category],
                      }}
                    >
                      {item.duration}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-white/90 sm:mt-2">{item.task}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mx-auto mt-12 max-w-3xl rounded-2xl glass-orange p-6 text-center sm:mt-20 sm:rounded-3xl sm:p-8 md:p-12"
        >
          <p
            className="font-display text-lg font-semibold leading-relaxed sm:text-xl md:text-2xl"
            dangerouslySetInnerHTML={{ __html: t.problem.quote }}
          />
        </motion.blockquote>
      </div>
    </section>
  )
}
