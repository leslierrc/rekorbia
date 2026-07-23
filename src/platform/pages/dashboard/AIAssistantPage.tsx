import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Bot, User, Mic, Square, Paperclip, FileSpreadsheet, X, Play, Pause } from 'lucide-react'
import { streamChat, type ChatMessage } from '../../ai/githubModels'
import { useLoadsStore, useInvoicesStore, useInboxStore, useNotificationsStore } from '../../store'
import { mockCarriers } from '../../data/mock'

interface AttachedFile {
  name: string
  size: number
  type: string
  content?: string
}

interface AudioMessage {
  url: string
  duration: number
  transcript?: string
}

// Extend ChatMessage to support audio
interface AppChatMessage extends ChatMessage {
  audio?: AudioMessage
}

const WAVE_BARS = 24

function buildContextSnapshot(
  loads: ReturnType<typeof useLoadsStore.getState>['loads'],
  invoices: ReturnType<typeof useInvoicesStore.getState>['invoices'],
  inboxItems: ReturnType<typeof useInboxStore.getState>['items'],
  notifications: ReturnType<typeof useNotificationsStore.getState>['notifications'],
): string {
  const loadLines = loads.slice(0, 15).map((l) =>
    `#${l.loadNumber} | ${l.status} | ${l.origin} -> ${l.destination} | ${l.equipment} | ${l.weight}lbs | customer: ${l.customer} | carrier: ${l.carrier || 'unassigned'} | sell: $${l.sellRate} buy: $${l.buyRate} margin: $${l.margin} | pickup ${l.pickupDate} delivery ${l.deliveryDate}${l.tracking > 0 ? ` | ${l.tracking}% complete` : ''}`
  ).join('\n')

  const invoiceLines = invoices.slice(0, 10).map((i) =>
    `${i.invoiceNumber} | load #${i.loadNumber} | ${i.customer} | $${i.amount} | ${i.status} | due ${i.dueDate}`
  ).join('\n')

  const carrierLines = mockCarriers.slice(0, 10).map((c) =>
    `${c.name} | MC ${c.mcNumber} | ${c.equipment.join('/')} | safety: ${c.safetyRating} | insurance: ${c.insurance ? 'yes' : 'NO'} | status: ${c.status} | rating: ${c.rating}`
  ).join('\n')

  const pendingEmails = inboxItems.filter((e) => e.status === 'ready' || e.status === 'detected').length
  const unreadNotifs = notifications.filter((n) => !n.read).length

  return [
    `LOADS (${loads.length} total, showing up to 15):`,
    loadLines || 'none',
    '',
    `INVOICES (${invoices.length} total, showing up to 10):`,
    invoiceLines || 'none',
    '',
    `CARRIERS (showing up to 10):`,
    carrierLines || 'none',
    '',
    `AI INBOX: ${pendingEmails} email(s) with a detected load awaiting action.`,
    `NOTIFICATIONS: ${unreadNotifs} unread.`,
  ].join('\n')
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState<AppChatMessage[]>([])
  const loads = useLoadsStore((s) => s.loads)
  const invoices = useInvoicesStore((s) => s.invoices)
  const inboxItems = useInboxStore((s) => s.items)
  const notifications = useNotificationsStore((s) => s.notifications)
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [waveLevels, setWaveLevels] = useState<number[]>(new Array(WAVE_BARS).fill(0.1))
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamingRef = useRef(false)

  // Recording refs
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')
  const recordingStartTimeRef = useRef(0)

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])
  useEffect(() => { streamingRef.current = isStreaming }, [isStreaming])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
      audioCtxRef.current?.close()
    }
  }, [])

  const buildMessage = useCallback((text: string): string => {
    if (attachedFiles.length === 0) return text
    const fileInfo = attachedFiles.map(f => `[Archivo: ${f.name} (${f.type}, ${Math.round(f.size / 1024)}KB)]`).join('\n')
    const fileContent = attachedFiles.filter(f => f.content).map(f => `\n--- Contenido de ${f.name} ---\n${f.content}`).join('')
    return `${text}\n\n${fileInfo}${fileContent}`
  }, [attachedFiles])

  // ---- Send message ----
  const handleSend = useCallback(async (text: string, audio?: AudioMessage) => {
    if (!text.trim() || streamingRef.current) return

    const content = buildMessage(text)
    const userMessage: AppChatMessage = { role: 'user', content, audio }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setAttachedFiles([])
    setIsStreaming(true)

    setMessages([...newMessages, { role: 'assistant', content: '' }])
    let fullContent = ''

    try {
      const context = buildContextSnapshot(loads, invoices, inboxItems, notifications)
      const stream = streamChat(newMessages, context)
      for await (const chunk of stream) {
        fullContent += chunk
        setMessages([...newMessages, { role: 'assistant', content: fullContent }])
      }
    } catch {
      fullContent = 'Error de conexion. Intenta de nuevo.'
      setMessages([...newMessages, { role: 'assistant', content: fullContent }])
    }

    setIsStreaming(false)
  }, [messages, buildMessage, loads, invoices, inboxItems, notifications])

  // ---- Waveform animation ----
  const animateWaveform = useCallback(() => {
    if (!analyserRef.current) return
    const analyser = analyserRef.current
    const data = new Uint8Array(analyser.frequencyBinCount)

    const tick = () => {
      analyser.getByteFrequencyData(data)
      const step = Math.floor(data.length / WAVE_BARS)
      const levels = Array.from({ length: WAVE_BARS }, (_, i) => {
        const val = data[i * step] || 0
        return Math.max(0.08, val / 255)
      })
      setWaveLevels(levels)
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
  }, [])

  // ---- Start recording ----
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      recordingStartTimeRef.current = Date.now()

      // AudioContext + AnalyserNode for waveform
      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 128
      source.connect(analyser)
      analyserRef.current = analyser
      animateWaveform()

      // MediaRecorder to actually save the audio
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.start()
      recorderRef.current = recorder

      // Timer
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      // SpeechRecognition in parallel for live transcription
      transcriptRef.current = ''
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SR) {
        const recognition = new SR()
        recognition.lang = 'es-ES'
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event: any) => {
          let interim = ''
          let final = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const t = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              final += t
            } else {
              interim += t
            }
          }
          if (final) transcriptRef.current += final
          setInput(transcriptRef.current + interim)
        }

        recognition.onerror = () => {}
        recognition.onend = () => {}
        try {
          recognition.start()
          recognitionRef.current = recognition
        } catch { /* already running */ }
      }

      setIsRecording(true)
    } catch {
      alert('No se pudo acceder al microfono. Permisos denegados.')
    }
  }, [animateWaveform])

  // ---- Stop recording ----
  const stopRecording = useCallback(() => {
    const duration = Math.round((Date.now() - recordingStartTimeRef.current) / 1000)
    const transcript = transcriptRef.current.trim()

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Stop waveform
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    setWaveLevels(new Array(WAVE_BARS).fill(0.1))

    // Stop SpeechRecognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch { /* ignore */ }
      recognitionRef.current = null
    }

    // Stop MediaRecorder and save the blob
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)

        // Send as audio message
        const audioData: AudioMessage = {
          url,
          duration,
          transcript: transcript || undefined,
        }

        const textToSend = transcript || '[Audio message]'
        handleSend(textToSend, audioData)
      }
      recorderRef.current.stop()
    } else {
      // No recorder — just send transcript
      if (transcript) {
        handleSend(transcript)
      }
    }

    // Stop mic stream
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    analyserRef.current = null
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    recorderRef.current = null

    setIsRecording(false)
    setInput('')
    setRecordingTime(0)
  }, [handleSend])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // ---- File upload ----
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = () => {
        const content = reader.result as string
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          size: file.size,
          type: file.type || file.name.split('.').pop() || 'unknown',
          content: content.slice(0, 8000),
        }])
      }
      if (file.name.endsWith('.csv') || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
        reader.readAsText(file)
      } else {
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          size: file.size,
          type: file.type || file.name.split('.').pop() || 'unknown',
        }])
      }
    })

    e.target.value = ''
  }, [])

  const removeFile = useCallback((index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) handleSend(input)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div className="flex h-full min-h-0 flex-col -m-4 lg:-m-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">REKORBIA AI</h1>
            <p className="text-xs text-white/40">GPT-4o-mini · Voice + Files</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">How can I help you today?</h2>
              <p className="mt-2 text-sm text-white/40">Type, record audio, or upload a file.</p>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-2 px-4">
              {[
                'What loads are in transit right now?',
                'Which invoices are overdue?',
                'Find a carrier for my next flatbed load',
                'Summarize today\'s activity',
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs text-white/60 transition-colors hover:border-orange-500/30 hover:text-orange-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/20">
                    <Bot className="h-4 w-4 text-orange-400" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-orange-500 text-white' : 'border border-white/[0.06] bg-white/[0.03] text-white/80'
                }`}>
                  {/* Audio player in message */}
                  {msg.audio && (
                    <AudioPlayer
                      url={msg.audio.url}
                      duration={msg.audio.duration}
                      isPlaying={playingAudio === msg.audio.url}
                      onToggle={() => { const a = msg.audio; if (a) setPlayingAudio(playingAudio === a.url ? null : a.url) }}
                    />
                  )}
                  {msg.audio && msg.content !== '[Audio message]' && <div className="mt-1" />}
                  <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  {msg.role === 'assistant' && msg.content && i === messages.length - 1 && isStreaming && (
                    <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-orange-400" />
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <User className="h-4 w-4 text-white/60" />
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/[0.06] px-6 py-3">
        <div className="mx-auto max-w-3xl">
          {/* Attached files */}
          <AnimatePresence>
            {attachedFiles.length > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="mb-2 flex flex-wrap gap-2 overflow-hidden">
                {attachedFiles.map((file, i) => (
                  <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs text-white/60">{file.name}</span>
                    <span className="text-[10px] text-white/30">{Math.round(file.size / 1024)}KB</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-white/30 hover:text-red-400 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recording UI */}
          <AnimatePresence>
            {isRecording && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="mb-3 overflow-hidden">
                <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <button type="button" onClick={stopRecording}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-400 transition-colors">
                    <Square className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-sm font-medium text-red-400">{formatTime(recordingTime)}</span>
                  </div>
                  <div className="flex flex-1 items-center justify-center gap-[2px]">
                    {waveLevels.map((level, i) => (
                      <div key={i}
                        className="w-[3px] rounded-full bg-red-400 transition-[height] duration-75"
                        style={{ height: `${Math.max(4, level * 36)}px` }}
                      />
                    ))}
                  </div>
                </div>
                {transcriptRef.current && (
                  <p className="mt-1 px-4 text-xs text-white/30 italic truncate">{transcriptRef.current}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input bar */}
          {!isRecording && (
            <div className="flex items-end gap-1.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-2">
              <input ref={fileInputRef} type="file" className="hidden" accept=".csv,.xlsx,.xls,.txt,.json,.pdf" multiple
                onChange={handleFileUpload} />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-all"
                title="Upload file">
                <Paperclip className="h-4 w-4" />
              </button>
              <button type="button" onClick={toggleRecording}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-all"
                title="Record voice">
                <Mic className="h-4 w-4" />
              </button>
              <textarea ref={textareaRef} value={input}
                onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje..."
                rows={1}
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none" />
              <button type="button" onClick={() => input.trim() && handleSend(input)}
                disabled={!input.trim() || isStreaming}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-all hover:bg-orange-400 disabled:opacity-30">
                {isStreaming
                  ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  : <Send className="h-4 w-4" />
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Audio Player Component ----
function AudioPlayer({ url, duration, isPlaying, onToggle }: {
  url: string
  duration: number
  isPlaying: boolean
  onToggle: () => void
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime / audioRef.current.duration)
        }
      })
      audioRef.current.addEventListener('ended', () => {
        setProgress(0)
        onToggle()
      })
    }
    return () => {
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [url, onToggle])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setProgress(0)
    }
  }, [isPlaying])

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2">
      <button type="button" onClick={onToggle}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
      </button>
      {/* Progress bar */}
      <div className="relative h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full bg-white/40 transition-[width] duration-100"
          style={{ width: `${progress * 100}%` }} />
      </div>
      <span className="text-[10px] text-white/40 font-mono">{formatDuration(duration)}</span>
    </div>
  )
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function formatMessage(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/`(.*?)`/g, '<code class="rounded bg-white/5 px-1 py-0.5 text-orange-300">$1</code>')
    .replace(/\n/g, '<br />')
}
