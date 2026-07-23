import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, MapPin, Truck, Calendar, Weight, FileText } from 'lucide-react'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useInboxStore } from '../../store'
import { mockCustomers } from '../../data/mock'
import { createLoad, parseLoadFromText } from '../../services/workflow'
import { suggestPrice } from '../../services/pricing'
import { hasGitHubToken, completeChat } from '../../ai/githubModels'

interface NavState {
  sourceEmailId?: string
  emailFrom?: string
  draft?: {
    origin: string; originState: string; destination: string; destinationState: string
    weight: number; equipment: string; commodity: string
    suggestedPrice?: number; confidence?: number
  }
}

export function CreateLoadPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { tp, language } = useLanguage()
  const navState = (location.state || {}) as NavState
  const updateInboxItem = useInboxStore((s) => s.updateItem)
  const [aiMode, setAiMode] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [form, setForm] = useState(() => {
    if (navState.draft) {
      return {
        customer: '', origin: navState.draft.origin, destination: navState.draft.destination,
        commodity: navState.draft.commodity, weight: String(navState.draft.weight),
        equipment: navState.draft.equipment, pickupDate: '', deliveryDate: '', notes: '',
      }
    }
    return { customer: '', origin: '', destination: '', commodity: '', weight: '', equipment: 'Dry Van', pickupDate: '', deliveryDate: '', notes: '' }
  })
  const [loading, setLoading] = useState(false)

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }))

  const handleAICreate = async () => {
    if (!aiInput.trim()) return
    setLoading(true)

    let parsed = parseLoadFromText(aiInput)

    if (hasGitHubToken()) {
      try {
        const res = await completeChat([{
          role: 'user',
          content: `Extract load details from this text as strict JSON only (no prose), keys: origin, destination, weight (number, no units), equipment (one of Dry Van/Reefer/Flatbed/Step Deck/Lowboy), commodity, pickupDate (YYYY-MM-DD, today is ${new Date().toISOString().slice(0, 10)}), deliveryDate (YYYY-MM-DD). Use empty string for unknown fields. Text: "${aiInput}"`,
        }])
        if (res.content) {
          const jsonMatch = res.content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const ai = JSON.parse(jsonMatch[0])
            parsed = {
              origin: ai.origin || parsed.origin,
              destination: ai.destination || parsed.destination,
              weight: ai.weight ? String(ai.weight) : parsed.weight,
              equipment: ai.equipment || parsed.equipment,
              commodity: ai.commodity || parsed.commodity,
              pickupDate: ai.pickupDate || parsed.pickupDate,
              deliveryDate: ai.deliveryDate || parsed.deliveryDate,
            }
          }
        }
      } catch {
        // fall back silently to the heuristic parse above
      }
    }

    setForm((f) => ({
      ...f,
      origin: parsed.origin || f.origin,
      destination: parsed.destination || f.destination,
      weight: parsed.weight || f.weight,
      equipment: parsed.equipment || f.equipment,
      commodity: parsed.commodity || f.commodity,
      pickupDate: parsed.pickupDate || f.pickupDate,
      deliveryDate: parsed.deliveryDate || f.deliveryDate,
    }))
    setAiMode(false)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))

    const matchedCustomer = mockCustomers.find((c) => c.company.toLowerCase() === form.customer.toLowerCase() || c.name.toLowerCase() === form.customer.toLowerCase())
    const pricing = suggestPrice({
      origin: form.origin, destination: form.destination, equipment: form.equipment,
      customerRecommendedPrice: navState.draft?.suggestedPrice,
      customerConfidence: navState.draft?.confidence,
    })

    const load = createLoad({
      status: 'pending',
      customer: matchedCustomer?.company || form.customer || 'New Customer',
      customerId: matchedCustomer?.id || '0',
      origin: form.origin, originState: navState.draft?.originState || form.origin.split(',')[1]?.trim() || '',
      destination: form.destination, destinationState: navState.draft?.destinationState || form.destination.split(',')[1]?.trim() || '',
      commodity: form.commodity || 'General Freight',
      weight: Number(form.weight) || 0,
      equipment: form.equipment,
      pickupDate: form.pickupDate, deliveryDate: form.deliveryDate,
      buyRate: pricing.buyRate,
      sellRate: navState.draft?.suggestedPrice || pricing.sellRate,
      margin: (navState.draft?.suggestedPrice || pricing.sellRate) - pricing.buyRate,
      mileage: pricing.mileage, tracking: 0,
      notes: form.notes || undefined,
    }, { aiGenerated: !!navState.draft, sourceEmail: navState.emailFrom })

    if (navState.sourceEmailId) updateInboxItem(navState.sourceEmailId, { status: 'created' })

    setLoading(false)
    navigate(`/app/loads/${load.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <button type="button" onClick={() => navigate('/app/loads')} className="rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white/80">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{tp.createLoad.title}</h1>
          <p className="mt-1 text-sm text-white/50">{tp.createLoad.subtitle}</p>
        </div>
      </motion.div>

      {navState.draft && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3 text-sm text-orange-300">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>
            {language === 'es'
              ? `Prellenado por IA desde el email de ${navState.emailFrom}. Revisá y confirmá.`
              : `Prefilled by AI from ${navState.emailFrom}'s email. Review and confirm.`}
          </span>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <button
          type="button"
          onClick={() => setAiMode(!aiMode)}
          className={`w-full rounded-xl border p-5 text-left transition-all ${
            aiMode
              ? 'border-orange-500/30 bg-orange-500/5'
              : 'border-white/[0.06] bg-white/[0.02] hover:border-orange-500/20 hover:bg-orange-500/[0.03]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15">
              <Sparkles className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">{tp.createLoad.createWithAI}</p>
              <p className="text-xs text-white/40">{tp.createLoad.aiDescription}</p>
            </div>
          </div>
        </button>

        {aiMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">
            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder={tp.createLoad.aiPlaceholder}
              rows={3}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50"
            />
            <button
              type="button"
              onClick={handleAICreate}
              disabled={!aiInput.trim() || loading}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? tp.createLoad.processing : tp.createLoad.createWithAI}
            </button>
          </motion.div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="mb-5 font-display text-lg font-bold text-white">{tp.createLoad.loadDetails}</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-white/60">{tp.createLoad.customer}</label>
            <input type="text" value={form.customer} onChange={(e) => update('customer', e.target.value)} placeholder={tp.createLoad.customerPlaceholder} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-white/60"><MapPin className="h-3.5 w-3.5" /> {tp.createLoad.origin}</label>
              <input type="text" value={form.origin} onChange={(e) => update('origin', e.target.value)} placeholder={tp.createLoad.originPlaceholder} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-white/60"><MapPin className="h-3.5 w-3.5" /> {tp.createLoad.destination}</label>
              <input type="text" value={form.destination} onChange={(e) => update('destination', e.target.value)} placeholder={tp.createLoad.destPlaceholder} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-white/60"><Truck className="h-3.5 w-3.5" /> {tp.createLoad.equipmentLabel}</label>
              <select value={form.equipment} onChange={(e) => update('equipment', e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none focus:border-orange-500/50">
                <option value="Dry Van">{tp.createLoad.dryVan}</option>
                <option value="Reefer">{tp.createLoad.reefer}</option>
                <option value="Flatbed">{tp.createLoad.flatbed}</option>
                <option value="Step Deck">{tp.createLoad.stepDeck}</option>
                <option value="Lowboy">{tp.createLoad.lowboy}</option>
              </select>
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-white/60"><Weight className="h-3.5 w-3.5" /> {tp.createLoad.weightLabel}</label>
              <input type="number" value={form.weight} onChange={(e) => update('weight', e.target.value)} placeholder={tp.createLoad.weightPlaceholder} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-white/60"><FileText className="h-3.5 w-3.5" /> {tp.createLoad.commodityLabel}</label>
              <input type="text" value={form.commodity} onChange={(e) => update('commodity', e.target.value)} placeholder={tp.createLoad.commodityPlaceholder} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-white/60"><Calendar className="h-3.5 w-3.5" /> {tp.createLoad.pickupDate}</label>
              <input type="date" value={form.pickupDate} onChange={(e) => update('pickupDate', e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-white/60"><Calendar className="h-3.5 w-3.5" /> {tp.createLoad.deliveryDate}</label>
              <input type="date" value={form.deliveryDate} onChange={(e) => update('deliveryDate', e.target.value)} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none focus:border-orange-500/50" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/60">{tp.createLoad.notes}</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder={tp.createLoad.notesPlaceholder} rows={3} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/app/loads')} className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/60 transition-all hover:bg-white/[0.08]">
              {tp.createLoad.cancel}
            </button>
            <button type="submit" disabled={loading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50">
              {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : tp.createLoad.create}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
