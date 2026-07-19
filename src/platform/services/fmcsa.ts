const BASE = 'https://api.dotlookup.dev/v1'

export interface FMCSCarrier {
  dot_number: string
  mc_number: string | null
  legal_name: string
  dba_name: string | null
  status: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    lat: number
    lon: number
  }
  contact: {
    phone: string
    email: string | null
  }
  fleet: {
    power_units: number
    drivers: number
  }
  authority: {
    status: string
    common_authority_date: string | null
    contract_authority_date: string | null
    broker_authority: string
  }
  mcs150: {
    date: string | null
    mileage: number | null
    mileage_year: number | null
  }
  cargo_carried: string[]
  operation_classification: string[]
  safety: {
    rating: string | null
    rating_date: string | null
    driver_oos_rate: number | null
    driver_oos_rate_national: number | null
    vehicle_oos_rate: number | null
    vehicle_oos_rate_national: number | null
    total_crashes: number | null
    fatal_crashes: number | null
    unsafe_driving_violations: number | null
    hos_violations: number | null
  }
  insurance: {
    bipd_on_file: number | null
    cargo_on_file: number | null
  }
}

export interface FMCSSearchResult {
  dot_number: string
  legal_name: string
  dba_name: string | null
  status: string
  city: string
  state: string
  power_units: number
  drivers: number
}

export async function lookupCarrierByDOT(dotNumber: string): Promise<FMCSCarrier | null> {
  try {
    const res = await fetch(`${BASE}/carriers/${dotNumber}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function searchCarriersByName(name: string, size = 20): Promise<FMCSSearchResult[]> {
  try {
    const res = await fetch(`${BASE}/carriers/search?q=${encodeURIComponent(name)}&size=${size}`)
    if (!res.ok) return []
    const data = await res.json()
    return data.carriers || data || []
  } catch {
    return []
  }
}

export async function searchCarriersByLocation(city: string, state: string): Promise<FMCSSearchResult[]> {
  try {
    const res = await fetch(`${BASE}/carriers/search?q=${encodeURIComponent(`${city} ${state}`)}&size=20`)
    if (!res.ok) return []
    const data = await res.json()
    return data.carriers || data || []
  } catch {
    return []
  }
}

export function getCarrierScore(carrier: FMCSCarrier): { score: number; label: string; color: string } {
  let score = 50

  // Safety rating
  if (carrier.safety?.rating === 'Satisfactory') score += 25
  else if (carrier.safety?.rating === 'Conditional') score += 10
  else if (carrier.safety?.rating === 'Unsatisfactory') score -= 30

  // OOS rates (lower is better)
  if (carrier.safety?.driver_oos_rate != null && carrier.safety.driver_oos_rate_national != null) {
    if (carrier.safety.driver_oos_rate < carrier.safety.driver_oos_rate_national) score += 10
    else score -= 5
  }
  if (carrier.safety?.vehicle_oos_rate != null && carrier.safety.vehicle_oos_rate_national != null) {
    if (carrier.safety.vehicle_oos_rate < carrier.safety.vehicle_oos_rate_national) score += 10
    else score -= 5
  }

  // Fleet size (bigger = more reliable)
  if (carrier.fleet?.power_units > 50) score += 5
  if (carrier.fleet?.power_units > 200) score += 5

  // Crashes
  if (carrier.safety?.fatal_crashes === 0) score += 5
  if (carrier.safety?.total_crashes != null && carrier.safety.total_crashes > 5) score -= 10

  // Insurance
  if (carrier.insurance?.bipd_on_file >= 1000000) score += 5

  score = Math.max(0, Math.min(100, score))

  if (score >= 80) return { score, label: 'Excellent', color: 'emerald' }
  if (score >= 60) return { score, label: 'Good', color: 'blue' }
  if (score >= 40) return { score, label: 'Caution', color: 'amber' }
  return { score, label: 'Avoid', color: 'red' }
}
