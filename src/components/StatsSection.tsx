import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { stats } from '../data/content'

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return

    const numericMatch = value.match(/(\d+\.?\d*)/)
    if (!numericMatch) {
      setDisplay(value)
      return
    }

    const target = parseFloat(numericMatch[1])
    const suffix = value.replace(numericMatch[0], '')
    const prefix = value.startsWith('$') ? '$' : ''
    const duration = 2000
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased

      if (value.includes('.')) {
        setDisplay(`${prefix}${current.toFixed(2)}${suffix}`)
      } else {
        setDisplay(`${prefix}${Math.round(current)}${suffix}`)
      }

      if (progress < 1) requestAnimationFrame(animate)
    }

    const timeout = setTimeout(() => requestAnimationFrame(animate), delay)
    return () => clearTimeout(timeout)
  }, [isInView, value, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="text-center"
    >
      <p className="font-display text-5xl font-extrabold gradient-text md:text-6xl">
        {display}
      </p>
      <p className="mt-3 text-sm text-white/50 md:text-base">{label}</p>
    </motion.div>
  )
}

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-24 px-4">
      <div className="absolute inset-0 bg-navy-900" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="rounded-3xl glass-orange p-12 md:p-16"
        >
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                delay={i * 150}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function ComparisonSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const categories = [
    { name: 'Emails & WhatsApp', manual: 135, automated: 15 },
    { name: 'Excel & CRM', manual: 60, automated: 5 },
    { name: 'Llamadas carriers', manual: 90, automated: 20 },
    { name: 'Documentos', manual: 120, automated: 10 },
    { name: 'Finanzas', manual: 105, automated: 15 },
  ]

  return (
    <section ref={ref} className="relative py-32 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Tu día: <span className="text-red-400">705 min</span> manuales →{' '}
            <span className="gradient-text">65 min</span> con IA
          </h2>
        </motion.div>

        <div className="space-y-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 * i }}
              className="rounded-2xl glass p-6"
            >
              <div className="mb-3 flex justify-between text-sm">
                <span className="font-medium">{cat.name}</span>
                <span className="text-white/40">
                  {cat.manual} min → <span className="text-orange-400">{cat.automated} min</span>
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${(cat.manual / 135) * 100}%` } : {}}
                  transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                  className="absolute inset-y-0 left-0 rounded-full bg-red-500/40"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${(cat.automated / 135) * 100}%` } : {}}
                  transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                  className="absolute inset-y-0 left-0 rounded-full bg-orange-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
