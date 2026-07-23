import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Receipt, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useInvoicesStore, useLoadsStore } from '../../store'
import { useToast } from '../../components/Toast'
import { generateInvoiceForLoad } from '../../services/workflow'
import { useLanguage } from '../../../i18n/LanguageContext'

const statusConfig = {
  draft: { color: 'text-white/40', bg: 'bg-white/10', icon: Receipt },
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/15', icon: Clock },
  overdue: { color: 'text-red-400', bg: 'bg-red-500/15', icon: AlertTriangle },
  paid: { color: 'text-green-400', bg: 'bg-green-500/15', icon: CheckCircle2 },
}

export function InvoicingPage() {
  const navigate = useNavigate()
  const { tp, language } = useLanguage()
  const { toast } = useToast()
  const invoices = useInvoicesStore((s) => s.invoices)
  const updateInvoice = useInvoicesStore((s) => s.updateInvoice)
  const loads = useLoadsStore((s) => s.loads)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'draft' | 'pending' | 'overdue' | 'paid'>('all')

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    invoices.forEach((inv) => {
      if (inv.status === 'pending' && inv.dueDate < today) {
        updateInvoice(inv.id, { status: 'overdue' })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices])

  const handleNewInvoice = () => {
    const invoicedLoadIds = new Set(invoices.map((i) => i.loadId))
    const eligible = loads.find((l) => l.status === 'delivered' && !invoicedLoadIds.has(l.id))
    if (!eligible) {
      toast({ type: 'warning', title: language === 'es' ? 'Nada por facturar' : 'Nothing to invoice', description: language === 'es' ? 'No hay cargas entregadas sin factura' : 'No delivered loads are missing an invoice' })
      return
    }
    const invoice = generateInvoiceForLoad(eligible)
    toast({ type: 'success', title: language === 'es' ? 'Factura creada' : 'Invoice created', description: invoice.invoiceNumber })
  }

  const filtered = invoices
    .filter((i) => filter === 'all' || i.status === filter)
    .filter((i) =>
      search === '' ||
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.toLowerCase().includes(search.toLowerCase())
    )

  const totalPending = invoices.filter((i) => i.status === 'pending').reduce((a, i) => a + i.amount, 0)
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((a, i) => a + i.amount, 0)
  const totalPaid = invoices.filter((i) => i.status === 'paid').reduce((a, i) => a + i.amount, 0)

  const filterLabels: Record<string, string> = {
    all: tp.invoicing.all,
    draft: tp.invoicing.draft,
    pending: tp.invoicing.pending,
    overdue: tp.invoicing.overdue,
    paid: tp.invoicing.paid,
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{tp.invoicing.title}</h1>
          <p className="mt-1 text-sm text-white/50">{tp.invoicing.subtitle}</p>
        </div>
        <button type="button" onClick={handleNewInvoice} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25">
          <Plus className="h-4 w-4" /> {tp.invoicing.newInvoice}
        </button>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: tp.invoicing.pending, value: totalPending, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: tp.invoicing.overdue, value: totalOverdue, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: tp.invoicing.paid, value: totalPaid, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-white/40">{stat.label}</p>
                  <p className="font-display text-xl font-bold text-white">${stat.value.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tp.invoicing.search} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pr-4 pl-10 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
        </div>
        <div className="flex gap-2">
          {(['all', 'draft', 'pending', 'overdue', 'paid'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filter === f ? 'bg-orange-500/15 text-orange-400' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}>
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.invoicing.invoice}</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.invoicing.customer}</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.invoicing.load}</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.invoicing.amount}</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.invoicing.status}</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.invoicing.issued}</th>
                <th className="px-5 py-3 text-xs font-medium text-white/40">{tp.invoicing.due}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((inv) => {
                const status = statusConfig[inv.status]
                const StatusIcon = status.icon
                return (
                  <tr key={inv.id} className="cursor-pointer transition-colors hover:bg-white/[0.02]" onClick={() => navigate(`/app/invoicing/${inv.id}`)}>
                    <td className="px-5 py-3.5 font-medium text-white/80">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3.5 text-white/60">{inv.customer}</td>
                    <td className="px-5 py-3.5 text-white/60">#{inv.loadNumber}</td>
                    <td className="px-5 py-3.5 font-medium text-white/80">${inv.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.bg} ${status.color}`}>
                        <StatusIcon className="h-3 w-3" /> {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/50">{inv.issuedDate}</td>
                    <td className="px-5 py-3.5 text-white/50">{inv.dueDate}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Receipt className="mx-auto h-12 w-12 text-white/10" />
            <p className="mt-3 text-sm text-white/40">{tp.invoicing.noInvoices}</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
