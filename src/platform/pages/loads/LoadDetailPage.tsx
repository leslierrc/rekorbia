import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  ArrowLeft, Truck, MapPin, Calendar, Weight, DollarSign, User,
  Phone, Mail, MessageSquare, FileText, Clock, Shield, Edit3,
  Star, TrendingUp, AlertTriangle, CheckCircle2, Circle, ArrowRightCircle, Archive,
} from 'lucide-react'
import { mockCarrierAI, mockCustomerAI, mockCustomers, type Load } from '../../data/mock'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useLoadsStore, useWorkflowStore, useInvoicesStore } from '../../store'
import { useToast } from '../../components/Toast'
import { suggestPrice } from '../../services/pricing'
import { applyQuote, findBestCarrier, assignCarrier, advanceLoadStatus, generateAndSendRateConfirmation, processPodAndInvoice } from '../../services/workflow'
import { sendEmail, sendWhatsApp } from '../../services/comms'

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
    archived: 'bg-white/15 text-white/50',
  }
  return map[status] || 'bg-white/10 text-white/60'
}

const timelineSteps: Load['status'][] = ['pending', 'quoted', 'booked', 'dispatched', 'in_transit', 'delivered', 'invoiced', 'paid', 'archived']

const workflowTypeLabel = (type: string, tp: any): string => {
  const map: Record<string, string> = {
    email_received: tp.loadLifecycle.emailReceived,
    ai_created: tp.loadLifecycle.aiCreated,
    carrier_suggested: tp.loadLifecycle.carrierSuggested,
    carrier_assigned: tp.loadLifecycle.carrierAssigned,
    rate_conf_sent: tp.loadLifecycle.rateConfSent,
    rate_conf_accepted: tp.loadLifecycle.rateConfAccepted,
    pickup: tp.loadLifecycle.pickup,
    in_transit: tp.loadLifecycle.inTransit,
    delivered: tp.loadLifecycle.delivered,
    pod_received: tp.loadLifecycle.podReceived,
    invoice_generated: tp.loadLifecycle.invoiceGenerated,
    payment_received: tp.loadLifecycle.paymentReceived,
  }
  return map[type] || type
}

const recommendationColor = (rec: string) => {
  const map: Record<string, string> = {
    excellent: 'bg-green-500/15 text-green-400 border-green-500/20',
    good: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    caution: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    avoid: 'bg-red-500/15 text-red-400 border-red-500/20',
  }
  return map[rec] || 'bg-white/10 text-white/60 border-white/10'
}

export function LoadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tp, language } = useLanguage()
  const { toast } = useToast()
  const load = useLoadsStore((s) => s.loads.find((l) => l.id === id))
  const events = useWorkflowStore((s) => s.events)
  const [busy, setBusy] = useState<string | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const statusTranslationMap: Record<string, string> = {
    pending: tp.loads.pending,
    quoted: tp.loads.quoted,
    booked: tp.loads.booked,
    dispatched: tp.loads.dispatched,
    in_transit: tp.loads.in_transit,
    delivered: tp.loads.delivered,
    invoiced: tp.loads.invoiced,
    paid: tp.loads.paid,
    archived: tp.loads.archived,
  }

  if (!load) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Truck className="h-16 w-16 text-white/10" />
        <p className="mt-4 text-lg text-white/40">{tp.loads.notFound}</p>
        <button type="button" onClick={() => navigate('/app/loads')} className="mt-4 text-sm text-orange-400 hover:text-orange-300">
          {tp.loads.backToLoads}
        </button>
      </div>
    )
  }

  const currentStepIndex = timelineSteps.indexOf(load.status)
  const workflowEvents = events.filter((e) => e.loadNumber === load.loadNumber)
  const carrierAI = load.carrierId ? mockCarrierAI.find((c) => c.carrierId === load.carrierId) : null
  const customerAI = mockCustomerAI.find((c) => c.customerId === load.customerId)
  const customerRecord = mockCustomers.find((c) => c.id === load.customerId)

  const withBusy = async (key: string, fn: () => Promise<void> | void) => {
    setBusy(key)
    try {
      await fn()
    } finally {
      setBusy(null)
    }
  }

  const handleGetAIQuote = () => withBusy('quote', async () => {
    const q = suggestPrice({ origin: load.origin, destination: load.destination, equipment: load.equipment, customerRecommendedPrice: customerAI?.priceRecommendation, customerConfidence: customerAI?.priceConfidence })
    applyQuote(load, q)
    toast({ type: 'success', title: language === 'es' ? 'Cotización IA aplicada' : 'AI quote applied', description: `Sell $${q.sellRate.toLocaleString()} · Buy $${q.buyRate.toLocaleString()}` })
  })

  const handleFindCarrier = () => withBusy('carrier', async () => {
    const best = findBestCarrier(load)
    if (!best) {
      toast({ type: 'warning', title: language === 'es' ? 'Sin transportistas disponibles' : 'No carriers available', description: language === 'es' ? `Ningún transportista verificado maneja ${load.equipment}` : `No verified carrier handles ${load.equipment}` })
      return
    }
    assignCarrier(load, best.carrier)
    toast({ type: 'success', title: language === 'es' ? 'Transportista asignado' : 'Carrier assigned', description: best.carrier.name })
  })

  const handleGenerateDocuments = () => withBusy('docs', async () => {
    if (!load.carrier) {
      toast({ type: 'warning', title: language === 'es' ? 'Asigná un transportista primero' : 'Assign a carrier first', description: language === 'es' ? 'Se necesita un transportista para generar la Rate Confirmation' : 'A carrier is needed to generate the Rate Confirmation' })
      return
    }
    await generateAndSendRateConfirmation(load)
    toast({ type: 'success', title: language === 'es' ? 'Documentos generados' : 'Documents generated', description: language === 'es' ? 'Rate Confirmation descargada y enviada' : 'Rate Confirmation downloaded and sent' })
  })

  const handleSendUpdate = () => withBusy('update', async () => {
    const email = customerRecord?.email || `${load.customer.toLowerCase().replace(/\s+/g, '')}@example.com`
    await sendEmail(email, `Update — Load #${load.loadNumber}`, `${statusTranslationMap[load.status]} · ${load.origin} → ${load.destination}`)
    toast({ type: 'success', title: language === 'es' ? 'Actualización enviada' : 'Update sent', description: email })
  })

  const handleAdvance = (status: Load['status'], label: string) => withBusy(status, async () => {
    if (status === 'delivered') {
      advanceLoadStatus(load, status)
    } else if (status === 'invoiced') {
      processPodAndInvoice(load)
    } else if (status === 'paid') {
      advanceLoadStatus(load, status)
      const invoice = useInvoicesStore.getState().invoices.find((i) => i.loadId === load.id)
      if (invoice) useInvoicesStore.getState().updateInvoice(invoice.id, { status: 'paid', paidDate: new Date().toISOString().slice(0, 10) })
    } else {
      advanceLoadStatus(load, status)
    }
    toast({ type: 'success', title: label, description: `Load #${load.loadNumber}` })
  })

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button type="button" onClick={() => navigate('/app/loads')} className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white/80">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-white">Load #{load.loadNumber}</h1>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusColor(load.status)}`}>
              {statusTranslationMap[load.status] || load.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/50">{load.origin} → {load.destination}</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-orange-500/30 hover:text-orange-400">
          <Edit3 className="h-4 w-4" />
          {tp.loads.edit}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">{tp.loads.loadProgress}</h3>
        <div className="flex items-center gap-1">
          {timelineSteps.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`h-3 w-3 rounded-full ${
                  i <= currentStepIndex ? 'bg-orange-500' : 'bg-white/10'
                }`} />
                <span className={`mt-2 text-[10px] ${
                  i <= currentStepIndex ? 'text-orange-400' : 'text-white/20'
                }`}>
                  {statusTranslationMap[step] || step}
                </span>
              </div>
              {i < timelineSteps.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 ${
                  i < currentStepIndex ? 'bg-orange-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div ref={timelineRef} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-5 font-display text-lg font-bold text-white">{tp.loadLifecycle.title}</h3>
        <div className="relative ml-3">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.06]" />
          <div className="space-y-0">
            {workflowEvents.map((event) => (
              <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="relative z-10 -ml-3 flex h-6 w-6 shrink-0 items-center justify-center">
                  {event.aiGenerated ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-orange-500/50 bg-navy-950 text-xs">
                      {event.icon}
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-500/40 bg-navy-950 text-xs">
                      {event.icon}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white/80">{workflowTypeLabel(event.type, tp)}</p>
                        {event.aiGenerated && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                            <CheckCircle2 className="h-3 w-3" />
                            {tp.loadLifecycle.byAI}
                          </span>
                        )}
                        {!event.aiGenerated && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                            <Circle className="h-3 w-3" />
                            {tp.loadLifecycle.manual}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-white/40">{event.description}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-white/30">
                      {new Date(event.timestamp).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {workflowEvents.length === 0 && (
              <p className="ml-4 text-sm text-white/30">{tp.loadLifecycle.timeline}</p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-4 font-display text-lg font-bold text-white">{tp.loads.loadDetails}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem icon={Truck} label={tp.loads.equipment} value={load.equipment} />
              <DetailItem icon={Weight} label={tp.loads.weight} value={`${load.weight.toLocaleString()} lbs`} />
              <DetailItem icon={MapPin} label={tp.loads.origin} value={load.origin} />
              <DetailItem icon={MapPin} label={tp.loads.destination} value={load.destination} />
              <DetailItem icon={Calendar} label={tp.loads.pickup} value={load.pickupDate} />
              <DetailItem icon={Calendar} label={tp.loads.deliveryDate} value={load.deliveryDate} />
              <DetailItem icon={FileText} label={tp.loads.commodity} value={load.commodity} />
              <DetailItem icon={Truck} label={tp.loads.mileage} value={`${load.mileage} mi`} />
            </div>
            {load.notes && (
              <div className="mt-4 rounded-lg bg-orange-500/5 border border-orange-500/10 px-4 py-3">
                <p className="text-sm text-white/60"><span className="font-medium text-orange-400">{tp.loads.note}</span> {load.notes}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-4 font-display text-lg font-bold text-white">{tp.loads.pricing}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-green-500/5 border border-green-500/10 p-4 text-center">
                <p className="text-xs text-white/40">{tp.loads.buyRate}</p>
                <p className="mt-1 font-display text-xl font-bold text-white">${load.buyRate.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-orange-500/5 border border-orange-500/10 p-4 text-center">
                <p className="text-xs text-white/40">{tp.loads.sellRate}</p>
                <p className="mt-1 font-display text-xl font-bold text-white">${load.sellRate.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-purple-500/5 border border-purple-500/10 p-4 text-center">
                <p className="text-xs text-white/40">{tp.loads.margin}</p>
                <p className="mt-1 font-display text-xl font-bold text-orange-400">${load.margin}</p>
              </div>
            </div>
          </div>

          {load.tracking > 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="mb-4 font-display text-lg font-bold text-white">{tp.loads.tracking}</h3>
              <div className="relative h-3 overflow-hidden rounded-full bg-white/5">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all" style={{ width: `${load.tracking}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-white/50">{load.tracking}% {tp.loads.complete}</span>
                <span className="text-white/50">{tp.loads.eta} {load.deliveryDate}</span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-4 font-display text-lg font-bold text-white">{tp.loads.customerSection}</h3>
            <div className="space-y-3">
              <p className="text-sm font-medium text-white/80">{load.customer}</p>
              <ActionRow icon={Mail} label={tp.loads.sendEmail} disabled={busy === 'update'} onClick={handleSendUpdate} />
              <ActionRow icon={Phone} label={tp.loads.call} onClick={() => toast({ type: 'info', title: language === 'es' ? 'Llamando…' : 'Calling…', description: customerRecord?.phone || load.customer })} />
              <ActionRow icon={MessageSquare} label={tp.loads.message} disabled={busy === 'whatsapp'} onClick={() => withBusy('whatsapp', async () => {
                const phone = customerRecord?.phone || 'unknown'
                await sendWhatsApp(phone, `Load #${load.loadNumber}: ${statusTranslationMap[load.status]} — ${load.origin} → ${load.destination}`)
                toast({ type: 'success', title: language === 'es' ? 'WhatsApp enviado' : 'WhatsApp sent', description: phone })
              })} />
            </div>
          </div>

          {customerAI && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="mb-4 font-display text-sm font-bold text-white/60 uppercase tracking-wider">{tp.customerAI.aiInsight}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{tp.customerAI.relationship}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < customerAI.relationshipScore ? 'fill-orange-400 text-orange-400' : 'text-white/10'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{tp.customerAI.avgMargin}</span>
                  <span className="text-sm font-medium text-white/70">${customerAI.avgMargin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{tp.customerAI.avgPayment}</span>
                  <span className="text-sm font-medium text-white/70">{customerAI.avgPaymentDays} {tp.customerAI.days}</span>
                </div>
                <div className="mt-2 rounded-lg bg-blue-500/5 border border-blue-500/10 px-3 py-2">
                  <p className="text-xs text-white/50">{customerAI.aiNote}</p>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-lg bg-orange-500/5 border border-orange-500/10 px-3 py-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">{tp.customerAI.recommendedPrice}</p>
                    <p className="font-display text-lg font-bold text-orange-400">${customerAI.priceRecommendation.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-white/30">{tp.customerAI.confidence}</p>
                    <p className="text-sm font-medium text-white/60">{Math.round(customerAI.priceConfidence * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {load.carrier && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="mb-4 font-display text-lg font-bold text-white">{tp.loads.carrierSection}</h3>
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/80">{load.carrier}</p>
                {load.driver && (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <User className="h-4 w-4" />
                    {load.driver}
                  </div>
                )}
                <ActionRow icon={Shield} label={tp.loads.verifyCarrier} onClick={() => navigate('/app/carriers')} />
                <ActionRow icon={FileText} label={tp.loads.rateConfirmation} disabled={busy === 'docs'} onClick={handleGenerateDocuments} />
              </div>
            </div>
          )}

          {carrierAI && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="mb-4 font-display text-sm font-bold text-white/60 uppercase tracking-wider">Carrier AI</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/40">{tp.carrierAI.acceptanceRate}</span>
                    <span className="text-sm font-medium text-white/70">{carrierAI.acceptanceRate}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${carrierAI.acceptanceRate}%` }} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{tp.carrierAI.onTimeRate}</span>
                  <span className="text-sm font-medium text-white/70">{carrierAI.onTimeRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{tp.carrierAI.avgNegotiation}</span>
                  <span className="text-sm font-medium text-white/70">${Math.abs(carrierAI.avgNegotiation)}</span>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${recommendationColor(carrierAI.aiRecommendation)}`}>
                    {carrierAI.aiRecommendation === 'excellent' && <TrendingUp className="h-3 w-3" />}
                    {carrierAI.aiRecommendation === 'caution' && <AlertTriangle className="h-3 w-3" />}
                    {carrierAI.aiRecommendation === 'avoid' && <AlertTriangle className="h-3 w-3" />}
                    {tp.carrierAI[carrierAI.aiRecommendation]}
                  </span>
                </div>
                <div className="rounded-lg bg-blue-500/5 border border-blue-500/10 px-3 py-2">
                  <p className="text-xs text-white/50">{carrierAI.aiNote}</p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-4 font-display text-lg font-bold text-white">{tp.loads.actions}</h3>
            <div className="space-y-2">
              {load.status === 'pending' && (
                <button type="button" disabled={busy === 'quote'} onClick={handleGetAIQuote} className="flex w-full items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2.5 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/20 disabled:opacity-50">
                  <DollarSign className="h-4 w-4" /> {busy === 'quote' ? tp.createLoad.processing : tp.loads.getAIQuote}
                </button>
              )}
              {['pending', 'quoted'].includes(load.status) && (
                <button type="button" disabled={busy === 'carrier'} onClick={handleFindCarrier} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] disabled:opacity-50">
                  <Truck className="h-4 w-4" /> {busy === 'carrier' ? tp.createLoad.processing : tp.loads.findCarrier}
                </button>
              )}
              {load.status === 'booked' && (
                <button type="button" disabled={busy === 'dispatched'} onClick={() => handleAdvance('dispatched', language === 'es' ? 'Carga despachada' : 'Load dispatched')} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] disabled:opacity-50">
                  <ArrowRightCircle className="h-4 w-4" /> {language === 'es' ? 'Marcar Despachada' : 'Mark Dispatched'}
                </button>
              )}
              {load.status === 'dispatched' && (
                <button type="button" disabled={busy === 'in_transit'} onClick={() => handleAdvance('in_transit', language === 'es' ? 'Carga recogida' : 'Load picked up')} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] disabled:opacity-50">
                  <ArrowRightCircle className="h-4 w-4" /> {language === 'es' ? 'Marcar Recogida' : 'Mark Picked Up'}
                </button>
              )}
              {load.status === 'in_transit' && (
                <button type="button" disabled={busy === 'delivered'} onClick={() => handleAdvance('delivered', language === 'es' ? 'Carga entregada' : 'Load delivered')} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] disabled:opacity-50">
                  <ArrowRightCircle className="h-4 w-4" /> {language === 'es' ? 'Marcar Entregada' : 'Mark Delivered'}
                </button>
              )}
              {load.status === 'delivered' && (
                <button type="button" disabled={busy === 'invoiced'} onClick={() => handleAdvance('invoiced', language === 'es' ? 'Factura generada' : 'Invoice generated')} className="flex w-full items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2.5 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/20 disabled:opacity-50">
                  <FileText className="h-4 w-4" /> {busy === 'invoiced' ? tp.createLoad.processing : (language === 'es' ? 'Procesar POD y Facturar' : 'Process POD & Invoice')}
                </button>
              )}
              {load.status === 'invoiced' && (
                <button type="button" disabled={busy === 'paid'} onClick={() => handleAdvance('paid', language === 'es' ? 'Pago recibido' : 'Payment received')} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] disabled:opacity-50">
                  <DollarSign className="h-4 w-4" /> {language === 'es' ? 'Marcar Pagada' : 'Mark Paid'}
                </button>
              )}
              {load.status === 'paid' && (
                <button type="button" disabled={busy === 'archived'} onClick={() => handleAdvance('archived', language === 'es' ? 'Carga archivada' : 'Load archived')} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] disabled:opacity-50">
                  <Archive className="h-4 w-4" /> {language === 'es' ? 'Archivar Carga' : 'Archive Load'}
                </button>
              )}
              <button type="button" disabled={busy === 'docs'} onClick={handleGenerateDocuments} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] disabled:opacity-50">
                <FileText className="h-4 w-4" /> {busy === 'docs' ? tp.createLoad.processing : tp.loads.generateDocuments}
              </button>
              <button type="button" disabled={busy === 'update'} onClick={handleSendUpdate} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08] disabled:opacity-50">
                <MessageSquare className="h-4 w-4" /> {busy === 'update' ? tp.createLoad.processing : tp.loads.sendUpdate}
              </button>
              <button type="button" onClick={() => timelineRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08]">
                <Clock className="h-4 w-4" /> {tp.loads.activityLog}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value }: { icon: typeof Truck; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-white/20" />
      <div>
        <p className="text-[11px] text-white/30">{label}</p>
        <p className="text-sm text-white/70">{value}</p>
      </div>
    </div>
  )
}

function ActionRow({ icon: Icon, label, onClick, disabled }: { icon: typeof Truck; label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/70 disabled:opacity-50">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
