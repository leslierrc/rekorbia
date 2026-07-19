import { motion } from 'framer-motion'
import { FileText, Download, Eye, Trash2, Upload, Search } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../../../i18n/LanguageContext'

interface Doc {
  id: string
  name: string
  type: 'rate_confirmation' | 'bol' | 'pod' | 'invoice' | 'carrier_packet'
  loadNumber: number
  status: 'ready' | 'pending' | 'signed'
  createdAt: string
  size: string
}

const mockDocs: Doc[] = [
  { id: '1', name: 'RC-1587-LoneStar.pdf', type: 'rate_confirmation', loadNumber: 1587, status: 'ready', createdAt: '2026-07-18', size: '245 KB' },
  { id: '2', name: 'BOL-1587-ABCLogistics.pdf', type: 'bol', loadNumber: 1587, status: 'pending', createdAt: '2026-07-18', size: '189 KB' },
  { id: '3', name: 'POD-1584-NexGen.pdf', type: 'pod', loadNumber: 1584, status: 'signed', createdAt: '2026-07-18', size: '1.2 MB' },
  { id: '4', name: 'INV-2026-0089-ABC.pdf', type: 'invoice', loadNumber: 1583, status: 'ready', createdAt: '2026-07-17', size: '312 KB' },
  { id: '5', name: 'CP-LoneStarTrucking.pdf', type: 'carrier_packet', loadNumber: 0, status: 'ready', createdAt: '2026-07-15', size: '2.1 MB' },
  { id: '6', name: 'RC-1586-EagleFreight.pdf', type: 'rate_confirmation', loadNumber: 1586, status: 'ready', createdAt: '2026-07-18', size: '248 KB' },
  { id: '7', name: 'BOL-1581-PacificCoast.pdf', type: 'bol', loadNumber: 1581, status: 'pending', createdAt: '2026-07-19', size: '192 KB' },
]

const typeColors: Record<string, string> = {
  rate_confirmation: 'bg-blue-500/15 text-blue-400',
  bol: 'bg-purple-500/15 text-purple-400',
  pod: 'bg-green-500/15 text-green-400',
  invoice: 'bg-orange-500/15 text-orange-400',
  carrier_packet: 'bg-cyan-500/15 text-cyan-400',
}

export function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const { tp } = useLanguage()

  const typeLabels: Record<string, string> = {
    rate_confirmation: tp.documents.rateConfirmation,
    bol: tp.documents.bol,
    pod: tp.documents.pod,
    invoice: tp.documents.invoice,
    carrier_packet: tp.documents.carrierPacket,
  }

  const types = ['all', 'rate_confirmation', 'bol', 'pod', 'invoice', 'carrier_packet']

  const filtered = mockDocs
    .filter((d) => filter === 'all' || d.type === filter)
    .filter((d) => search === '' || d.name.toLowerCase().includes(search.toLowerCase()) || `#${d.loadNumber}`.includes(search))

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{tp.documents.title}</h1>
          <p className="mt-1 text-sm text-white/50">{tp.documents.subtitle}</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25">
          <Upload className="h-4 w-4" /> {tp.documents.upload}
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tp.documents.search} className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pr-4 pl-10 text-sm text-white/80 outline-none placeholder:text-white/25 focus:border-orange-500/50" />
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button key={t} type="button" onClick={() => setFilter(t)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filter === t ? 'bg-orange-500/15 text-orange-400' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}>
              {t === 'all' ? tp.documents.all : typeLabels[t]}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="space-y-2">
        {filtered.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.03 }}
            className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <FileText className="h-5 w-5 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white/80">{doc.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[doc.type]}`}>
                  {typeLabels[doc.type]}
                </span>
                {doc.loadNumber > 0 && <span className="text-[11px] text-white/30">Load #{doc.loadNumber}</span>}
                <span className="text-[11px] text-white/20">{doc.size}</span>
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              doc.status === 'signed' ? 'bg-green-500/15 text-green-400' :
              doc.status === 'ready' ? 'bg-blue-500/15 text-blue-400' :
              'bg-yellow-500/15 text-yellow-400'
            }`}>
              {doc.status === 'ready' ? tp.documents.ready : doc.status === 'pending' ? tp.documents.pending : tp.documents.signed}
            </span>
            <div className="flex gap-1">
              <button type="button" className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60" title={tp.documents.view}>
                <Eye className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60" title={tp.documents.download}>
                <Download className="h-4 w-4" />
              </button>
              <button type="button" className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-red-400" title={tp.documents.delete}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
