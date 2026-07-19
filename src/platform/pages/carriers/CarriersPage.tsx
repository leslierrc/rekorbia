import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Shield, ShieldCheck, ShieldAlert, ShieldX, Truck, Phone, Building2, Users, AlertTriangle, ExternalLink, Loader2 } from 'lucide-react'
import { lookupCarrierByDOT, searchCarriersByName, type FMCSCarrier, getCarrierScore } from '../../services/fmcsa'
import { useLanguage } from '../../../i18n/LanguageContext'

const safetyConfig: Record<string, { color: string; bg: string; icon: typeof Shield }> = {
  Satisfactory: { color: 'text-green-400', bg: 'bg-green-500/15', icon: ShieldCheck },
  Conditional: { color: 'text-yellow-400', bg: 'bg-yellow-500/15', icon: ShieldAlert },
  Unsatisfactory: { color: 'text-red-400', bg: 'bg-red-500/15', icon: ShieldX },
}

export function CarriersPage() {
  const { tp } = useLanguage()
  const [search, setSearch] = useState('')
  const [searchType, setSearchType] = useState<'dot' | 'name'>('dot')
  const [loading, setLoading] = useState(false)
  const [carrier, setCarrier] = useState<FMCSCarrier | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<FMCSCarrier[]>([])

  const handleSearch = useCallback(async () => {
    if (!search.trim()) return
    setLoading(true)
    setError(null)
    setCarrier(null)

    try {
      if (searchType === 'dot') {
        const result = await lookupCarrierByDOT(search.trim())
        if (result) {
          setCarrier(result)
          if (!searchHistory.find(c => c.dot_number === result.dot_number)) {
            setSearchHistory(prev => [result, ...prev].slice(0, 10))
          }
        } else {
          setError('Carrier not found. Check the DOT number and try again.')
        }
      } else {
        const results = await searchCarriersByName(search.trim(), 5)
        if (results.length > 0) {
          // Fetch full details for first result
          const full = await lookupCarrierByDOT(results[0].dot_number)
          if (full) {
            setCarrier(full)
            if (!searchHistory.find(c => c.dot_number === full.dot_number)) {
              setSearchHistory(prev => [full, ...prev].slice(0, 10))
            }
          }
        } else {
          setError('No carriers found. Try a different name.')
        }
      }
    } catch {
      setError('Error connecting to FMCSA. Try again later.')
    }

    setLoading(false)
  }, [search, searchType, searchHistory])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const score = carrier ? getCarrierScore(carrier) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white">{tp.carriers.title}</h1>
        <p className="mt-1 text-sm text-white/50">Real-time FMCSA carrier verification</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex gap-2">
            <button type="button" onClick={() => setSearchType('dot')}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${searchType === 'dot' ? 'bg-orange-500/15 text-orange-400' : 'text-white/40 hover:bg-white/5'}`}>
              DOT #
            </button>
            <button type="button" onClick={() => setSearchType('name')}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${searchType === 'name' ? 'bg-orange-500/15 text-orange-400' : 'text-white/40 hover:bg-white/5'}`}>
              Name
            </button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={searchType === 'dot' ? 'Enter DOT number (e.g. 2233855)' : 'Search by carrier name'}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pr-4 pl-10 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
          </div>
          <button type="button" onClick={handleSearch} disabled={loading || !search.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 disabled:opacity-40">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Verify
          </button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          <AlertTriangle className="mr-2 inline h-4 w-4" />{error}
        </div>
      )}

      {/* Carrier Result */}
      <AnimatePresence mode="wait">
        {carrier && score && (
          <motion.div key={carrier.dot_number}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">

            {/* Carrier Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 font-display text-xl font-bold text-orange-400">
                {carrier.legal_name.split(' ').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h2 className="font-display text-lg font-bold text-white">{carrier.legal_name}</h2>
                {carrier.dba_name && <p className="text-sm text-white/50">DBA: {carrier.dba_name}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/60">
                    DOT: {carrier.dot_number}
                  </span>
                  {carrier.mc_number && (
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/60">
                      MC: {carrier.mc_number}
                    </span>
                  )}
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    carrier.status === 'ACTIVE' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                  }`}>
                    {carrier.status}
                  </span>
                </div>
              </div>

              {/* Score badge */}
              <div className={`flex flex-col items-center rounded-xl border px-5 py-3 ${
                score.color === 'emerald' ? 'border-green-500/20 bg-green-500/10' :
                score.color === 'blue' ? 'border-blue-500/20 bg-blue-500/10' :
                score.color === 'amber' ? 'border-yellow-500/20 bg-yellow-500/10' :
                'border-red-500/20 bg-red-500/10'
              }`}>
                <span className="font-display text-2xl font-bold text-white">{score.score}</span>
                <span className={`text-[11px] font-medium ${
                  score.color === 'emerald' ? 'text-green-400' :
                  score.color === 'blue' ? 'text-blue-400' :
                  score.color === 'amber' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>{score.label}</span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoCard icon={Building2} label="Address" value={`${carrier.address?.city || 'N/A'}, ${carrier.address?.state || ''}`} />
              <InfoCard icon={Phone} label="Phone" value={carrier.contact?.phone || 'N/A'} />
              <InfoCard icon={Truck} label="Power Units" value={String(carrier.fleet?.power_units || 0)} />
              <InfoCard icon={Users} label="Drivers" value={String(carrier.fleet?.drivers || 0)} />
            </div>

            {/* Safety + Authority */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Safety */}
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                <h3 className="mb-3 text-xs font-medium text-white/40">SAFETY</h3>
                {carrier.safety?.rating ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const sc = safetyConfig[carrier.safety.rating] || safetyConfig.Satisfactory
                        const Icon = sc.icon
                        return (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sc.bg} ${sc.color}`}>
                            <Icon className="h-3 w-3" /> {carrier.safety.rating}
                          </span>
                        )
                      })()}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-white/30">Driver OOS Rate</span>
                        <p className={`font-medium ${carrier.safety.driver_oos_rate != null && carrier.safety.driver_oos_rate < (carrier.safety.driver_oos_rate_national || 5.5) ? 'text-green-400' : 'text-yellow-400'}`}>
                          {carrier.safety.driver_oos_rate != null ? `${carrier.safety.driver_oos_rate}%` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/30">Vehicle OOS Rate</span>
                        <p className={`font-medium ${carrier.safety.vehicle_oos_rate != null && carrier.safety.vehicle_oos_rate < (carrier.safety.vehicle_oos_rate_national || 20) ? 'text-green-400' : 'text-yellow-400'}`}>
                          {carrier.safety.vehicle_oos_rate != null ? `${carrier.safety.vehicle_oos_rate}%` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-white/30">Total Crashes</span>
                        <p className="font-medium text-white/60">{carrier.safety.total_crashes ?? 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-white/30">Fatal Crashes</span>
                        <p className={`font-medium ${(carrier.safety.fatal_crashes ?? 0) === 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {carrier.safety.fatal_crashes ?? 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-white/30">No safety data available</p>
                )}
              </div>

              {/* Authority + Insurance */}
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-4">
                <h3 className="mb-3 text-xs font-medium text-white/40">AUTHORITY & INSURANCE</h3>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-white/30">Authority Status</span>
                    <span className="font-medium text-white/60">{carrier.authority?.status || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/30">BIPD Insurance</span>
                    <span className="font-medium text-white/60">
                      {carrier.insurance?.bipd_on_file ? `$${(carrier.insurance.bipd_on_file / 1000000).toFixed(0)}M` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/30">Cargo Insurance</span>
                    <span className="font-medium text-white/60">
                      {carrier.insurance?.cargo_on_file ? `$${(carrier.insurance.cargo_on_file / 1000).toFixed(0)}K` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/30">MCS-150 Mileage</span>
                    <span className="font-medium text-white/60">
                      {carrier.mcs150?.mileage ? `${(carrier.mcs150.mileage / 1000).toFixed(0)}K mi/yr` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cargo Types */}
            {carrier.cargo_carried?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {carrier.cargo_carried.map(cargo => (
                  <span key={cargo} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/50">{cargo}</span>
                ))}
              </div>
            )}

            {/* FMCSA Link */}
            <div className="mt-4 flex justify-end">
              <a href={`https://safer.fmcsa.dot.gov/CompanySnapshot.aspx?umper=${carrier.dot_number}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors">
                <ExternalLink className="h-3 w-3" /> View on FMCSA SaferSys
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-medium text-white/30">RECENT LOOKUPS</h3>
          <div className="space-y-2">
            {searchHistory.map(c => {
              const sc = getCarrierScore(c)
              return (
                <button key={c.dot_number} type="button"
                  onClick={() => { setCarrier(c); setError(null) }}
                  className="flex w-full items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-all hover:border-white/10 hover:bg-white/[0.04]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-bold text-orange-400">
                    {c.legal_name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/70">{c.legal_name}</p>
                    <p className="text-xs text-white/30">DOT {c.dot_number} · {c.address?.city}, {c.address?.state}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    sc.color === 'emerald' ? 'bg-green-500/15 text-green-400' :
                    sc.color === 'blue' ? 'bg-blue-500/15 text-blue-400' :
                    sc.color === 'amber' ? 'bg-yellow-500/15 text-yellow-400' :
                    'bg-red-500/15 text-red-400'
                  }`}>{sc.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!carrier && !loading && !error && (
        <div className="py-16 text-center">
          <Shield className="mx-auto h-12 w-12 text-white/10" />
          <p className="mt-3 text-sm text-white/40">Search by DOT number or carrier name to verify</p>
          <p className="mt-1 text-xs text-white/20">Data sourced from FMCSA in real-time</p>
        </div>
      )}
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-white/30" />
        <span className="text-[11px] text-white/30">{label}</span>
      </div>
      <p className="mt-1 text-sm font-medium text-white/70">{value}</p>
    </div>
  )
}
