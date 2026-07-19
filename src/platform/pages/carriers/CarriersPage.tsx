import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Shield, ShieldCheck, ShieldAlert, ShieldX, Star, Truck, Phone, Mail, Eye } from 'lucide-react'
import { mockCarriers } from '../../data/mock'
import { useLanguage } from '../../../i18n/LanguageContext'

const statusConfig = {
  verified: { icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/15' },
  pending: { icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  rejected: { icon: ShieldX, color: 'text-red-400', bg: 'bg-red-500/15' },
}

const safetyConfig: Record<string, { color: string; icon: typeof Shield }> = {
  Satisfactory: { color: 'text-green-400', icon: ShieldCheck },
  Conditional: { color: 'text-yellow-400', icon: ShieldAlert },
  Unsatisfactory: { color: 'text-red-400', icon: ShieldX },
  None: { color: 'text-white/30', icon: Shield },
}

export function CarriersPage() {
  const navigate = useNavigate()
  const { tp } = useLanguage()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all')

  const filtered = mockCarriers
    .filter((c) => filter === 'all' || c.status === filter)
    .filter((c) =>
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mcNumber.toLowerCase().includes(search.toLowerCase())
    )

  const filterLabels: Record<string, string> = {
    all: tp.carriers.all,
    verified: tp.carriers.verified,
    pending: tp.carriers.pending,
    rejected: tp.carriers.rejected,
  }

  const statusLabels: Record<string, string> = {
    verified: tp.carriers.verified,
    pending: tp.carriers.pending,
    rejected: tp.carriers.rejected,
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{tp.carriers.title}</h1>
          <p className="mt-1 text-sm text-white/50">{tp.carriers.subtitle}</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25">
          <Plus className="h-4 w-4" /> {tp.carriers.addCarrier}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tp.carriers.search} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pr-4 pl-10 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
        </div>
        <div className="flex gap-2">
          {(['all', 'verified', 'pending', 'rejected'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filter === f ? 'bg-orange-500/15 text-orange-400' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}>
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-3">
        {filtered.map((carrier, i) => {
          const status = statusConfig[carrier.status]
          const safety = safetyConfig[carrier.safetyRating]
          const StatusIcon = status.icon
          const SafetyIcon = safety.icon
          return (
            <motion.div
              key={carrier.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 font-display text-lg font-bold text-orange-400">
                    {carrier.name.split(' ').slice(0, 2).map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{carrier.name}</p>
                    <p className="text-xs text-white/40">{carrier.mcNumber} · {carrier.dotNumber}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap items-center gap-3 sm:justify-end">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.bg} ${status.color}`}>
                    <StatusIcon className="h-3 w-3" /> {statusLabels[carrier.status]}
                  </span>

                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${safety.color}`}>
                    <SafetyIcon className="h-3 w-3" /> {carrier.safetyRating}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-white/50">
                    <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                    {carrier.rating}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-white/40">
                    <Truck className="h-3 w-3" />
                    {carrier.totalLoads} {tp.carriers.loads}
                  </div>

                  <div className="flex gap-1">
                    {carrier.insurance && (
                      <span className="rounded bg-green-500/15 px-1.5 py-0.5 text-[10px] font-medium text-green-400">INS</span>
                    )}
                    {!carrier.insurance && (
                      <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-400">NO INS</span>
                    )}
                    {carrier.authority && (
                      <span className="rounded bg-green-500/15 px-1.5 py-0.5 text-[10px] font-medium text-green-400">AUTH</span>
                    )}
                    {!carrier.authority && (
                      <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-400">NO AUTH</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
                {carrier.equipment.map((eq) => (
                  <span key={eq} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/50">{eq}</span>
                ))}
                <div className="flex-1" />
                <div className="flex gap-1">
                  <button type="button" className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60" title={tp.carriers.call}>
                    <Phone className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60" title={tp.carriers.email}>
                    <Mail className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => navigate(`/app/carriers/${carrier.id}`)} className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-orange-400" title={tp.carriers.viewDetails}>
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <Shield className="mx-auto h-12 w-12 text-white/10" />
          <p className="mt-3 text-sm text-white/40">{tp.carriers.noCarriers}</p>
        </div>
      )}
    </div>
  )
}
