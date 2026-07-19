import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../i18n/LanguageContext'
import { mockLoads, mockAIInbox, mockInvoices, currentUser } from '../../data/mock'
import { Bot, Sparkles, ArrowRight, Mail, MessageSquare, ShieldCheck, FileText, Truck, Clock, DollarSign, TrendingUp, Package, ChevronRight, Zap, AlertCircle, CheckCircle2 } from 'lucide-react'

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
  const { tp } = useLanguage()

  const activeLoads = mockLoads.filter((l) => ['dispatched', 'in_transit', 'booked'].includes(l.status))
  const paidToday = mockInvoices.filter((i) => i.status === 'paid')
  const todayRevenue = paidToday.reduce((a, i) => a + i.amount, 0)
  const todayMargin = mockLoads.filter((l) => l.status === 'paid').reduce((a, l) => a + l.margin, 0)
  const pickupsToday = mockLoads.filter((l) => l.status === 'in_transit').length
  const readyEmails = mockAIInbox.filter((e: any) => e.status === 'ready' || e.status === 'detected')

  const suggestions = [
    { label: 'Create 5 Loads', description: 'From detected emails awaiting action', icon: Package, accent: 'text-orange-400 bg-orange-500/10', path: '/app/loads/new', arrow: true },
    { label: 'Reply to ABC Logistics', description: 'Robert Chen asked about pickup time', icon: MessageSquare, accent: 'text-blue-400 bg-blue-500/10', path: '/app/loads/1' },
    { label: 'Process 14 emails', description: 'AI detected potential loads in inbox', icon: Mail, accent: 'text-purple-400 bg-purple-500/10', path: '/app/loads/new' },
    { label: 'Verify Carrier', description: 'Pacific Coast Hauling pending verification', icon: ShieldCheck, accent: 'text-green-400 bg-green-500/10', path: '/app/carriers' },
    { label: 'Generate 3 Invoices', description: 'Delivered loads awaiting invoicing', icon: FileText, accent: 'text-cyan-400 bg-cyan-500/10', path: '/app/invoicing' },
  ]

  const recentActivity = [
    { type: 'load', icon: Truck, description: 'Load #1587 picked up in Dallas, TX', time: '15 min ago', ai: true },
    { type: 'message', icon: MessageSquare, description: 'Robert Chen — "Can we push pickup to 9 AM?"', time: '30 min ago', ai: false },
    { type: 'invoice', icon: DollarSign, description: 'INV-2026-0088 paid by Pacific Freight Co — $2,350', time: '2 hrs ago', ai: false },
    { type: 'email', icon: Mail, description: 'AI detected load opportunity from dispatch@westernexp.com', time: '1 hr ago', ai: true },
    { type: 'alert', icon: AlertCircle, description: 'Pacific Coast Hauling insurance expires in 5 days', time: '1 hr ago', ai: true },
    { type: 'success', icon: CheckCircle2, description: 'Load #1584 delivered — Atlanta to Miami', time: '3 hrs ago', ai: false },
  ]

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
          3 emails with load detected · 2 loads waiting for action · 1 invoice to send · 1 POD missing
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
            <Zap className="h-3 w-3" /> 5 actions
          </span>
        </div>
        <div className="space-y-1">
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
          {readyEmails.slice(0, 3).map((email: any) => (
            <div key={email.id} className="px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/70">{email.from}</span>
                  <span className="text-[10px] text-white/20">· {email.time}</span>
                </div>
                <Sparkles className="h-3.5 w-3.5 text-purple-400/60" />
              </div>
              <p className="mt-1 text-xs text-white/50">{email.subject}</p>
              {email.extracted && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {email.extracted.origin && (
                    <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300/80">
                      {email.extracted.origin} → {email.extracted.destination}
                    </span>
                  )}
                  {email.extracted.weight && (
                    <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300/80">
                      {email.extracted.weight}
                    </span>
                  )}
                  {email.extracted.equipment && (
                    <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300/80">
                      {email.extracted.equipment}
                    </span>
                  )}
                  {email.suggestedPrice && (
                    <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-300/80">
                      Suggested: ${email.suggestedPrice.toLocaleString()} ({email.confidence}% confidence)
                    </span>
                  )}
                  {email.carrierCandidates && (
                    <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300/80">
                      {email.carrierCandidates} carriers found
                    </span>
                  )}
                </div>
              )}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/app/loads/new')}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-500/15 px-3 py-1.5 text-[11px] font-semibold text-orange-400 transition-colors hover:bg-orange-500/25"
                >
                  <Package className="h-3 w-3" />
                  Create Load
                </button>
                <button
                  type="button"
                  className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/50"
                >
                  Ignore
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
