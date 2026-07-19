import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, Sparkles, Bot, User, Truck, FileText, DollarSign, MapPin, ArrowRight } from 'lucide-react'
import { mockLoads, mockCarriers, type AIChatMessage } from '../../data/mock'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useToast } from '../../components/Toast'

interface AIResponse {
  content: string
  actions?: { label: string; path: string; icon?: typeof Truck }[]
}

function getAIResponse(input: string, language: string): AIResponse {
  const lower = input.toLowerCase()

  if (lower.includes('create') || lower.includes('new load') || lower.includes('nueva carga') || lower.includes('crear carga')) {
    return {
      content: language === 'es'
        ? `Detecté los siguientes detalles:

**Detalles de la Carga:**
- Origen: Dallas, TX
- Destino: Atlanta, GA
- Peso: 43,000 lbs
- Equipo: Dry Van
- Recolección: Mañana (2026-07-20)

**Precios Sugeridos:**
- Tarifa de Compra: $1,850
- Tarifa de Venta Sugerida: $2,450
- Margen Estimado: $600

¿Quieres que cree esta carga y empiece a buscar transportistas?`
        : `I detected the following details:

**Load Details:**
- Origin: Dallas, TX
- Destination: Atlanta, GA
- Weight: 43,000 lbs
- Equipment: Dry Van
- Pickup: Tomorrow (2026-07-20)

**Suggested Pricing:**
- Buy Rate: $1,850
- Suggested Sell: $2,450
- Estimated Margin: $600

Would you like me to create this load and start finding carriers?`,
      actions: [
        { label: language === 'es' ? 'Crear Carga' : 'Create Load', path: '/app/loads/new', icon: Truck },
      ],
    }
  }

  if (lower.includes('price') || lower.includes('rate') || lower.includes('charge') || lower.includes('quote') || lower.includes('cotizar') || lower.includes('precio')) {
    return {
      content: language === 'es'
        ? `Análisis de precios basado en datos actuales del mercado:

**Ruta:** Dallas, TX → Atlanta, GA (781 millas)

**Análisis de Mercado:**
- Promedio actual del mercado: $2,380
- Tu promedio histórico: $2,420
- Recargo de combustible: +$85

**Recomendación:**
- Tarifa de Venta Sugerida: $2,450
- Tarifa Objetivo de Compra: $1,850
- Margen Esperado: $600 (24.5%)

Esta ruta se ha mantenido estable esta semana. Te recomiendo reservar pronto ya que las tarifas pueden subir con la demanda del fin de semana.`
        : `Pricing analysis based on current market data:

**Route:** Dallas, TX → Atlanta, GA (781 miles)

**Market Analysis:**
- Current market average: $2,380
- Your historical average: $2,420
- Fuel surcharge: +$85

**Recommendation:**
- Suggested Sell Rate: $2,450
- Target Buy Rate: $1,850
- Expected Margin: $600 (24.5%)

This route has been steady this week. I'd recommend booking soon as rates may increase with weekend demand.`,
    }
  }

  if (lower.includes('track') || lower.includes('status') || lower.includes('active') || lower.includes('where') || lower.includes('rastreo') || lower.includes('seguimiento')) {
    const active = mockLoads.filter((l) => ['dispatched', 'in_transit'].includes(l.status))
    const list = active.map((l) => `- #${l.loadNumber}: ${l.origin} → ${l.destination} (${l.tracking}%)`).join('\n')
    return {
      content: language === 'es'
        ? `Tus cargas activas:\n\n${list}\n\n¿Quieres ver los detalles de alguna carga específica?`
        : `Your active loads:\n\n${list}\n\nWould you like to see details for a specific load?`,
      actions: active.slice(0, 2).map((l) => ({
        label: `#${l.loadNumber}`,
        path: `/app/loads/${l.id}`,
        icon: Truck,
      })),
    }
  }

  if (lower.includes('invoice') || lower.includes('bill') || lower.includes('factura')) {
    return {
      content: language === 'es'
        ? `Prepararé la factura para la carga #1587:

**Vista Previa:**
- Número: INV-2026-0090
- Cliente: ABC Logistics
- Carga: #1587 (Dallas → Atlanta)
- Monto: $2,450.00
- Vence: 30 días desde emisión

¿Qué te gustaría hacer?`
        : `I'll prepare the invoice for Load #1587:

**Invoice Preview:**
- Invoice #: INV-2026-0090
- Customer: ABC Logistics
- Load: #1587 (Dallas → Atlanta)
- Amount: $2,450.00
- Due: 30 days from issue

What would you like to do?`,
      actions: [
        { label: language === 'es' ? 'Ver Facturación' : 'View Invoicing', path: '/app/invoicing', icon: FileText },
      ],
    }
  }

  if (lower.includes('carrier') || lower.includes('transportista') || lower.includes('find carrier') || lower.includes('buscar transportista')) {
    const verified = mockCarriers.filter((c) => c.status === 'verified')
    const list = verified.slice(0, 3).map((c) => `- ${c.name} (${c.mcNumber}) — ${c.safetyRating} — ⭐ ${c.rating}`).join('\n')
    return {
      content: language === 'es'
        ? `Transportistas verificados disponibles:\n\n${list}\n\n¿Quieres ver la lista completa o verificar alguno específico?`
        : `Verified carriers available:\n\n${list}\n\nWould you like to see the full list or verify a specific one?`,
      actions: [
        { label: language === 'es' ? 'Ver Transportistas' : 'View Carriers', path: '/app/carriers', icon: Truck },
      ],
    }
  }

  if (lower.includes('customer') || lower.includes('cliente') || lower.includes('crm')) {
    return {
      content: language === 'es'
        ? `Puedo ayudarte con clientes. ¿Qué necesitas?
        - Ver la lista de clientes
        - Crear un nuevo cliente
        - Ver el historial de un cliente específico`
        : `I can help you with customers. What do you need?
        - View the customer list
        - Create a new customer
        - View a specific customer's history`,
      actions: [
        { label: language === 'es' ? 'Ver CRM' : 'View CRM', path: '/app/crm', icon: User },
      ],
    }
  }

  return {
    content: language === 'es'
      ? `Entiendo que preguntas sobre "${input}". Puedo ayudarte con:

- **Cargas** — Crear, modificar o buscar cargas
- **Transportistas** — Buscar, verificar o contactar transportistas
- **Precios** — Obtener tarifas de mercado y recomendaciones de margen
- **Rastreo** — Verificar estado de cargas activas
- **Documentos** — Generar facturas, BOLs, confirmaciones de tarifa
- **Clientes** — Gestionar relaciones con clientes

¿Qué te gustaría hacer?`
      : `I understand you're asking about "${input}". I can help you with:

- **Loads** — Create, modify, or find loads
- **Carriers** — Search, verify, or contact carriers
- **Pricing** — Get market rates and margin recommendations
- **Tracking** — Check status of active loads
- **Documents** — Generate invoices, BOLs, rate confirmations
- **Communication** — Draft emails or messages to customers

What would you like to do?`,
  }
}

export function AIAssistantPage() {
  const navigate = useNavigate()
  const { tp, language } = useLanguage()
  const { toast } = useToast()
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: language === 'es'
        ? `Buenos Días Lesly.\n\nHoy encontré:\n\n✓ 8 cargas nuevas que requieren atención\n✓ 3 transportistas esperando verificación\n✓ 2 facturas listas para enviar\n✓ 1 seguro por vencer\n\n¿Qué te gustaría hacer?`
        : `Good Morning Lesly.\n\nToday I found:\n\n✓ 8 new loads requiring attention\n✓ 3 carriers waiting for verification\n✓ 2 invoices ready to send\n✓ 1 insurance expiration alert\n\nWhat would you like to do?`,
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    { icon: Truck, label: tp.loads.newLoad, prompt: 'Create a new load from Dallas TX to Atlanta GA, 43000 lbs Dry Van, pickup tomorrow' },
    { icon: DollarSign, label: tp.loads.rate, prompt: 'What should I charge for a Dallas to Atlanta Dry Van load, 43000 lbs?' },
    { icon: MapPin, label: tp.sidebar.tracking, prompt: 'Show me the status of all active loads' },
    { icon: FileText, label: tp.dashboard.sendInvoice, prompt: 'Generate an invoice for Load #1587' },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const content = text || input
    if (!content.trim()) return

    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))

    const response = getAIResponse(content, language)
    const aiMsg: AIChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, { ...aiMsg, _actions: response.actions } as AIChatMessage & { _actions?: typeof response.actions }])
    setIsTyping(false)
  }

  const handleAction = (path: string, label: string) => {
    toast({ type: 'success', title: language === 'es' ? 'Abriendo...' : 'Opening...', description: label })
    navigate(path)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderMessage = (msg: AIChatMessage & { _actions?: { label: string; path: string; icon?: typeof Truck }[] }) => (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        msg.role === 'assistant' ? 'bg-orange-500/15' : 'bg-white/10'
      }`}>
        {msg.role === 'assistant' ? <Bot className="h-4 w-4 text-orange-400" /> : <User className="h-4 w-4 text-white/60" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        msg.role === 'assistant'
          ? 'rounded-tl-sm border border-white/[0.06] bg-white/[0.03]'
          : 'rounded-tr-sm bg-orange-500/10 border border-orange-500/20'
      }`}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">
          {msg.content.split('\n').map((line, j) => {
            if (line.startsWith('**') && line.endsWith('**'))
              return <p key={j} className="mt-2 font-semibold text-white/90">{line.replace(/\*\*/g, '')}</p>
            if (line.startsWith('- '))
              return <p key={j} className="ml-3 text-white/60">• {line.slice(2)}</p>
            if (line.startsWith('|'))
              return <p key={j} className="font-mono text-[11px] text-white/40">{line}</p>
            if (line.trim() === '') return <br key={j} />
            return <p key={j}>{line}</p>
          })}
        </div>
        {msg._actions && msg._actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {msg._actions.map((action) => {
              const Icon = action.icon || ArrowRight
              return (
                <button
                  key={action.path}
                  type="button"
                  onClick={() => handleAction(action.path, action.label)}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-2 text-xs font-medium text-orange-400 transition-all hover:bg-orange-500/20"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                  <ArrowRight className="h-3 w-3" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 border-b border-white/[0.06] px-1 py-4"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15">
          <Sparkles className="h-5 w-5 text-orange-400" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-white">{tp.sidebar.ai}</h1>
          <p className="text-xs text-white/40">
            {language === 'es' ? 'Tu copiloto inteligente para operaciones de freight' : 'Your intelligent copilot for freight operations'}
          </p>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-1 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((msg, i) => (
            <div key={msg.id}>
              {i < 2 || (i % 2 === 0) ? renderMessage(msg as AIChatMessage & { _actions?: { label: string; path: string; icon?: typeof Truck }[] }) : renderMessage(msg as AIChatMessage & { _actions?: { label: string; path: string; icon?: typeof Truck }[] })}
            </div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/15">
                <Bot className="h-4 w-4 text-orange-400" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400/50" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400/50" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400/50" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {messages.length <= 1 && (
        <div className="mx-auto max-w-3xl pb-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button key={action.label} type="button" onClick={() => handleSend(action.prompt)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center transition-all hover:border-orange-500/20 hover:bg-orange-500/5"
                >
                  <Icon className="h-5 w-5 text-orange-400/70" />
                  <span className="text-xs text-white/50">{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="border-t border-white/[0.06] px-1 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 focus-within:border-orange-500/30">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'es' ? 'Pregúntale a Rekorbia cualquier cosa...' : 'Ask Rekorbia anything...'}
              rows={1}
              className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-white/80 outline-none placeholder:text-white/25"
            />
            <button type="button" onClick={() => handleSend()} disabled={!input.trim() || isTyping}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-all hover:bg-orange-400 disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-white/20">
            {language === 'es' ? 'REKORBIA AI puede cometer errores. Siempre verifica la información importante.' : 'REKORBIA AI can make mistakes. Always verify important information.'}
          </p>
        </div>
      </div>
    </div>
  )
}
