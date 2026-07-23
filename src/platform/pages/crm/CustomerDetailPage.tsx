import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Mail, Phone, MessageSquare, TrendingUp, Truck,
  DollarSign, Calendar, Building2, ExternalLink, Star, Clock, Brain,
} from 'lucide-react'
import { mockCustomers, mockCustomerAI } from '../../data/mock'
import { useLoadsStore, useInvoicesStore } from '../../store'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useToast } from '../../components/Toast'

export function CustomerDetailPage() {
  const navigate = useNavigate()
  const { tp, language } = useLanguage()
  const { toast } = useToast()
  const customerId = window.location.pathname.split('/').pop()
  const customer = mockCustomers.find((c) => c.id === customerId)
  const customerAI = mockCustomerAI.find((a) => a.customerId === customerId)
  const [activeTab, setActiveTab] = useState<'loads' | 'invoices' | 'activity'>('loads')
  const loads = useLoadsStore((s) => s.loads)
  const invoices = useInvoicesStore((s) => s.invoices)

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Building2 className="h-16 w-16 text-white/10" />
        <p className="mt-4 text-lg text-white/40">{tp.crm.noCustomers}</p>
        <button type="button" onClick={() => navigate('/app/crm')} className="mt-4 text-sm text-orange-400 hover:text-orange-300">
          {tp.loads.backToLoads}
        </button>
      </div>
    )
  }

  const customerLoads = loads.filter((l) => l.customerId === customer.id)
  const customerInvoices = invoices.filter((i) => i.customerId === customer.id)
  const avgMargin = customerLoads.length > 0
    ? Math.round(customerLoads.reduce((a, l) => a + l.margin, 0) / customerLoads.length)
    : 0

  const tabs = [
    { key: 'loads' as const, label: tp.loads.title, count: customerLoads.length },
    { key: 'invoices' as const, label: tp.invoicing.title, count: customerInvoices.length },
    { key: 'activity' as const, label: language === 'es' ? 'Actividad' : 'Activity', count: 5 },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button type="button" onClick={() => navigate('/app/crm')} className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white/80">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/20 font-display text-xl font-bold text-orange-400">
            {customer.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{customer.name}</h1>
            <p className="text-sm text-white/50">{customer.company}</p>
          </div>
          <span className={`ml-2 h-2.5 w-2.5 rounded-full ${customer.status === 'active' ? 'bg-green-400' : 'bg-white/20'}`} />
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: tp.crm.loads, value: customer.totalLoads.toString(), icon: Truck },
          { label: tp.dashboard.revenue, value: `$${(customer.revenue / 1000).toFixed(0)}k`, icon: DollarSign },
          { label: language === 'es' ? 'Margen Promedio' : 'Avg Margin', value: `$${avgMargin}`, icon: TrendingUp },
          { label: tp.crm.since, value: customer.since, icon: Calendar },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-orange-400/60" />
                <span className="text-xs text-white/40">{stat.label}</span>
              </div>
              <p className="mt-2 font-display text-xl font-bold text-white">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Mail className="h-4 w-4" /> {customer.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Phone className="h-4 w-4" /> {customer.phone}
          </div>
          <div className="flex-1" />
          <button type="button" onClick={() => toast({ type: 'success', title: language === 'es' ? 'Email enviado' : 'Email sent', description: `${language === 'es' ? 'A' : 'To'} ${customer.email}` })}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/20"
          >
            <Mail className="h-4 w-4" /> {tp.loads.sendEmail}
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08]">
            <Phone className="h-4 w-4" /> {tp.loads.call}
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08]">
            <MessageSquare className="h-4 w-4" /> {tp.loads.message}
          </button>
        </div>
      </motion.div>

      {customerAI && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-xl border border-orange-500/10 bg-gradient-to-br from-orange-500/[0.06] to-transparent p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-orange-400" />
            <h3 className="font-display text-sm font-bold text-white/80 uppercase tracking-wider">{tp.customerAI.aiInsight}</h3>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs text-white/40">{tp.customerAI.relationship}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < customerAI.relationshipScore ? 'fill-orange-400 text-orange-400' : 'text-white/10'}`} />
              ))}
            </div>
          </div>

          <div className="mb-5 rounded-lg bg-blue-500/5 border border-blue-500/10 px-4 py-3">
            <p className="text-sm italic text-white/50">{customerAI.aiNote}</p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                <TrendingUp className="h-4 w-4 text-orange-400/70" />
              </div>
              <div>
                <p className="text-xs text-white/40">{tp.customerAI.avgMargin}</p>
                <p className="font-display text-sm font-bold text-white">${customerAI.avgMargin}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Clock className="h-4 w-4 text-blue-400/70" />
              </div>
              <div>
                <p className="text-xs text-white/40">{tp.customerAI.avgPayment}</p>
                <p className="font-display text-sm font-bold text-white">{customerAI.avgPaymentDays} {tp.customerAI.days}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10">
                <Truck className="h-4 w-4 text-green-400/70" />
              </div>
              <div>
                <p className="text-xs text-white/40">{tp.customerAI.preferredEquipment}</p>
                <p className="font-display text-sm font-bold text-white">{customerAI.preferredEquipment}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                <DollarSign className="h-4 w-4 text-purple-400/70" />
              </div>
              <div>
                <p className="text-xs text-white/40">{tp.dashboard.revenue}</p>
                <p className="font-display text-sm font-bold text-white">${customerAI.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-orange-500/5 border border-orange-500/10 p-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">{tp.customerAI.recommendedPrice}</p>
                <p className="font-display text-2xl font-bold text-orange-400">${customerAI.priceRecommendation.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-white/30">{tp.customerAI.confidence}</p>
                <p className="font-display text-lg font-bold text-white">{Math.round(customerAI.priceConfidence * 100)}%</p>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div className="h-full rounded-full bg-orange-400 transition-all" style={{ width: `${Math.round(customerAI.priceConfidence * 100)}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-white/30">
              {language === 'es'
                ? `Basado en ${customer.totalLoads} cargas históricas`
                : `Based on ${customer.totalLoads} historical loads`}
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex gap-1 border-b border-white/[0.06]">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            {tab.label}
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{tab.count}</span>
          </button>
        ))}
      </div>

      {activeTab === 'loads' && (
        <div className="space-y-2">
          {customerLoads.map((load) => (
            <motion.div key={load.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/[0.1] cursor-pointer"
              onClick={() => navigate(`/app/loads/${load.id}`)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 font-display text-sm font-bold text-orange-400">
                #{load.loadNumber}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/80">{load.origin} → {load.destination}</p>
                <p className="text-xs text-white/40">{load.equipment} · {load.weight.toLocaleString()} lbs</p>
              </div>
              <span className="text-sm font-medium text-white/70">${load.sellRate.toLocaleString()}</span>
              <ExternalLink className="h-4 w-4 text-white/20" />
            </motion.div>
          ))}
          {customerLoads.length === 0 && (
            <p className="py-8 text-center text-sm text-white/30">{tp.loads.noLoads}</p>
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-2">
          {customerInvoices.map((inv) => (
            <div key={inv.id} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/80">{inv.invoiceNumber}</p>
                <p className="text-xs text-white/40">{language === 'es' ? 'Carga' : 'Load'} #{inv.loadNumber}</p>
              </div>
              <span className="text-sm font-medium text-white/70">${inv.amount.toLocaleString()}</span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                inv.status === 'paid' ? 'bg-green-500/15 text-green-400' :
                inv.status === 'overdue' ? 'bg-red-500/15 text-red-400' :
                'bg-yellow-500/15 text-yellow-400'
              }`}>
                {inv.status}
              </span>
            </div>
          ))}
          {customerInvoices.length === 0 && (
            <p className="py-8 text-center text-sm text-white/30">{tp.invoicing.noInvoices}</p>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-3">
          {[
            { time: '2 hours ago', text: language === 'es' ? 'Email enviado sobre Load #1587' : 'Email sent about Load #1587', type: 'email' },
            { time: '1 day ago', text: language === 'es' ? 'Nueva carga creada: Dallas → Atlanta' : 'New load created: Dallas → Atlanta', type: 'load' },
            { time: '3 days ago', text: language === 'es' ? 'Factura INV-2026-0089 enviada' : 'Invoice INV-2026-0089 sent', type: 'invoice' },
            { time: '5 days ago', text: language === 'es' ? 'Llamada de seguimiento' : 'Follow-up call', type: 'call' },
            { time: '1 week ago', text: language === 'es' ? 'Load #1583 completado y pagado' : 'Load #1583 completed and paid', type: 'load' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                activity.type === 'email' ? 'bg-blue-400' :
                activity.type === 'load' ? 'bg-orange-400' :
                activity.type === 'invoice' ? 'bg-green-400' :
                'bg-purple-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-white/70">{activity.text}</p>
                <p className="mt-1 text-xs text-white/30">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
