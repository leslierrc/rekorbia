import { motion } from 'framer-motion'
import { MapPin, Truck, Clock, ArrowRight } from 'lucide-react'
import { mockLoads } from '../../data/mock'
import { useLanguage } from '../../../i18n/LanguageContext'

const statusTranslationMap: Record<string, Record<string, string>> = {
  in_transit: { es: 'En Tránsito', en: 'In Transit' },
  dispatched: { es: 'Despachada', en: 'Dispatched' },
  booked: { es: 'Reservada', en: 'Booked' },
}

export function TrackingPage() {
  const activeLoads = mockLoads.filter((l) => ['dispatched', 'in_transit', 'booked'].includes(l.status))
  const { tp, language } = useLanguage()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white">{tp.tracking.title}</h1>
        <p className="mt-1 text-sm text-white/50">{tp.tracking.subtitle}</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeLoads.map((load, i) => (
          <motion.div
            key={load.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-bold text-orange-400">#{load.loadNumber}</span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                load.status === 'in_transit' ? 'bg-orange-500/15 text-orange-400' :
                load.status === 'dispatched' ? 'bg-purple-500/15 text-purple-400' :
                'bg-blue-500/15 text-blue-400'
              }`}>
                {statusTranslationMap[load.status]?.[language] || load.status}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white/80">{load.origin.split(',')[0]}</p>
                <p className="text-[11px] text-white/30">{load.originState}</p>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <div className="h-0.5 flex-1 bg-white/10" />
                <ArrowRight className="h-4 w-4 text-orange-400/50" />
                <div className="h-0.5 flex-1 bg-white/10" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">{load.destination.split(',')[0]}</p>
                <p className="text-[11px] text-white/30">{load.destinationState}</p>
              </div>
            </div>

            {load.tracking > 0 && (
              <div className="mt-4">
                <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-400" style={{ width: `${load.tracking}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-white/40">
                  <span>{load.tracking}% {tp.tracking.complete}</span>
                  <span>{load.mileage} {tp.tracking.totalMileage}</span>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
              {load.driver && (
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Truck className="h-3 w-3" /> {load.driver} — {load.carrier}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Clock className="h-3 w-3" /> {tp.tracking.eta} {load.deliveryDate}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <MapPin className="h-3 w-3" /> {load.equipment} · {load.weight.toLocaleString()} lbs
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {activeLoads.length === 0 && (
        <div className="py-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-white/10" />
          <p className="mt-3 text-sm text-white/40">{tp.tracking.noActive}</p>
        </div>
      )}
    </div>
  )
}
