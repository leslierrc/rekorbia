import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Truck, MapPin, Calendar, Weight, DollarSign, User,
  Phone, Mail, MessageSquare, FileText, Clock, Shield, Edit3,
} from 'lucide-react'
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

const timelineSteps = ['pending', 'quoted', 'booked', 'dispatched', 'in_transit', 'delivered', 'invoiced', 'paid']

export function LoadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tp } = useLanguage()
  const load = mockLoads.find((l) => l.id === id)

  const statusTranslationMap: Record<string, string> = {
    pending: tp.loads.pending,
    quoted: tp.loads.quoted,
    booked: tp.loads.booked,
    dispatched: tp.loads.dispatched,
    in_transit: tp.loads.in_transit,
    delivered: tp.loads.delivered,
    invoiced: tp.loads.invoiced,
    paid: tp.loads.paid,
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
              <ActionRow icon={Mail} label={tp.loads.sendEmail} />
              <ActionRow icon={Phone} label={tp.loads.call} />
              <ActionRow icon={MessageSquare} label={tp.loads.message} />
            </div>
          </div>

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
                <ActionRow icon={Shield} label={tp.loads.verifyCarrier} />
                <ActionRow icon={FileText} label={tp.loads.rateConfirmation} />
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h3 className="mb-4 font-display text-lg font-bold text-white">{tp.loads.actions}</h3>
            <div className="space-y-2">
              {load.status === 'pending' && (
                <button type="button" className="flex w-full items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-2.5 text-sm font-medium text-orange-400 transition-colors hover:bg-orange-500/20">
                  <DollarSign className="h-4 w-4" /> {tp.loads.getAIQuote}
                </button>
              )}
              {['pending', 'quoted'].includes(load.status) && (
                <button type="button" className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08]">
                  <Truck className="h-4 w-4" /> {tp.loads.findCarrier}
                </button>
              )}
              <button type="button" className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08]">
                <FileText className="h-4 w-4" /> {tp.loads.generateDocuments}
              </button>
              <button type="button" className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08]">
                <MessageSquare className="h-4 w-4" /> {tp.loads.sendUpdate}
              </button>
              <button type="button" className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.08]">
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

function ActionRow({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <button type="button" className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/70">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
