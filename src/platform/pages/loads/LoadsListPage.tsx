import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Truck, ArrowUpDown } from 'lucide-react'
import { mockLoads } from '../../data/mock'
import { useLanguage } from '../../../i18n/LanguageContext'

const statusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400',
    quoted: 'bg-blue-500/15 text-blue-400',
    booked: 'bg-indigo-500/15 text-indigo-400',
    dispatched: 'bg-purple-500/15 text-purple-400',
    in_transit: 'bg-orange-500/15 text-orange-400',
    delivered: 'bg-green-500/15 text-green-400',
    invoiced: 'bg-cyan-500/15 text-cyan-400',
    paid: 'bg-emerald-500/15 text-emerald-400',
  }
  return map[status] || 'bg-white/10 text-white/60'
}

export function LoadsListPage() {
  const navigate = useNavigate()
  const { tp } = useLanguage()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<'loadNumber' | 'sellRate' | 'pickupDate'>('loadNumber')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const statuses = ['all', 'pending', 'quoted', 'booked', 'dispatched', 'in_transit', 'delivered', 'invoiced', 'paid'] as const

  const statusTranslationMap: Record<string, string> = {
    all: tp.loads.all,
    pending: tp.loads.pending,
    quoted: tp.loads.quoted,
    booked: tp.loads.booked,
    dispatched: tp.loads.dispatched,
    in_transit: tp.loads.in_transit,
    delivered: tp.loads.delivered,
    invoiced: tp.loads.invoiced,
    paid: tp.loads.paid,
  }

  const filtered = mockLoads
    .filter((l) => statusFilter === 'all' || l.status === statusFilter)
    .filter((l) =>
      search === '' ||
      l.customer.toLowerCase().includes(search.toLowerCase()) ||
      l.origin.toLowerCase().includes(search.toLowerCase()) ||
      l.destination.toLowerCase().includes(search.toLowerCase()) ||
      `#${l.loadNumber}`.includes(search)
    )
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'loadNumber') return (a.loadNumber - b.loadNumber) * dir
      if (sortField === 'sellRate') return (a.sellRate - b.sellRate) * dir
      return (a.pickupDate.localeCompare(b.pickupDate)) * dir
    })

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{tp.loads.title}</h1>
          <p className="mt-1 text-sm text-white/50">{tp.loads.total(filtered.length)}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/app/loads/new')}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25"
        >
          <Plus className="h-4 w-4" />
          {tp.loads.newLoad}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tp.loads.search}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pr-4 pl-10 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-white/30" />
          <div className="flex flex-wrap gap-1">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-orange-500/15 text-orange-400'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                }`}
              >
                {statusTranslationMap[s]}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-xs font-medium text-white/40">
                  <button type="button" onClick={() => toggleSort('loadNumber')} className="flex items-center gap-1 hover:text-white/60">
                    {tp.loads.title} <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.loads.customer}</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.loads.route}</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.loads.equipment}</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">
                  <button type="button" onClick={() => toggleSort('pickupDate')} className="flex items-center gap-1 hover:text-white/60">
                    {tp.loads.pickup} <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">Status</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">
                  <button type="button" onClick={() => toggleSort('sellRate')} className="flex items-center gap-1 hover:text-white/60">
                    {tp.loads.rate} <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.loads.margin}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((load) => (
                <tr
                  key={load.id}
                  className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                  onClick={() => navigate(`/app/loads/${load.id}`)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 font-display text-xs font-bold text-orange-400">
                        <Truck className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-white/80">#{load.loadNumber}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-white/60">{load.customer}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-white/60">{load.origin}</span>
                    <span className="mx-1.5 text-white/20">→</span>
                    <span className="text-white/60">{load.destination}</span>
                  </td>
                  <td className="px-5 py-3.5 text-white/60">{load.equipment}</td>
                  <td className="px-5 py-3.5 text-white/60">{load.pickupDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColor(load.status)}`}>
                      {statusTranslationMap[load.status] || load.status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-white/80">${load.sellRate.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={load.margin > 0 ? 'text-green-400' : 'text-white/30'}>
                      {load.margin > 0 ? `$${load.margin}` : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Truck className="mx-auto h-12 w-12 text-white/10" />
            <p className="mt-3 text-sm text-white/40">{tp.loads.noLoads}</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
