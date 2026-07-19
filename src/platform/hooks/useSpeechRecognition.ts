import { useState, useRef, useCallback, useEffect } from 'react'

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface UseSpeechRecognitionOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { lang = 'es-ES', continuous = true, interimResults = true } = options
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')
  const onFinalRef = useRef<((text: string) => void) | null>(null)
  const onEndRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setIsSupported(!!SR)
  }, [])

  const start = useCallback((onFinal?: (text: string) => void, onEnd?: () => void) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setError('Speech recognition not supported')
      return
    }

    // Stop any existing session
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch { /* ignore */ }
    }

    setError(null)
    setInterimTranscript('')
    finalTranscriptRef.current = ''
    onFinalRef.current = onFinal || null
    onEndRef.current = onEnd || null

    const recognition = new SR()
    recognition.lang = lang
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript
        if (result.isFinal) {
          finalTranscriptRef.current += text
          onFinalRef.current?.(finalTranscriptRef.current)
        } else {
          interim += text
        }
      }

      setInterimTranscript(interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // 'aborted' and 'no-speech' are normal — don't treat as errors
      if (event.error === 'aborted' || event.error === 'no-speech') return
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Allow it in browser settings.')
      } else {
        setError(`Voice error: ${event.error}`)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
      onEndRef.current?.()
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      setError('Failed to start speech recognition')
    }
  }, [lang, continuous, interimResults])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch { /* ignore */ }
      recognitionRef.current = null
    }
    setIsListening(false)
    setInterimTranscript('')
  }, [])

  const reset = useCallback(() => {
    setInterimTranscript('')
    setError(null)
    finalTranscriptRef.current = ''
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch { /* ignore */ }
      }
    }
  }, [])

  return {
    isListening,
    interimTranscript,
    isSupported,
    error,
    start,
    stop,
    reset,
  }
}
