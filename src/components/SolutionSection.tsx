import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Cpu, Layers, Sparkles, TrendingUp } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const iconMap = [Cpu, Layers, Sparkles, TrendingUp]

export function SolutionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useLanguage()

  return (
    <section id="solucion" ref={ref} className="relative overflow-hidden py-20 px-4 sm:py-32">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-orange-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
            {t.solution.subtitle}
          </span>
          <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl md:text-6xl">
            Broker<span className="gradient-text">OS</span> AI
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
            {t.solution.description}
          </p>
        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {t.solution.pillars.map((pillar, i) => {
            const Icon = iconMap[i]
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="group rounded-3xl glass p-8 transition-all hover:border-orange-500/30 hover:bg-white/[0.06]"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-orange-500/15 p-4 text-orange-400 transition-colors group-hover:bg-orange-500/25">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-bold">{pillar.title}</h3>
                <p className="mt-3 text-white/50 leading-relaxed">{pillar.description}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 overflow-hidden rounded-3xl"
        >
          <div className="relative aspect-video">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source
                src="https://videos.pexels.com/video-files/6774633/6774633-uhd_2560_1440_25fps.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/60 to-navy-950/30" />
            <div className="absolute inset-0 grid items-center p-4 sm:p-6 md:p-10 lg:p-16 lg:grid-cols-[1fr_1fr]">
              <div className="max-w-lg">
                <p className="text-xs uppercase tracking-widest text-orange-400 sm:text-sm">{t.solution.antesVsDespues.badge}</p>
                <h3 className="font-display mt-3 text-2xl font-bold sm:text-3xl md:text-4xl">
                  {t.solution.antesVsDespues.titleLine1}
                  <br />
                  <span className="gradient-text">{t.solution.antesVsDespues.titleLine2}</span>
                </h3>
                <p className="mt-3 text-sm text-white/60 sm:mt-4 sm:text-base">
                  {t.solution.antesVsDespues.description}
                </p>
              </div>
              <div className="hidden h-full lg:flex lg:items-center lg:justify-end">
                <img
                  src="https://images.pexels.com/photos/6169640/pexels-photo-6169640.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Logistics operator working"
                  className="h-full w-full max-w-sm rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
