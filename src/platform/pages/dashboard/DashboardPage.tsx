import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Truck,
  DollarSign,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Mail,
  Sparkles,
  Plus,
} from 'lucide-react'
import { useAuthStore } from '../../store'
import { useLanguage } from '../../../i18n/LanguageContext'
import { mockLoads, mockInvoices, mockMessages, mockNotifications } from '../../data/mock'

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
}

const statusLabelMap: Record<string, Record<string, string>> = {
  pending: { es: 'Pendiente', en: 'Pending' },
  quoted: { es: 'Cotizada', en: 'Quoted' },
  booked: { es: 'Reservada', en: 'Booked' },
  dispatched: { es: 'Despachada', en: 'Dispatched' },
  in_transit: { es: 'En Tránsito', en: 'In Transit' },
  delivered: { es: 'Entregada', en: 'Delivered' },
  invoiced: { es: 'Facturada', en: 'Invoiced' },
  paid: { es: 'Pagada', en: 'Paid' },
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { tp, language } = useLanguage()

  const activeLoads = mockLoads.filter((l) => ['dispatched', 'in_transit'].includes(l.status))
  const pendingLoads = mockLoads.filter((l) => ['pending', 'quoted', 'booked'].includes(l.status))
  const unreadMessages = mockMessages.filter((m) => !m.read)
  const unreadNotifications = mockNotifications.filter((n) => !n.read)
  const pendingInvoices = mockInvoices.filter((i) => i.status === 'pending' || i.status === 'overdue')
  const totalRevenue = mockInvoices.filter((i) => i.status === 'paid').reduce((a, i) => a + i.amount, 0)
  const totalMargin = mockLoads.reduce((a, l) => a + l.margin, 0)

  const stats = [
    { label: tp.dashboard.activeLoads, value: activeLoads.length, icon: Truck, color: 'text-orange-400', bg: 'bg-orange-500/10', change: '+2 today' },
    { label: tp.dashboard.pendingLoads, value: pendingLoads.length, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', change: '3 need quotes' },
    { label: tp.dashboard.revenue, value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10', change: '+$4,450 this week' },
    { label: tp.dashboard.totalMargin, value: `$${totalMargin.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10', change: '$600 avg/load' },
  ]

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

  const statusLabel = (s: string) => statusLabelMap[s]?.[language] || s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const greetingText = () => {
    const h = new Date().getHours()
    if (h < 12) return tp.topbar.greeting.morning
    if (h < 18) return tp.topbar.greeting.afternoon
    return tp.topbar.greeting.evening
  }

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn}>
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
          {greetingText()},{' '}
          <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="mt-1 text-sm text-white/50">{tp.dashboard.hereToday}</p>
      </motion.div>

      {unreadNotifications.length > 0 && (
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white/80">
                {tp.dashboard.alerts(unreadNotifications.length)}
              </p>
              <p className="text-xs text-white/40">
                {unreadNotifications[0].title} — {unreadNotifications[0].description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/app/notifications')}
              className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400 transition-colors hover:bg-orange-500/20"
            >
              {tp.dashboard.viewAll}
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        {...fadeIn}
        transition={{ delay: 0.08, duration: 0.4 }}
        className="rounded-xl border border-purple-500/20 bg-purple-500/[0.03]"
      >
        <div className="flex items-center justify-between border-b border-purple-500/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
              <Mail className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-white">{tp.dashboard.incomingEmails}</h2>
              <p className="text-xs text-white/40">{tp.dashboard.incomingEmailsDesc}</p>
            </div>
          </div>
          <span className="flex h-5 items-center rounded-full bg-purple-500/20 px-2 text-[11px] font-medium text-purple-400">
            3 {tp.dashboard.new}
          </span>
        </div>
        <div className="divide-y divide-purple-500/[0.06]">
          {[
            {
              from: 'mike@acmefreight.com',
              subject: 'Need quote: Dallas TX → Chicago IL, 42,000 lbs, dry van',
              extracted: { origin: 'Dallas, TX', destination: 'Chicago, IL', weight: '42,000 lbs', equipment: 'Dry Van' },
              time: '2 min ago',
            },
            {
              from: 'sarah@globallogistics.com',
              subject: 'RE: Load 1847 — Pickup rescheduled to Thursday',
              extracted: { origin: 'Miami, FL', destination: 'Atlanta, GA', weight: '38,500 lbs', equipment: 'Reefer' },
              time: '15 min ago',
            },
            {
              from: 'dispatch@westernexp.com',
              subject: 'FTL available: LA to Phoenix, 48ft flatbed, departing Monday',
              extracted: { origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', weight: '45,000 lbs', equipment: 'Flatbed' },
              time: '1 hr ago',
            },
          ].map((email, i) => (
            <div key={i} className="px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/70">{email.from}</span>
                  <span className="text-[10px] text-white/30">· {email.time}</span>
                </div>
                <Sparkles className="h-3.5 w-3.5 text-purple-400/60" />
              </div>
              <p className="mt-1 text-xs text-white/50">{email.subject}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(email.extracted).map(([key, val]) => (
                  <span key={key} className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300/80">
                    {key}: {val}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => navigate('/app/loads/new')}
                  className="ml-auto flex items-center gap-1 rounded-md bg-orange-500/15 px-2 py-0.5 text-[10px] font-medium text-orange-400 transition-colors hover:bg-orange-500/25"
                >
                  <Plus className="h-3 w-3" />
                  {tp.dashboard.createFromEmail}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.1] hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span className="text-xs text-white/30">{stat.change}</span>
              </div>
              <p className="mt-4 font-display text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm text-white/50">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          {...fadeIn}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] lg:col-span-2"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <h2 className="font-display text-lg font-bold text-white">{tp.dashboard.recentLoads}</h2>
            <button
              type="button"
              onClick={() => navigate('/app/loads')}
              className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
            >
              {tp.dashboard.viewAll} <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {mockLoads.slice(0, 5).map((load) => (
              <button
                key={load.id}
                type="button"
                onClick={() => navigate(`/app/loads/${load.id}`)}
                className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 font-display text-sm font-bold text-orange-400">
                  #{load.loadNumber}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/80">
                    {load.origin} → {load.destination}
                  </p>
                  <p className="text-xs text-white/40">
                    {load.customer} · {load.equipment} · {load.weight.toLocaleString()} lbs
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColor(load.status)}`}>
                  {statusLabel(load.status)}
                </span>
                <span className="shrink-0 text-sm font-medium text-white/70">
                  ${load.sellRate.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeIn}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <h2 className="font-display text-lg font-bold text-white">{tp.dashboard.messages}</h2>
              <span className="flex h-5 items-center rounded-full bg-orange-500/20 px-2 text-[11px] font-medium text-orange-400">
                {unreadMessages.length} {tp.dashboard.new}
              </span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {mockMessages.slice(0, 4).map((msg) => (
                <div key={msg.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white/70">{msg.from}</span>
                    <span className="text-[10px] text-white/20">· {msg.channel}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-white/50">{msg.preview}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <h2 className="font-display text-lg font-bold text-white">{tp.dashboard.invoices}</h2>
              <button
                type="button"
                onClick={() => navigate('/app/invoicing')}
                className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
              >
                {tp.dashboard.viewAll} <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {pendingInvoices.slice(0, 3).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-white/80">{inv.invoiceNumber}</p>
                    <p className="text-xs text-white/40">{inv.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white/80">${inv.amount.toLocaleString()}</p>
                    <span className={`text-[11px] font-medium ${inv.status === 'overdue' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        {...fadeIn}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02]"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-display text-lg font-bold text-white">{tp.dashboard.upcomingPickups}</h2>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {mockLoads
            .filter((l) => ['booked', 'dispatched'].includes(l.status))
            .map((load) => (
              <div key={load.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <Truck className="h-5 w-5 text-orange-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white/80">
                    Load #{load.loadNumber} — {load.origin} → {load.destination}
                  </p>
                  <p className="text-xs text-white/40">
                    {load.carrier} · {load.driver} · Pickup {load.pickupDate}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColor(load.status)}`}>
                  {statusLabel(load.status)}
                </span>
              </div>
            ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 to-transparent p-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">{tp.dashboard.quickActions}</h3>
            <p className="mt-1 text-sm text-white/50">{tp.dashboard.quickActionsDesc}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { label: tp.dashboard.createLoad, path: '/app/loads/new' },
            { label: tp.dashboard.aiAssistant, path: '/app/ai' },
            { label: tp.dashboard.findCarrier, path: '/app/carriers' },
            { label: tp.dashboard.sendInvoice, path: '/app/invoicing' },
          ].map((action) => (
            <button
              key={action.path}
              type="button"
              onClick={() => navigate(action.path)}
              className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
            >
              <ArrowUpRight className="h-4 w-4" />
              {action.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
