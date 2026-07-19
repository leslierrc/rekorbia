import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BarChart3, TrendingUp, DollarSign, Truck, Clock, Target } from 'lucide-react'
import { useLanguage } from '../../../i18n/LanguageContext'
import { mockLoads, mockInvoices, mockCustomers, mockCarriers } from '../../data/mock'

export function AnalyticsPage() {
  const navigate = useNavigate()
  const { tp, language } = useLanguage()

  const totalRevenue = mockInvoices.filter((i) => i.status === 'paid').reduce((a, i) => a + i.amount, 0)
  const totalMargin = mockLoads.reduce((a, l) => a + l.margin, 0)
  const avgMargin = mockLoads.length > 0 ? Math.round(totalMargin / mockLoads.filter((l) => l.margin > 0).length) : 0
  const totalLoads = mockLoads.length
  const activeLoads = mockLoads.filter((l) => ['dispatched', 'in_transit'].includes(l.status)).length
  const completedLoads = mockLoads.filter((l) => ['delivered', 'invoiced', 'paid'].includes(l.status)).length
  const activeCarriers = mockCarriers.filter((c) => c.status === 'verified').length
  const activeCustomers = mockCustomers.filter((c) => c.status === 'active').length

  const statusDistribution = [
    { status: tp.loads.pending, count: mockLoads.filter((l) => l.status === 'pending').length, color: 'bg-yellow-500' },
    { status: tp.loads.quoted, count: mockLoads.filter((l) => l.status === 'quoted').length, color: 'bg-blue-500' },
    { status: tp.loads.booked, count: mockLoads.filter((l) => l.status === 'booked').length, color: 'bg-indigo-500' },
    { status: tp.loads.dispatched, count: mockLoads.filter((l) => l.status === 'dispatched').length, color: 'bg-purple-500' },
    { status: tp.loads.in_transit, count: mockLoads.filter((l) => l.status === 'in_transit').length, color: 'bg-orange-500' },
    { status: tp.loads.delivered, count: mockLoads.filter((l) => l.status === 'delivered').length, color: 'bg-green-500' },
    { status: tp.loads.invoiced, count: mockLoads.filter((l) => l.status === 'invoiced').length, color: 'bg-cyan-500' },
    { status: tp.loads.paid, count: mockLoads.filter((l) => l.status === 'paid').length, color: 'bg-emerald-500' },
  ]

  const maxCount = Math.max(...statusDistribution.map((s) => s.count), 1)

  const topRoutes = [
    { route: 'Dallas, TX → Atlanta, GA', loads: 3, revenue: 7350, margin: 1650 },
    { route: 'Los Angeles, CA → Phoenix, AZ', loads: 2, revenue: 3300, margin: 900 },
    { route: 'Houston, TX → Chicago, IL', loads: 1, revenue: 2800, margin: 0 },
    { route: 'Miami, FL → Charlotte, NC', loads: 1, revenue: 2700, margin: 600 },
    { route: 'Seattle, WA → San Francisco, CA', loads: 1, revenue: 2350, margin: 550 },
  ]

  const topCustomers = mockCustomers
    .filter((c) => c.status === 'active')
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white">
          {language === 'es' ? 'Analíticas' : 'Analytics'}
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {language === 'es' ? 'Vista completa de tu operación' : 'Complete view of your operation'}
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: tp.dashboard.revenue, value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: tp.dashboard.totalMargin, value: `$${totalMargin.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: language === 'es' ? 'Margen Promedio' : 'Avg Margin', value: `$${avgMargin}`, icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: language === 'es' ? 'Carga Promedio' : 'Avg Load', value: `$${totalLoads > 0 ? Math.round(totalRevenue / totalLoads).toLocaleString() : 0}`, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-white/40">{stat.label}</p>
                  <p className="font-display text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 lg:col-span-2"
        >
          <h3 className="mb-4 font-display text-lg font-bold text-white">
            {language === 'es' ? 'Distribución por Estado' : 'Status Distribution'}
          </h3>
          <div className="space-y-3">
            {statusDistribution.map((item) => (
              <div key={item.status} className="flex items-center gap-3">
                <span className="w-24 text-xs text-white/50">{item.status}</span>
                <div className="flex-1">
                  <div className="relative h-6 overflow-hidden rounded-lg bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / maxCount) * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                      className={`absolute inset-y-0 left-0 rounded-lg ${item.color}`}
                      style={{ minWidth: item.count > 0 ? '24px' : '0' }}
                    />
                  </div>
                </div>
                <span className="w-8 text-right font-display text-sm font-bold text-white/70">{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <h3 className="mb-4 font-display text-lg font-bold text-white">
            {language === 'es' ? 'Resumen Operativo' : 'Operations Summary'}
          </h3>
          <div className="space-y-4">
            {[
              { label: language === 'es' ? 'Total Cargas' : 'Total Loads', value: totalLoads, icon: Truck },
              { label: language === 'es' ? 'Activas' : 'Active', value: activeLoads, icon: Clock },
              { label: language === 'es' ? 'Completadas' : 'Completed', value: completedLoads, icon: Target },
              { label: language === 'es' ? 'Clientes Activos' : 'Active Customers', value: activeCustomers, icon: DollarSign },
              { label: language === 'es' ? 'Transportistas Verificados' : 'Verified Carriers', value: activeCarriers, icon: Truck },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-white/20" />
                    <span className="text-sm text-white/50">{item.label}</span>
                  </div>
                  <span className="font-display text-lg font-bold text-white">{item.value}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <h3 className="mb-4 font-display text-lg font-bold text-white">
            {language === 'es' ? 'Top Rutas' : 'Top Routes'}
          </h3>
          <div className="space-y-3">
            {topRoutes.map((route, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-white/[0.02] p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-bold text-orange-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/70">{route.route}</p>
                  <p className="text-[11px] text-white/30">
                    {route.loads} {language === 'es' ? 'cargas' : 'loads'} · ${route.revenue.toLocaleString()} {language === 'es' ? 'ingreso' : 'revenue'}
                  </p>
                </div>
                <span className={`text-sm font-medium ${route.margin > 0 ? 'text-green-400' : 'text-white/30'}`}>
                  {route.margin > 0 ? `$${route.margin}` : '—'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <h3 className="mb-4 font-display text-lg font-bold text-white">
            {language === 'es' ? 'Top Clientes' : 'Top Customers'}
          </h3>
          <div className="space-y-3">
            {topCustomers.map((customer, i) => (
              <button key={customer.id} type="button" onClick={() => navigate(`/app/crm/${customer.id}`)}
                className="flex w-full items-center gap-3 rounded-lg bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/[0.04]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-bold text-orange-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white/70">{customer.name}</p>
                  <p className="text-[11px] text-white/30">{customer.company} · {customer.totalLoads} {language === 'es' ? 'cargas' : 'loads'}</p>
                </div>
                <span className="text-sm font-medium text-white/70">${(customer.revenue / 1000).toFixed(0)}k</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
