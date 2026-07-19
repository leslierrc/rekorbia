import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Users, Mail, Phone, TrendingUp } from 'lucide-react'
import { mockCustomers } from '../../data/mock'
import { useLanguage } from '../../../i18n/LanguageContext'

export function CRMPage() {
  const navigate = useNavigate()
  const { tp } = useLanguage()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const filtered = mockCustomers
    .filter((c) => filter === 'all' || c.status === filter)
    .filter((c) =>
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    )

  const filterLabels: Record<string, string> = {
    all: tp.crm.all,
    active: tp.crm.active,
    inactive: tp.crm.inactive,
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{tp.crm.title}</h1>
          <p className="mt-1 text-sm text-white/50">{tp.crm.subtitle}</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25">
          <Plus className="h-4 w-4" /> {tp.crm.addCustomer}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tp.crm.search} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pr-4 pl-10 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filter === f ? 'bg-orange-500/15 text-orange-400' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}>
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((customer, i) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.04 }}
            className="group cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
            onClick={() => navigate(`/app/crm/${customer.id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/15 text-sm font-bold text-orange-400">
                {customer.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/80">{customer.name}</p>
                <p className="truncate text-xs text-white/40">{customer.company}</p>
              </div>
              <span className={`h-2 w-2 rounded-full ${customer.status === 'active' ? 'bg-green-400' : 'bg-white/20'}`} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                <p className="font-display text-lg font-bold text-white">{customer.totalLoads}</p>
                <p className="text-[11px] text-white/40">{tp.crm.loads}</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                <p className="font-display text-lg font-bold text-white">${(customer.revenue / 1000).toFixed(0)}k</p>
                <p className="text-[11px] text-white/40">{tp.crm.revenue}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Mail className="h-3 w-3" /> {customer.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Phone className="h-3 w-3" /> {customer.phone}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-white/30">{tp.crm.since} {customer.since}</span>
              <span className="flex items-center gap-1 text-[11px] text-orange-400 opacity-0 transition-opacity group-hover:opacity-100">
                {tp.crm.viewDetails} <TrendingUp className="h-3 w-3" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-white/10" />
          <p className="mt-3 text-sm text-white/40">{tp.crm.noCustomers}</p>
        </div>
      )}
    </div>
  )
}
