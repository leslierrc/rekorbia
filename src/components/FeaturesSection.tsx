import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Zap,
  Brain,
  MessageSquare,
  FileText,
  MapPin,
  DollarSign,
  type LucideIcon,
} from 'lucide-react'
import { features } from '../data/content'

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Brain,
  MessageSquare,
  FileText,
  MapPin,
  DollarSign,
}

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" ref={ref} className="relative py-32 px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col items-center text-center lg:flex-row lg:items-end lg:justify-between lg:text-left"
        >
          <div>
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-orange-400">
              Capacidades
            </span>
            <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">
              Todo lo que un broker necesita.
              <br />
              <span className="text-white/40">En un solo OS.</span>
            </h2>
          </div>
          <img
            src="https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Camión en carretera"
            className="mt-8 hidden h-32 w-48 rounded-2xl object-cover lg:block"
          />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon]
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 * i }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl glass p-8"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/5 transition-all group-hover:bg-orange-500/10" />
                <div className="relative">
                  <div className="mb-5 inline-flex rounded-xl bg-orange-500/15 p-3 text-orange-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
