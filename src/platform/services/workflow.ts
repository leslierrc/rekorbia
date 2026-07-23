import type { Load, Carrier, WorkflowEvent } from '../data/mock'
import { mockCarriers, mockCustomers, mockCarrierAI } from '../data/mock'
import { useLoadsStore, useWorkflowStore, useNotificationsStore, useInvoicesStore, useDocumentsStore } from '../store'
import { generateRateConfirmation, generateInvoice, downloadPDF } from './documents'
import { sendEmail } from './comms'

// ── Flujo 3: free-text → structured load (heuristic "AI" extraction) ──
// No backend LLM available in this build, so this is a deterministic
// parser covering the common patterns brokers actually type. If a GitHub
// Models token is configured, callers can prefer a real LLM call and fall
// back to this.

const EQUIPMENT_KEYWORDS: [RegExp, string][] = [
  [/dry\s?van/i, 'Dry Van'],
  [/reefer|refrigerated/i, 'Reefer'],
  [/step\s?deck/i, 'Step Deck'],
  [/flat\s?bed/i, 'Flatbed'],
  [/low\s?boy/i, 'Lowboy'],
]

const COMMODITY_KEYWORDS = [
  'food products', 'electronics', 'industrial parts', 'chemicals', 'produce',
  'auto parts', 'construction materials', 'retail goods', 'machinery', 'furniture',
]

export interface ParsedLoad {
  origin: string
  destination: string
  weight: string
  equipment: string
  commodity: string
  pickupDate: string
  deliveryDate: string
}

function nextWeekday(base: Date, targetDay: number): Date {
  const d = new Date(base)
  const diff = (targetDay - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + diff)
  return d
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function parseLoadFromText(text: string, referenceDate = new Date()): ParsedLoad {
  const lower = text.toLowerCase()

  let equipment = 'Dry Van'
  for (const [re, label] of EQUIPMENT_KEYWORDS) {
    if (re.test(text)) { equipment = label; break }
  }

  let origin = ''
  let destination = ''
  const laneMatch = text.match(/([A-Za-z][A-Za-z .]+?,?\s*[A-Z]{2})\s*(?:to|→|->)\s*([A-Za-z][A-Za-z .]+?,?\s*[A-Z]{2})\b/)
  if (laneMatch) {
    origin = laneMatch[1].trim().replace(/\s+/g, ' ')
    destination = laneMatch[2].trim().replace(/\s+/g, ' ')
  } else {
    const looseMatch = text.match(/([A-Za-z][A-Za-z ]+?)\s+(?:to|→|->)\s+([A-Za-z][A-Za-z ]+?)(?:[,.]|\s+\d|\s+tomorrow|\s+today|$)/i)
    if (looseMatch) {
      origin = looseMatch[1].trim()
      destination = looseMatch[2].trim()
    }
  }

  const weightMatch = text.match(/(\d{2,6})\s*(?:lbs?|pounds)\b/i) || text.match(/\b(\d{4,6})\b/)
  const weight = weightMatch ? weightMatch[1] : ''

  const commodity = COMMODITY_KEYWORDS.find((c) => lower.includes(c)) || ''

  let pickupDate = ''
  let deliveryDate = ''
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  if (/\btomorrow\b/i.test(lower)) {
    const d = new Date(referenceDate)
    d.setDate(d.getDate() + 1)
    pickupDate = toISODate(d)
  } else if (/\btoday\b/i.test(lower)) {
    pickupDate = toISODate(referenceDate)
  } else {
    const dayIdx = dayNames.findIndex((d) => lower.includes(d))
    if (dayIdx >= 0) pickupDate = toISODate(nextWeekday(referenceDate, dayIdx))
  }
  if (pickupDate) {
    const d = new Date(pickupDate)
    d.setDate(d.getDate() + 2)
    deliveryDate = toISODate(d)
  }

  return {
    origin: origin ? titleCase(origin) : '',
    destination: destination ? titleCase(destination) : '',
    weight,
    equipment,
    commodity: commodity ? titleCase(commodity) : '',
    pickupDate,
    deliveryDate,
  }
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).replace(/\bTx\b|\bGa\b|\bCa\b|\bIl\b|\bFl\b|\bAz\b|\bWa\b|\bLa\b|\bTn\b|\bNc\b|\bCo\b/g, (m) => m.toUpperCase())
}

// Guess an existing customer from an inbound email address's domain.
export function guessCustomerFromEmail(emailFrom: string) {
  const domain = emailFrom.split('@')[1]?.toLowerCase()
  if (!domain) return undefined
  return mockCustomers.find((c) => c.email.toLowerCase().endsWith(`@${domain}`))
}

// ── Flujo 1/2/3: create a load and fan out the side effects ──
export function createLoad(
  draft: Omit<Load, 'id' | 'loadNumber' | 'createdAt'>,
  opts: { aiGenerated?: boolean; sourceEmail?: string } = {}
): Load {
  const load = useLoadsStore.getState().addLoad(draft)

  useWorkflowStore.getState().addEvent({
    loadId: load.id,
    loadNumber: load.loadNumber,
    type: opts.aiGenerated ? 'ai_created' : 'email_received',
    title: opts.aiGenerated ? 'AI created load' : 'Load created',
    description: opts.sourceEmail
      ? `Extracted from email (${opts.sourceEmail}): ${load.weight.toLocaleString()} lbs, ${load.commodity}, ${load.equipment}`
      : `${load.origin} → ${load.destination} · ${load.equipment} · ${load.weight.toLocaleString()} lbs`,
    icon: opts.aiGenerated ? '🤖' : '📝',
    aiGenerated: !!opts.aiGenerated,
  })

  useNotificationsStore.getState().addNotification({
    type: 'success',
    title: `Load #${load.loadNumber} created`,
    description: `${load.customer} · ${load.origin} → ${load.destination}`,
  })

  return load
}

// ── Flujo 5: pick the best-scored available carrier for the load's equipment ──
export function findBestCarrier(load: Load): { carrier: Carrier; score: number } | null {
  const candidates = mockCarriers.filter(
    (c) => c.status === 'verified' && c.equipment.includes(load.equipment)
  )
  if (candidates.length === 0) return null

  const scored = candidates.map((c) => {
    const ai = mockCarrierAI.find((a) => a.carrierId === c.id)
    const score = (ai?.acceptanceRate ?? c.rating * 20) + (ai?.onTimeRate ?? 0) - (ai?.lastIncidents ?? 0) * 5
    return { carrier: c, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored[0]
}

// ── Flujo 4/5: assign a carrier to a load ──
export function assignCarrier(load: Load, carrier: Carrier) {
  useLoadsStore.getState().updateLoad(load.id, {
    carrier: carrier.name,
    carrierId: carrier.id,
    status: load.status === 'pending' || load.status === 'quoted' ? 'booked' : load.status,
  })
  useWorkflowStore.getState().addEvent({
    loadId: load.id,
    loadNumber: load.loadNumber,
    type: 'carrier_assigned',
    title: 'Carrier assigned',
    description: `${carrier.name} assigned — $${load.buyRate.toLocaleString()} buy rate`,
    icon: '✅',
    aiGenerated: true,
  })
  useNotificationsStore.getState().addNotification({
    type: 'success',
    title: `Carrier assigned to Load #${load.loadNumber}`,
    description: `${carrier.name} will haul this load`,
  })
}

const STATUS_EVENT: Record<Load['status'], { type: WorkflowEvent['type']; title: string; icon: string }> = {
  pending: { type: 'email_received', title: 'Load pending', icon: '📝' },
  quoted: { type: 'ai_created', title: 'Rate quoted', icon: '💲' },
  booked: { type: 'carrier_assigned', title: 'Load booked', icon: '✅' },
  dispatched: { type: 'carrier_assigned', title: 'Load dispatched', icon: '🚚' },
  in_transit: { type: 'in_transit', title: 'In transit', icon: '🗺️' },
  delivered: { type: 'delivered', title: 'Load delivered', icon: '📦' },
  invoiced: { type: 'invoice_generated', title: 'Invoice generated', icon: '🧾' },
  paid: { type: 'payment_received', title: 'Payment received', icon: '💰' },
  archived: { type: 'payment_received', title: 'Load archived', icon: '🗄️' },
}

// ── Flujo 4: advance a load through its lifecycle, always leaving an event + notification ──
export function advanceLoadStatus(load: Load, status: Load['status'], description?: string) {
  let tracking = load.tracking
  if (status === 'delivered') tracking = 100
  else if (status === 'in_transit' && tracking === 0) tracking = 10

  useLoadsStore.getState().updateLoad(load.id, { status, tracking })
  const meta = STATUS_EVENT[status]
  useWorkflowStore.getState().addEvent({
    loadId: load.id,
    loadNumber: load.loadNumber,
    type: meta.type,
    title: meta.title,
    description: description || `Load #${load.loadNumber} is now ${status.replace('_', ' ')}`,
    icon: meta.icon,
    aiGenerated: false,
  })
  useNotificationsStore.getState().addNotification({
    type: 'info',
    title: `Load #${load.loadNumber} — ${meta.title}`,
    description: description || `${load.origin} → ${load.destination}`,
  })
}

// ── Flujo 6: AI price quote, applied straight to the load ──
export function applyQuote(load: Load, quote: { buyRate: number; sellRate: number; margin: number }) {
  useLoadsStore.getState().updateLoad(load.id, {
    buyRate: quote.buyRate,
    sellRate: quote.sellRate,
    margin: quote.margin,
    status: load.status === 'pending' ? 'quoted' : load.status,
  })
  useWorkflowStore.getState().addEvent({
    loadId: load.id,
    loadNumber: load.loadNumber,
    type: 'ai_created',
    title: 'AI quote applied',
    description: `Sell $${quote.sellRate.toLocaleString()} / Buy $${quote.buyRate.toLocaleString()} / Margin $${quote.margin}`,
    icon: '💲',
    aiGenerated: true,
  })
}

// ── Flujo 7: generate + "send" a Rate Confirmation PDF ──
export async function generateAndSendRateConfirmation(load: Load) {
  const carrier = mockCarriers.find((c) => c.id === load.carrierId)
  const doc = generateRateConfirmation({
    confirmationNumber: `RC-${load.loadNumber}`,
    date: new Date().toISOString().slice(0, 10),
    carrier: {
      name: load.carrier || 'TBD',
      dot: carrier?.dotNumber || 'N/A',
      mc: carrier?.mcNumber || 'N/A',
      phone: carrier?.phone || 'N/A',
    },
    shipper: { name: load.customer, address: '', city: load.origin.split(',')[0], state: load.originState, zip: '', contact: load.customer, phone: '' },
    consignee: { name: load.customer, address: '', city: load.destination.split(',')[0], state: load.destinationState, zip: '', contact: load.customer, phone: '' },
    loadId: `#${load.loadNumber}`,
    equipment: load.equipment,
    weight: `${load.weight.toLocaleString()} lbs`,
    CommodityDescription: load.commodity,
    rate: load.buyRate,
    totalRate: load.buyRate,
    pickupDate: load.pickupDate,
    deliveryDate: load.deliveryDate,
  })
  const filename = `RC-${load.loadNumber}-${(load.carrier || 'carrier').replace(/\s+/g, '')}.pdf`
  downloadPDF(doc, filename)

  useDocumentsStore.getState().addDoc({
    name: filename,
    type: 'rate_confirmation',
    loadNumber: load.loadNumber,
    status: 'ready',
    size: '—',
    extractedData: `Load #${load.loadNumber} · $${load.buyRate.toLocaleString()} · ${load.origin} → ${load.destination}`,
  })

  if (carrier?.email) await sendEmail(carrier.email, `Rate Confirmation — Load #${load.loadNumber}`, `${load.origin} → ${load.destination}, $${load.buyRate.toLocaleString()}`)

  useWorkflowStore.getState().addEvent({
    loadId: load.id,
    loadNumber: load.loadNumber,
    type: 'rate_conf_sent',
    title: 'Rate Confirmation sent',
    description: `RC sent to ${load.carrier || 'carrier'} — $${load.buyRate.toLocaleString()} buy rate`,
    icon: '📄',
    aiGenerated: true,
  })
}

// ── Flujo 7/13: POD received → OCR (mock) → Invoice generated ──
export function processPodAndInvoice(load: Load) {
  useDocumentsStore.getState().addDoc({
    name: `POD-${load.loadNumber}-${load.customer.replace(/\s+/g, '')}.pdf`,
    type: 'pod',
    loadNumber: load.loadNumber,
    status: 'signed',
    size: '1.1 MB',
    extractedData: `Load #${load.loadNumber} · $${load.sellRate.toLocaleString()} · ${load.origin} → ${load.destination}`,
  })
  useWorkflowStore.getState().addEvent({
    loadId: load.id,
    loadNumber: load.loadNumber,
    type: 'pod_received',
    title: 'POD received',
    description: 'AI OCR extracted signed delivery confirmation',
    icon: '📷',
    aiGenerated: true,
  })

  return generateInvoiceForLoad(load)
}

export function generateInvoiceForLoad(load: Load) {
  const issued = new Date()
  const due = new Date(issued)
  due.setDate(due.getDate() + 30)

  const invoice = useInvoicesStore.getState().addInvoice({
    loadId: load.id,
    loadNumber: load.loadNumber,
    customer: load.customer,
    customerId: load.customerId,
    amount: load.sellRate,
    status: 'pending',
    issuedDate: issued.toISOString().slice(0, 10),
    dueDate: due.toISOString().slice(0, 10),
  })

  const customer = mockCustomers.find((c) => c.id === load.customerId)
  const doc = generateInvoice({
    invoiceNumber: invoice.invoiceNumber,
    date: invoice.issuedDate,
    dueDate: invoice.dueDate,
    from: { name: 'REKORBIA', address: '', city: '', state: '', zip: '' },
    to: { name: customer?.company || load.customer, address: '', city: load.destination.split(',')[0], state: load.destinationState, zip: '' },
    loadId: `#${load.loadNumber}`,
    description: `${load.commodity} — ${load.origin} → ${load.destination}`,
    rate: load.sellRate,
  })
  downloadPDF(doc, `${invoice.invoiceNumber}.pdf`)

  useDocumentsStore.getState().addDoc({
    name: `${invoice.invoiceNumber}.pdf`,
    type: 'invoice',
    loadNumber: load.loadNumber,
    status: 'ready',
    size: '—',
    extractedData: `Invoice ${invoice.invoiceNumber} · $${invoice.amount.toLocaleString()} · Due ${invoice.dueDate}`,
  })

  useLoadsStore.getState().updateLoad(load.id, { status: load.status === 'delivered' ? 'invoiced' : load.status })

  useWorkflowStore.getState().addEvent({
    loadId: load.id,
    loadNumber: load.loadNumber,
    type: 'invoice_generated',
    title: 'Invoice generated',
    description: `${invoice.invoiceNumber} — $${invoice.amount.toLocaleString()}, due ${invoice.dueDate}`,
    icon: '🧾',
    aiGenerated: true,
  })
  useNotificationsStore.getState().addNotification({
    type: 'success',
    title: `Invoice ${invoice.invoiceNumber} ready`,
    description: `${load.customer} · $${invoice.amount.toLocaleString()}`,
  })

  return invoice
}
