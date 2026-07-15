import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { brokerDay, categoryColors } from '../data/content'
import { Clock, AlertTriangle } from 'lucide-react'

export function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const adminHours = brokerDay
    .filter((item) => item.category !== 'break')
    .reduce((acc, item) => {
      const mins = parseInt(item.duration) || 0
      return acc + mins
    }, 0)

  return (
    <section id="problema" ref={ref} className="relative py-32 px-4">
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
            El día a día de un broker
          </span>
          <h2 className="font-display mt-6 text-4xl font-bold md:text-5xl">
            11.75 horas.{' '}
            <span className="text-white/40">Cero tiempo para crecer.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
            Gmail, WhatsApp, llamadas, Excel, DAT, Word, QuickBooks…
            El broker es quien más maneja el dinero y quien más trabajo administrativo hace.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="sticky top-28"
          >
            <div className="overflow-hidden rounded-3xl">
              <img
                src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Broker trabajando con múltiples pantallas"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl glass p-5 text-center">
                <p className="font-display text-3xl font-bold text-orange-400">{adminHours / 60}h+</p>
                <p className="mt-1 text-sm text-white/50">En tareas manuales</p>
              </div>
              <div className="rounded-2xl glass p-5 text-center">
                <p className="font-display text-3xl font-bold text-red-400">0</p>
                <p className="mt-1 text-sm text-white/50">Tiempo para vender más</p>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-white/10 to-transparent" />

            {brokerDay.map((item, i) => (
              <motion.div
                key={item.time + item.task}
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className={`relative mb-4 pl-16 ${item.category === 'break' ? 'opacity-60' : ''}`}
              >
                <div
                  className="absolute left-4 top-5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-navy-950"
                  style={{ backgroundColor: categoryColors[item.category] }}
                />

                <div className={`rounded-2xl p-5 transition-all hover:scale-[1.02] ${item.category === 'break' ? 'glass' : 'glass hover:border-white/15'}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="flex items-center gap-1.5 text-sm font-mono text-orange-400">
                      <Clock className="h-3.5 w-3.5" />
                      {item.time}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${categoryColors[item.category]}20`,
                        color: categoryColors[item.category],
                      }}
                    >
                      {item.duration}
                    </span>
                  </div>
                  <p className="mt-2 font-medium text-white/90">{item.task}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mx-auto mt-20 max-w-3xl rounded-3xl glass-orange p-8 text-center md:p-12"
        >
          <p className="font-display text-xl font-semibold leading-relaxed md:text-2xl">
            "Si en un día hacían 20 Excels, con BrokerOS AI hacen{' '}
            <span className="gradient-text">40 con facturas y documentos</span>.
            Vendemos tiempo. Vendemos más dinero para ellos."
          </p>
        </motion.blockquote>
      </div>
    </section>
  )
}
