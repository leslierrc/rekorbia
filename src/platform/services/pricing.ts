import { mockLoads } from '../data/mock'

const RATE_PER_MILE: Record<string, number> = {
  'Dry Van': 2.05,
  Reefer: 2.35,
  Flatbed: 2.4,
  'Step Deck': 2.6,
  Lowboy: 2.9,
}

// No mapping API in this frontend-only build, so mileage is estimated:
// reuse a known distance if this exact lane already shipped before,
// otherwise derive a stable pseudo-distance from the lane string so the
// same origin/destination always quotes the same mileage.
export function estimateMileage(origin: string, destination: string): number {
  const known = mockLoads.find(
    (l) => l.origin.toLowerCase() === origin.toLowerCase() && l.destination.toLowerCase() === destination.toLowerCase()
  )
  if (known) return known.mileage

  let hash = 0
  const key = `${origin.toLowerCase()}|${destination.toLowerCase()}`
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return 250 + (hash % 1150)
}

export interface PriceSuggestionInput {
  origin: string
  destination: string
  equipment: string
  customerRecommendedPrice?: number
  customerConfidence?: number
}

export interface PriceSuggestion {
  mileage: number
  sellRate: number
  buyRate: number
  margin: number
  confidence: number
  rationale: string
}

export function suggestPrice(input: PriceSuggestionInput): PriceSuggestion {
  const mileage = estimateMileage(input.origin, input.destination)
  const perMile = RATE_PER_MILE[input.equipment] ?? 2.1
  let sellRate = Math.round(mileage * perMile)
  let confidence = 0.75
  let rationale = `${mileage} mi × $${perMile.toFixed(2)}/mi (${input.equipment} market rate)`

  if (input.customerRecommendedPrice) {
    sellRate = Math.round(sellRate * 0.4 + input.customerRecommendedPrice * 0.6)
    confidence = input.customerConfidence ?? 0.85
    rationale += ', blended with this customer\'s accepted price history'
  }

  const buyRate = Math.round(sellRate * 0.78)
  const margin = sellRate - buyRate

  return { mileage, sellRate, buyRate, margin, confidence, rationale }
}
