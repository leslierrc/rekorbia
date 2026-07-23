import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useToast } from '../../components/Toast'
import { useInboxStore } from '../../store'
import { createLoad, guessCustomerFromEmail } from '../../services/workflow'
import { suggestPrice } from '../../services/pricing'
import { Sparkles, Mail, ArrowRight, Bot, Check, X, Eye, ChevronRight, Zap } from 'lucide-react'

type FilterTab = 'all' | 'ready' | 'created' | 'ignored' | 'detected'

const workflowSteps = [
  { key: 'step1', icon: Mail },
  { key: 'step2', icon: Bot },
  { key: 'step3', icon: Check },
  { key: 'step4', icon: Zap },
  { key: 'step5', icon: ChevronRight },
]

export function AIInboxPage() {
  const navigate = useNavigate()
  const { tp, language } = useLanguage()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const items = useInboxStore((s) => s.items)
  const updateItem = useInboxStore((s) => s.updateItem)

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: tp.aiInbox.allEmails, count: items.length },
    { key: 'ready', label: tp.aiInbox.readyToProcess, count: items.filter((i) => i.status === 'ready').length },
    { key: 'detected', label: tp.aiInbox.detected, count: items.filter((i) => i.status === 'detected').length },
    { key: 'created', label: tp.aiInbox.created, count: items.filter((i) => i.status === 'created').length },
    { key: 'ignored', label: tp.aiInbox.ignored, count: items.filter((i) => i.status === 'ignored').length },
  ]

  const filtered = activeTab === 'all' ? items : items.filter((i) => i.status === activeTab)

  const readyCount = items.filter((i) => i.status === 'ready' || i.status === 'detected').length

  const handleCreateLoad = (id: string) => {
    const item = items.find((i) => i.id === id)
    if (!item || !item.detectedLoad) return
    // Broker reviews AI-extracted fields before confirming — navigate to the
    // create-load form prefilled, don't create the load yet.
    navigate('/app/loads/new', {
      state: {
        sourceEmailId: item.id,
        emailFrom: item.emailFrom,
        draft: item.detectedLoad,
      },
    })
  }

  const handleIgnore = (id: string) => {
    updateItem(id, { status: 'ignored' })
    toast({ type: 'info', title: language === 'es' ? 'Email ignorado' : 'Email ignored', description: language === 'es' ? 'El email fue marcado como ignorado' : 'Email marked as ignored' })
  }

  const handleProcessAll = () => {
    const toProcess = items.filter((i) => (i.status === 'ready' || i.status === 'detected') && i.detectedLoad)
    toProcess.forEach((item) => {
      const dl = item.detectedLoad!
      const customer = guessCustomerFromEmail(item.emailFrom)
      const pricing = suggestPrice({
        origin: dl.origin, destination: dl.destination, equipment: dl.equipment,
        customerRecommendedPrice: dl.suggestedPrice, customerConfidence: dl.confidence,
      })
      createLoad({
        status: 'pending',
        customer: customer?.company || item.emailFrom.split('@')[1] || 'Unknown',
        customerId: customer?.id || '0',
        origin: dl.origin, originState: dl.originState,
        destination: dl.destination, destinationState: dl.destinationState,
        commodity: dl.commodity, weight: dl.weight, equipment: dl.equipment,
        pickupDate: '', deliveryDate: '',
        buyRate: pricing.buyRate, sellRate: dl.suggestedPrice || pricing.sellRate,
        margin: (dl.suggestedPrice || pricing.sellRate) - pricing.buyRate,
        mileage: pricing.mileage, tracking: 0,
      }, { aiGenerated: true, sourceEmail: item.emailFrom })
      updateItem(item.id, { status: 'created' })
    })
    toast({ type: 'success', title: language === 'es' ? 'Procesamiento completo' : 'Processing complete', description: language === 'es' ? `${toProcess.length} emails procesados` : `${toProcess.length} emails processed` })
  }

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 60) return `${diffMin}m`
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h`
    return `${Math.floor(diffHr / 24)}d`
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col pb-24">
      <div className="px-1 py-6">
        <div className="flex items-center gap-3 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15">
            <Sparkles className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">{tp.aiInbox.title}</h1>
            <p className="text-xs text-white/40">{tp.aiInbox.subtitle}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          {workflowSteps.map((step, i) => {
            const StepIcon = step.icon
            const isActive = i === 2
            return (
              <div key={step.key} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${
                    isActive
                      ? 'border-orange-500/40 bg-orange-500/15 text-orange-400'
                      : 'border-white/[0.08] bg-white/[0.03] text-white/30'
                  }`}>
                    <StepIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className={`hidden whitespace-nowrap text-[11px] sm:inline ${
                    isActive ? 'text-orange-400' : 'text-white/30'
                  }`}>
                    {tp.aiInbox[step.key as keyof typeof tp.aiInbox]}
                  </span>
                </div>
                {i < workflowSteps.length - 1 && (
                  <div className="mx-2 hidden h-px w-4 bg-white/[0.08] sm:block" />
                )}
              </div>
            )
          })}
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? 'border border-orange-500/20 bg-orange-500/10 text-orange-400'
                  : 'border border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60'
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                activeTab === tab.key ? 'bg-orange-500/20 text-orange-300' : 'bg-white/[0.06] text-white/30'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16">
            <Mail className="mb-3 h-10 w-10 text-white/10" />
            <p className="text-sm text-white/30">{tp.aiInbox.noEmails}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div key={item.id} className={`rounded-2xl border bg-white/[0.02] p-4 transition-all hover:border-white/[0.1] ${
                item.status === 'created' ? 'border-green-500/20' : item.status === 'ignored' ? 'border-white/[0.04] opacity-60' : 'border-white/[0.06]'
              }`}>
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                      <Mail className="h-4 w-4 text-white/40" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">{item.emailFrom}</p>
                      <p className="text-[11px] text-white/30">{formatTimestamp(item.emailDate)}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    item.status === 'ready' ? 'bg-orange-500/15 text-orange-400' :
                    item.status === 'detected' ? 'bg-blue-500/15 text-blue-400' :
                    item.status === 'created' ? 'bg-green-500/15 text-green-400' :
                    item.status === 'ignored' ? 'bg-white/[0.06] text-white/30' :
                    'bg-yellow-500/15 text-yellow-400'
                  }`}>
                    {item.status === 'ready' ? tp.aiInbox.readyToProcess :
                     item.status === 'detected' ? tp.aiInbox.detected :
                     item.status === 'created' ? tp.aiInbox.created :
                     item.status === 'ignored' ? tp.aiInbox.ignored : item.status}
                  </span>
                </div>

                <p className="mb-2 text-sm font-semibold text-white/70">{item.emailSubject}</p>
                <p className="mb-3 text-xs leading-relaxed text-white/40">{item.emailPreview}</p>

                {item.detectedLoad && (
                  <div className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-orange-400/70">
                      <Bot className="h-3 w-3" />
                      {tp.aiInbox.detectedLoad}
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-xs">
                      <span className="text-white/60">{item.detectedLoad.origin}</span>
                      <ArrowRight className="h-3 w-3 text-orange-400/50" />
                      <span className="text-white/60">{item.detectedLoad.destination}</span>
                    </div>

                    <div className="mb-3 grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <p className="text-white/30">{language === 'es' ? 'Peso' : 'Weight'}</p>
                        <p className="font-medium text-white/60">{item.detectedLoad.weight.toLocaleString()} lbs</p>
                      </div>
                      <div>
                        <p className="text-white/30">{tp.loads.equipment}</p>
                        <p className="font-medium text-white/60">{item.detectedLoad.equipment}</p>
                      </div>
                      <div>
                        <p className="text-white/30">{tp.loads.commodity}</p>
                        <p className="font-medium text-white/60">{item.detectedLoad.commodity}</p>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-white/30">{tp.aiInbox.suggestedPrice}</p>
                        <p className="text-xl font-bold text-orange-400">${item.detectedLoad.suggestedPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/30">{tp.aiInbox.confidence}</p>
                        <p className="text-sm font-semibold text-white/60">{Math.round(item.detectedLoad.confidence * 100)}%</p>
                      </div>
                    </div>

                    {item.carrierCandidates > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-white/30">
                        <span className="font-medium text-white/50">{item.carrierCandidates}</span>
                        <span>{tp.aiInbox.carrierCandidates}</span>
                      </div>
                    )}
                  </div>
                )}

                {!item.detectedLoad && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.01] px-3 py-2 text-xs text-white/20">
                    <X className="h-3 w-3" />
                    {language === 'es' ? 'No se detectó carga en este email' : 'No load detected in this email'}
                  </div>
                )}

                {item.status === 'created' && (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                    <Check className="h-4 w-4" />
                    {language === 'es' ? 'Carga creada' : 'Load created'}
                  </div>
                )}

                {item.status === 'ignored' && (
                  <div className="flex items-center gap-2 text-sm text-white/30">
                    <X className="h-4 w-4" />
                    {language === 'es' ? 'Ignorado' : 'Ignored'}
                  </div>
                )}

                {item.status !== 'created' && item.status !== 'ignored' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCreateLoad(item.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-orange-400"
                    >
                      <Zap className="h-3 w-3" />
                      {tp.aiInbox.createLoad}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIgnore(item.id)}
                      className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-white/40 transition-all hover:border-white/[0.15] hover:text-white/60"
                    >
                      {tp.aiInbox.ignore}
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-white/40 transition-all hover:border-white/[0.15] hover:text-white/60"
                    >
                      <Eye className="h-3 w-3" />
                      {tp.aiInbox.viewEmail}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {readyCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-navy-950/90 px-4 py-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/15">
                <Sparkles className="h-3 w-3 text-orange-400" />
              </div>
              <span className="text-sm text-white/60">
                {language === 'es'
                  ? `${readyCount} emails listos para procesar`
                  : `${readyCount} emails ready to process`}
              </span>
            </div>
            <button
              type="button"
              onClick={handleProcessAll}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-400"
            >
              <Zap className="h-4 w-4" />
              {tp.aiInbox.processAll}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
