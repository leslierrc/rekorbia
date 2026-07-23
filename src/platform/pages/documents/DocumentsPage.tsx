import { useState } from 'react'
import { useLanguage } from '../../../i18n/LanguageContext'
import { FileText, Upload, Search, Eye, Download, Trash2, Bot, CheckCircle2, ArrowRight, File, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDocumentsStore, useLoadsStore } from '../../store'
import { useToast } from '../../components/Toast'
import { processPodAndInvoice, generateInvoiceForLoad } from '../../services/workflow'

const typeColors: Record<string, string> = {
  rate_confirmation: 'bg-blue-500/15 text-blue-400',
  bol: 'bg-purple-500/15 text-purple-400',
  pod: 'bg-green-500/15 text-green-400',
  invoice: 'bg-orange-500/15 text-orange-400',
  carrier_packet: 'bg-cyan-500/15 text-cyan-400',
}

const pipelineSteps = ['upload', 'aiReads', 'detects', 'signs', 'archives', 'invoiceReady'] as const
const stepIcons = [Upload, FileText, Zap, CheckCircle2, File, ArrowRight]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function DocumentsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [activePipelineStep, setActivePipelineStep] = useState(-1)
  const { tp, language } = useLanguage()
  const { toast } = useToast()
  const docs = useDocumentsStore((s) => s.docs)
  const removeDoc = useDocumentsStore((s) => s.removeDoc)
  const loads = useLoadsStore((s) => s.loads)

  const typeLabels: Record<string, string> = {
    rate_confirmation: tp.documents.rateConfirmation,
    bol: tp.documents.bol,
    pod: tp.documents.pod,
    invoice: tp.documents.invoice,
    carrier_packet: tp.documents.carrierPacket,
  }

  const types = ['all', 'rate_confirmation', 'bol', 'pod', 'invoice', 'carrier_packet']

  const filtered = docs
    .filter((d) => filter === 'all' || d.type === filter)
    .filter((d) => search === '' || d.name.toLowerCase().includes(search.toLowerCase()) || `#${d.loadNumber}`.includes(search))

  const handleUploadPod = async () => {
    setActivePipelineStep(0)
    await sleep(350)
    setActivePipelineStep(1)
    await sleep(500)
    setActivePipelineStep(2)
    const target = loads.find((l) => l.status === 'delivered')
    if (!target) {
      await sleep(400)
      setActivePipelineStep(-1)
      toast({ type: 'warning', title: language === 'es' ? 'Nada para procesar' : 'Nothing to process', description: language === 'es' ? 'No hay cargas entregadas esperando POD' : 'No delivered loads are awaiting a POD' })
      return
    }
    await sleep(500)
    setActivePipelineStep(3)
    processPodAndInvoice(target)
    await sleep(400)
    setActivePipelineStep(5)
    toast({ type: 'success', title: language === 'es' ? 'POD procesado' : 'POD processed', description: `Load #${target.loadNumber} → ${language === 'es' ? 'factura generada' : 'invoice generated'}` })
    setTimeout(() => setActivePipelineStep(-1), 1200)
  }

  const handleView = (name: string) => {
    toast({ type: 'info', title: language === 'es' ? 'Abriendo documento' : 'Opening document', description: name })
  }

  const handleDownload = (name: string) => {
    toast({ type: 'success', title: language === 'es' ? 'Descargando…' : 'Downloading…', description: name })
  }

  const handleDelete = (id: string, name: string) => {
    removeDoc(id)
    toast({ type: 'info', title: language === 'es' ? 'Documento eliminado' : 'Document deleted', description: name })
  }

  const handleGenerateInvoiceForDoc = (loadNumber: number) => {
    const load = loads.find((l) => l.loadNumber === loadNumber)
    if (!load) {
      toast({ type: 'warning', title: language === 'es' ? 'Carga no encontrada' : 'Load not found', description: `#${loadNumber}` })
      return
    }
    generateInvoiceForLoad(load)
    toast({ type: 'success', title: language === 'es' ? 'Factura generada' : 'Invoice generated', description: `Load #${load.loadNumber}` })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{tp.documents.title}</h1>
          <p className="mt-1 text-sm text-white/50">{tp.documents.subtitle}</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/25">
          <Upload className="h-4 w-4" /> {tp.documents.upload}
        </button>
      </motion.div>

      {/* AI Processing Pipeline */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bot className="h-4 w-4 text-orange-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">AI Processing Pipeline</span>
        </div>
        <div className="flex items-center justify-between">
          {pipelineSteps.map((step, i) => {
            const Icon = stepIcons[i]
            const isActive = i === activePipelineStep
            const isComplete = i < activePipelineStep
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110'
                      : isComplete
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/[0.05] text-white/25'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap ${isActive ? 'text-orange-400' : isComplete ? 'text-green-400/70' : 'text-white/25'}`}>
                    {tp.documentsAI.steps[step]}
                  </span>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className={`flex-1 h-px mx-3 mb-5 ${isComplete ? 'bg-green-500/30' : 'bg-white/[0.06]'}`} />
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Drag & Drop Zone */}
      <motion.button
        type="button"
        onClick={handleUploadPod}
        disabled={activePipelineStep >= 0}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="group w-full rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] p-10 text-center transition-all hover:border-orange-500/40 hover:bg-orange-500/[0.03] hover:shadow-lg hover:shadow-orange-500/5 disabled:cursor-wait disabled:opacity-70"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 transition-all group-hover:bg-orange-500/20 group-hover:scale-110">
          <Bot className="h-8 w-8 text-orange-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-white/60 group-hover:text-white/80">{tp.documentsAI.dragDrop}</p>
        <p className="mt-1 text-xs text-white/30 group-hover:text-white/40">AI will automatically read, detect, and process</p>
      </motion.button>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col gap-4 sm:flex-row">
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

      {/* Document Cards */}
      <div className="space-y-2">
        {filtered.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.03 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <FileText className="h-5 w-5 text-orange-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-white/80">{doc.name}</p>
                  {doc.status === 'ready' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                      <Zap className="h-2.5 w-2.5" /> {tp.documentsAI.autoDetected}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[doc.type]}`}>
                    {typeLabels[doc.type]}
                  </span>
                  {doc.loadNumber > 0 && <span className="text-[11px] text-white/30">Load #{doc.loadNumber}</span>}
                  <span className="text-[11px] text-white/20">{doc.size}</span>
                </div>
                {doc.extractedData && (
                  <p className="mt-1.5 text-[11px] text-white/35 flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-orange-400/50" />
                    {tp.documentsAI.detected}: {doc.extractedData}
                  </p>
                )}
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                doc.status === 'signed' ? 'bg-green-500/15 text-green-400' :
                doc.status === 'ready' ? 'bg-blue-500/15 text-blue-400' :
                'bg-yellow-500/15 text-yellow-400'
              }`}>
                {doc.status === 'ready' ? tp.documents.ready : doc.status === 'pending' ? tp.documents.pending : tp.documents.signed}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
              <div className="flex gap-1">
                <button type="button" onClick={() => handleView(doc.name)} className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60" title={tp.documents.view}>
                  <Eye className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleDownload(doc.name)} className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-white/60" title={tp.documents.download}>
                  <Download className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleDelete(doc.id, doc.name)} className="rounded-lg p-2 text-white/30 transition-colors hover:bg-white/5 hover:text-red-400" title={tp.documents.delete}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {(doc.status === 'signed' || doc.status === 'ready') && doc.type !== 'invoice' && doc.loadNumber > 0 && (
                <button type="button" onClick={() => handleGenerateInvoiceForDoc(doc.loadNumber)} className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-3 py-1.5 text-[11px] font-medium text-orange-400 transition-all hover:bg-orange-500/20">
                  <Zap className="h-3 w-3" /> {tp.documentsAI.generateInvoice}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
