import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Cpu, Layers, Sparkles, TrendingUp } from 'lucide-react'

const pillars = [
  {
    icon: Cpu,
    title: 'No es otro TMS',
    description: 'Los TMS organizan datos. BrokerOS AI ejecuta el negocio completo.',
  },
  {
    icon: Layers,
    title: 'No es otro Load Board',
    description: 'Los load boards muestran cargas. Nosotros las cierran, documentan y cobran.',
  },
  {
    icon: Sparkles,
    title: 'Es un Sistema Operativo',
    description: 'Un solo lugar donde ocurre todo: operaciones, comunicación, documentos y finanzas.',
  },
  {
    icon: TrendingUp,
    title: 'Es la próxima empresa de logística',
    description: 'No estamos creando software. Estamos creando la infraestructura para que PYMES compitan con los grandes.',
  },
]

export function SolutionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="solucion" ref={ref} className="relative overflow-hidden py-32 px-4">
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
            The AI Operating System for Freight Brokers
          </span>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-6xl">
            Broker<span className="gradient-text">OS</span> AI
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
            REKORBIA invierte el modelo: broker al revés, potenciado por IA.
            Automatizamos lo que hoy te quita 11 horas para que inviertas en lo que importa — cerrar más cargas.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className="group rounded-3xl glass p-8 transition-all hover:border-orange-500/30 hover:bg-white/[0.06]"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-orange-500/15 p-4 text-orange-400 transition-colors group-hover:bg-orange-500/25">
                <pillar.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold">{pillar.title}</h3>
              <p className="mt-3 text-white/50 leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
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
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/40 to-transparent" />
            <div className="absolute inset-0 flex items-center p-8 md:p-16">
              <div className="max-w-lg">
                <p className="text-sm uppercase tracking-widest text-orange-400">Antes vs Después</p>
                <h3 className="font-display mt-3 text-3xl font-bold md:text-4xl">
                  De 20 cargas al día
                  <br />
                  <span className="gradient-text">a 40 con facturas incluidas</span>
                </h3>
                <p className="mt-4 text-white/60">
                  Misma cantidad de brokers. El doble de revenue. Cero Excels manuales.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
