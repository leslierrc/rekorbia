import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, AlertTriangle, Lightbulb, Star, DollarSign, Truck, Users, BarChart3, ArrowUpRight, Sparkles, Target, Zap } from 'lucide-react'
import { useLanguage } from '../../../i18n/LanguageContext'
import { mockCustomers, mockAnalyticsInsights, mockCarriers } from '../../data/mock'
import { useLoadsStore, useInvoicesStore } from '../../store'

const insightConfig = {
  trend: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'trend' as const },
  alert: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'alert' as const },
  recommendation: { icon: Lightbulb, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'recommendation' as const },
  opportunity: { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'opportunity' as const },
}

const impactConfig = {
  high: { color: 'text-red-400', bg: 'bg-red-500/10', key: 'highImpact' as const },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', key: 'mediumImpact' as const },
  low: { color: 'text-slate-400', bg: 'bg-slate-500/10', key: 'lowImpact' as const },
}

export function AnalyticsPage() {
  const navigate = useNavigate()
  const { tp, language } = useLanguage()
  const loads = useLoadsStore((s) => s.loads)
  const invoices = useInvoicesStore((s) => s.invoices)

  const totalRevenue = invoices.filter((i) => i.status === 'paid').reduce((a, i) => a + i.amount, 0)
  const totalMargin = loads.reduce((a, l) => a + l.margin, 0)
  const avgMargin = loads.length > 0 ? Math.round(totalMargin / Math.max(1, loads.filter((l) => l.margin > 0).length)) : 0
  const totalLoads = loads.length
  const activeLoads = loads.filter((l) => ['dispatched', 'in_transit'].includes(l.status)).length
  const completedLoads = loads.filter((l) => ['delivered', 'invoiced', 'paid'].includes(l.status)).length
  const activeCarriers = mockCarriers.filter((c) => c.status === 'verified').length
  const activeCustomers = mockCustomers.filter((c) => c.status === 'active').length
  const pendingLoads = loads.filter((l) => l.status === 'pending').length

  const statusDistribution = [
    { status: tp.loads.pending, count: loads.filter((l) => l.status === 'pending').length, color: 'bg-yellow-500' },
    { status: tp.loads.quoted, count: loads.filter((l) => l.status === 'quoted').length, color: 'bg-blue-500' },
    { status: tp.loads.booked, count: loads.filter((l) => l.status === 'booked').length, color: 'bg-indigo-500' },
    { status: tp.loads.dispatched, count: loads.filter((l) => l.status === 'dispatched').length, color: 'bg-purple-500' },
    { status: tp.loads.in_transit, count: loads.filter((l) => l.status === 'in_transit').length, color: 'bg-orange-500' },
    { status: tp.loads.delivered, count: loads.filter((l) => l.status === 'delivered').length, color: 'bg-green-500' },
    { status: tp.loads.invoiced, count: loads.filter((l) => l.status === 'invoiced').length, color: 'bg-cyan-500' },
    { status: tp.loads.paid, count: loads.filter((l) => l.status === 'paid').length, color: 'bg-emerald-500' },
  ]

  const maxCount = Math.max(...statusDistribution.map((s) => s.count), 1)

  const topRoutes = [
    { route: 'Dallas, TX → Atlanta, GA', loads: 3, revenue: 7350, margin: 1650, aiNote: language === 'es' ? '94% aceptación de transportistas' : '94% carrier acceptance' },
    { route: 'Los Angeles, CA → Phoenix, AZ', loads: 2, revenue: 3300, margin: 900, aiNote: language === 'es' ? 'Margen bajo, considerar ajuste' : 'Low margin, consider rate adjustment' },
    { route: 'Houston, TX → Chicago, IL', loads: 1, revenue: 2800, margin: 0, aiNote: language === 'es' ? 'Sin margen aún — carga pendiente' : 'No margin yet — pending load' },
    { route: 'Miami, FL → Charlotte, NC', loads: 1, revenue: 2700, margin: 600, aiNote: language === 'es' ? 'Flatebed consistent' : 'Consistent flatbed lane' },
    { route: 'Seattle, WA → San Francisco, CA', loads: 1, revenue: 2350, margin: 550, aiNote: language === 'es' ? 'Lane rentable con reefer' : 'Profitable lane with reefer' },
  ]

  const topCustomers = mockCustomers
    .filter((c) => c.status === 'active')
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const customerAiNotes: Record<string, string> = {
    '1': language === 'es' ? 'Cliente premium, paga temprano' : 'Premium customer, pays early',
    '2': language === 'es' ? 'Sensible al precio, ofrecer tarifas competitivas' : 'Price-sensitive, offer competitive rates',
    '3': language === 'es' ? 'En crecimiento, pagos más lentos' : 'Growing account, slower payments',
    '4': language === 'es' ? 'Nuevo pero confiable, upsell potential' : 'New but reliable, upsell potential',
    '6': language === 'es' ? 'Estable, especialista en flatbed' : 'Steady, flatbed specialist',
  }

  const customerRelationScore: Record<string, number> = {
    '1': 5,
    '2': 4,
    '3': 3,
    '4': 4,
    '6': 4,
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white">
          {language === 'es' ? 'Analíticas' : 'Analytics'}
        </h1>
        <p className="mt-1 text-sm text-white/50">
          {language === 'es' ? 'Vista completa de tu operación con inteligencia de IA' : 'Complete view of your operation with AI intelligence'}
        </p>
      </motion.div>

      {/* AI Insights Panel */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <h2 className="font-display text-sm font-semibold text-white/70">{tp.analyticsAI.insightsTitle}</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mockAnalyticsInsights.map((insight, i) => {
            const config = insightConfig[insight.type]
            const Icon = config.icon
            const impact = impactConfig[insight.impact]
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className={`rounded-xl border ${config.border} ${config.bg} p-4`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${config.bg} ${config.color}`}>
                    <Icon className="h-3 w-3" />
                    {tp.analyticsAI[config.label]}
                  </span>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${impact.bg} ${impact.color}`}>
                    {tp.analyticsAI[impact.key]}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 leading-tight">{insight.title}</h3>
                <p className="text-[12px] text-white/40 leading-relaxed mb-2">{insight.description}</p>
                {insight.metric && (
                  <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
                    <span className="font-display text-base font-bold text-white">{insight.metric}</span>
                    {insight.change && (
                      <span className={`text-[11px] font-medium ${insight.type === 'alert' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {insight.change}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: tp.dashboard.revenue, value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: tp.dashboard.totalMargin, value: `$${totalMargin.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: language === 'es' ? 'Margen Promedio' : 'Avg Margin', value: `$${avgMargin}`, icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: language === 'es' ? 'Carga Promedio' : 'Avg Load', value: `$${totalLoads > 0 ? Math.round(totalRevenue / totalLoads).toLocaleString() : 0}`, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.04 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[11px] text-white/40">{stat.label}</p>
                  <p className="font-display text-lg font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 lg:col-span-2"
        >
          <h3 className="mb-1 font-display text-lg font-bold text-white">
            {language === 'es' ? 'Distribución por Estado' : 'Status Distribution'}
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-3 w-3 text-purple-400" />
            <p className="text-[11px] text-white/40">
              {language === 'es'
                ? `La mayoría de las cargas están en tránsito — ${pendingLoads} esperando asignación`
                : `Most loads are in transit — ${pendingLoads} awaiting carrier assignment`}
            </p>
          </div>
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

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <h3 className="mb-1 font-display text-lg font-bold text-white">
            {language === 'es' ? 'Resumen Operativo' : 'Operations Summary'}
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-3 w-3 text-purple-400" />
            <p className="text-[11px] text-white/40">
              {language === 'es' ? 'Evaluación IA: Operación funcionando bien' : 'AI Assessment: Operation running smoothly'}
            </p>
          </div>
          <div className="space-y-3">
            {[
              { label: language === 'es' ? 'Total Cargas' : 'Total Loads', value: totalLoads, icon: Truck },
              { label: language === 'es' ? 'Activas' : 'Active', value: activeLoads, icon: Zap },
              { label: language === 'es' ? 'Completadas' : 'Completed', value: completedLoads, icon: Target },
              { label: language === 'es' ? 'Clientes Activos' : 'Active Customers', value: activeCustomers, icon: Users },
              { label: language === 'es' ? 'Transportistas' : 'Verified Carriers', value: activeCarriers, icon: Truck },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-white/20" />
                    <span className="text-sm text-white/50">{item.label}</span>
                  </div>
                  <span className="font-display text-base font-bold text-white">{item.value}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Route & Customer Intelligence */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-orange-400" />
            <h3 className="font-display text-lg font-bold text-white">
              {language === 'es' ? 'Top Rutas' : 'Top Routes'}
            </h3>
          </div>
          <div className="space-y-3">
            {topRoutes.map((route, i) => (
              <div key={i} className="rounded-lg bg-white/[0.02] p-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-bold text-orange-400">
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
                <div className="flex items-center gap-1.5 mt-2 ml-10">
                  <ArrowUpRight className="h-3 w-3 text-purple-400" />
                  <p className="text-[11px] text-purple-400/70">{route.aiNote}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-blue-400" />
            <h3 className="font-display text-lg font-bold text-white">
              {language === 'es' ? 'Top Clientes' : 'Top Customers'}
            </h3>
          </div>
          <div className="space-y-3">
            {topCustomers.map((customer, i) => {
              const score = customerRelationScore[customer.id]
              return (
                <button key={customer.id} type="button" onClick={() => navigate(`/app/crm/${customer.id}`)}
                  className="flex w-full flex-col rounded-lg bg-white/[0.02] p-3 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-xs font-bold text-orange-400">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white/70">{customer.name}</p>
                      <p className="text-[11px] text-white/30">{customer.company} · {customer.totalLoads} {language === 'es' ? 'cargas' : 'loads'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-white/70">${(customer.revenue / 1000).toFixed(0)}k</span>
                      {score && (
                        <div className="flex items-center gap-0.5 justify-end mt-0.5">
                          {Array.from({ length: score }).map((_, s) => (
                            <Star key={s} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {customerAiNotes[customer.id] && (
                    <div className="flex items-center gap-1.5 mt-2 ml-10">
                      <ArrowUpRight className="h-3 w-3 text-blue-400" />
                      <p className="text-[11px] text-blue-400/70">{customerAiNotes[customer.id]}</p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
