import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../i18n/LanguageContext'
import { currentUser } from '../../data/mock'
import { useLoadsStore, useInvoicesStore, useInboxStore, useWorkflowStore } from '../../store'
import { Bot, Sparkles, ArrowRight, Mail, ShieldCheck, FileText, Truck, Clock, DollarSign, TrendingUp, Package, ChevronRight, Zap, CheckCircle2 } from 'lucide-react'

const activityIcon: Record<string, typeof Truck> = {
  email_received: Mail,
  ai_created: Bot,
  carrier_suggested: ShieldCheck,
  carrier_assigned: ShieldCheck,
  rate_conf_sent: FileText,
  rate_conf_accepted: CheckCircle2,
  pickup: Truck,
  in_transit: Truck,
  delivered: CheckCircle2,
  pod_received: FileText,
  invoice_generated: DollarSign,
  payment_received: DollarSign,
}

function timeAgo(iso: string, language: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.max(1, Math.round(diffMs / 60000))
  if (mins < 60) return language === 'es' ? `hace ${mins} min` : `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return language === 'es' ? `hace ${hrs} h` : `${hrs} hr${hrs > 1 ? 's' : ''} ago`
  const days = Math.round(hrs / 24)
  return language === 'es' ? `hace ${days} d` : `${days} day${days > 1 ? 's' : ''} ago`
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  quoted: 'bg-blue-500/15 text-blue-400',
  booked: 'bg-indigo-500/15 text-indigo-400',
  dispatched: 'bg-purple-500/15 text-purple-400',
  in_transit: 'bg-orange-500/15 text-orange-400',
  delivered: 'bg-green-500/15 text-green-400',
  invoiced: 'bg-cyan-500/15 text-cyan-400',
  paid: 'bg-emerald-500/15 text-emerald-400',
}

function greetingText(tp: any) {
  const h = new Date().getHours()
  if (h < 12) return tp.topbar.greeting.morning
  if (h < 18) return tp.topbar.greeting.afternoon
  return tp.topbar.greeting.evening
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { tp, language } = useLanguage()

  const loads = useLoadsStore((s) => s.loads)
  const invoices = useInvoicesStore((s) => s.invoices)
  const inboxItems = useInboxStore((s) => s.items)
  const updateInboxItem = useInboxStore((s) => s.updateItem)
  const events = useWorkflowStore((s) => s.events)

  const activeLoads = loads.filter((l) => ['dispatched', 'in_transit', 'booked'].includes(l.status))
  const paidToday = invoices.filter((i) => i.status === 'paid')
  const todayRevenue = paidToday.reduce((a, i) => a + i.amount, 0)
  const todayMargin = loads.filter((l) => l.status === 'paid').reduce((a, l) => a + l.margin, 0)
  const pickupsToday = loads.filter((l) => l.status === 'in_transit').length
  const readyEmails = inboxItems.filter((e) => e.status === 'ready' || e.status === 'detected')
  const invoicedLoadIds = new Set(invoices.map((i) => i.loadId))
  const uninvoicedDelivered = loads.filter((l) => l.status === 'delivered' && !invoicedLoadIds.has(l.id))
  const podMissing = loads.filter((l) => l.status === 'delivered').length

  const suggestions = [
    { label: language === 'es' ? `Procesar ${readyEmails.length} emails` : `Process ${readyEmails.length} emails`, description: language === 'es' ? 'La IA detectó posibles cargas en tu bandeja' : 'AI detected potential loads in your inbox', icon: Mail, accent: 'text-purple-400 bg-purple-500/10', path: '/app/ai-inbox', arrow: true, hidden: readyEmails.length === 0 },
    { label: language === 'es' ? `Generar ${uninvoicedDelivered.length} facturas` : `Generate ${uninvoicedDelivered.length} invoices`, description: language === 'es' ? 'Cargas entregadas esperando factura' : 'Delivered loads awaiting invoicing', icon: FileText, accent: 'text-cyan-400 bg-cyan-500/10', path: '/app/invoicing', hidden: uninvoicedDelivered.length === 0 },
    { label: language === 'es' ? `${activeLoads.length} cargas activas` : `${activeLoads.length} active loads`, description: language === 'es' ? 'En tránsito o pendientes de despacho' : 'In transit or awaiting dispatch', icon: Truck, accent: 'text-orange-400 bg-orange-500/10', path: '/app/tracking', hidden: activeLoads.length === 0 },
    { label: language === 'es' ? 'Verificar Carrier' : 'Verify Carrier', description: language === 'es' ? 'Pacific Coast Hauling con verificación pendiente' : 'Pacific Coast Hauling pending verification', icon: ShieldCheck, accent: 'text-green-400 bg-green-500/10', path: '/app/carriers' },
  ].filter((s) => !s.hidden)

  const recentActivity = [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6)
    .map((e) => ({ icon: activityIcon[e.type] || Bot, description: `${e.description}`, time: timeAgo(e.timestamp, language), ai: e.aiGenerated }))

  return (
    <div className="space-y-6">
      {/* ── 1. AI Briefing Header ────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-orange-400/70">
          {greetingText(tp)}
        </p>
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
          {greetingText(tp)}, <span className="gradient-text">{currentUser.name}</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">
          {language === 'es'
            ? `${readyEmails.length} emails con carga detectada · ${activeLoads.length} cargas en curso · ${uninvoicedDelivered.length} facturas por enviar · ${podMissing} PODs pendientes`
            : `${readyEmails.length} emails with load detected · ${activeLoads.length} loads in progress · ${uninvoicedDelivered.length} invoices to send · ${podMissing} PODs pending`}
        </p>
      </div>

      {/* ── 2. AI Suggestions Panel ──────────────────────────────── */}
      <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.06] to-transparent p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15">
            <Sparkles className="h-4 w-4 text-orange-400" />
          </div>
          <h2 className="font-display text-lg font-bold text-white">AI Suggestions</h2>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-orange-500/15 px-2.5 py-0.5 text-[11px] font-medium text-orange-400">
            <Zap className="h-3 w-3" /> {suggestions.length} {language === 'es' ? 'acciones' : 'actions'}
          </span>
        </div>
        <div className="space-y-1">
          {suggestions.length === 0 && (
            <p className="px-3 py-3 text-sm text-white/40">{language === 'es' ? 'Todo al día. No hay acciones pendientes.' : "You're all caught up. No pending actions."}</p>
          )}
          {suggestions.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.path)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all hover:bg-white/[0.04]"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white/90">{item.label}</p>
                  <p className="text-xs text-white/40">{item.description}</p>
                </div>
                {item.arrow ? (
                  <ArrowRight className="h-4 w-4 shrink-0 text-orange-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/20" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 3. AI-Processed Emails ───────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15">
              <Bot className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-white">AI-Detected Emails</h2>
              <p className="text-xs text-white/40">AI detected potential loads in your inbox</p>
            </div>
          </div>
          <span className="flex h-5 items-center rounded-full bg-purple-500/20 px-2 text-[11px] font-medium text-purple-400">
            {readyEmails.length} new
          </span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {readyEmails.length === 0 && (
            <p className="px-5 py-6 text-center text-sm text-white/30">{language === 'es' ? 'No hay emails nuevos con carga detectada' : 'No new emails with a detected load'}</p>
          )}
          {readyEmails.slice(0, 3).map((email) => (
            <div key={email.id} className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/70">{email.emailFrom}</span>
                  <span className="text-[10px] text-white/20">· {timeAgo(email.emailDate, language)}</span>
                </div>
                <Sparkles className="h-3.5 w-3.5 text-purple-400/60" />
              </div>
              <p className="mt-1 text-xs text-white/50">{email.emailSubject}</p>
              {email.detectedLoad && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300/80">
                    {email.detectedLoad.origin} → {email.detectedLoad.destination}
                  </span>
                  <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300/80">
                    {email.detectedLoad.weight.toLocaleString()} lbs
                  </span>
                  <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300/80">
                    {email.detectedLoad.equipment}
                  </span>
                  <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-300/80">
                    {language === 'es' ? 'Sugerido' : 'Suggested'}: ${email.detectedLoad.suggestedPrice.toLocaleString()} ({Math.round(email.detectedLoad.confidence * 100)}%)
                  </span>
                  {email.carrierCandidates > 0 && (
                    <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300/80">
                      {email.carrierCandidates} {language === 'es' ? 'carriers encontrados' : 'carriers found'}
                    </span>
                  )}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/app/ai-inbox')}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-500/15 px-3 py-1.5 text-[11px] font-semibold text-orange-400 transition-colors hover:bg-orange-500/25"
                >
                  <Package className="h-3 w-3" />
                  {language === 'es' ? 'Crear carga' : 'Create Load'}
                </button>
                <button
                  type="button"
                  onClick={() => updateInboxItem(email.id, { status: 'ignored' })}
                  className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/50"
                >
                  {language === 'es' ? 'Ignorar' : 'Ignore'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Today's Pulse (compact stats) ─────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
            <span className="text-xs text-white/40">Today's Revenue</span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-white">${todayRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-xs text-white/40">Today's Margin</span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-white">${todayMargin.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
              <Truck className="h-4 w-4 text-orange-400" />
            </div>
            <span className="text-xs text-white/40">Today's Pickups</span>
          </div>
          <p className="mt-2 font-display text-xl font-bold text-white">{pickupsToday}</p>
        </div>
      </div>

      {/* ── 5. Active Loads (compact table) ──────────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-display text-sm font-bold text-white">
            Active Loads <span className="ml-1 text-xs font-normal text-white/30">({activeLoads.length})</span>
          </h2>
          <button
            type="button"
            onClick={() => navigate('/app/loads')}
            className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
          >
            View All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04] text-left text-[11px] uppercase tracking-wider text-white/30">
                <th className="px-5 py-2.5 font-medium">Load #</th>
                <th className="px-5 py-2.5 font-medium">Route</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Carrier</th>
                <th className="px-5 py-2.5 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {activeLoads.slice(0, 5).map((load) => (
                <tr
                  key={load.id}
                  onClick={() => navigate(`/app/loads/${load.id}`)}
                  className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-5 py-3 text-sm font-semibold text-orange-400">
                    #{load.loadNumber}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-sm text-white/70">
                    {load.origin} → {load.destination}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColor[load.status]}`}>
                      {load.status === 'in_transit' ? 'In Transit' : load.status.charAt(0).toUpperCase() + load.status.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-sm text-white/50">
                    {load.carrier || '—'}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-sm text-white/40">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {load.deliveryDate}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 6. Recent Activity Feed ──────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <h2 className="font-display text-sm font-bold text-white">Recent Activity</h2>
          <span className="text-[11px] text-white/30">Today</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {recentActivity.map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                  <Icon className="h-4 w-4 text-white/40" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm text-white/70">{item.description}</p>
                    {item.ai && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-medium text-purple-400">
                        <Sparkles className="h-2.5 w-2.5" /> AI
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-white/30">{item.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
