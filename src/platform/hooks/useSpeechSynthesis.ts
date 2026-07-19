import { useState, useCallback, useEffect, useRef } from 'react'

interface UseSpeechSynthesisOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

export function useSpeechSynthesis(options: UseSpeechSynthesisOptions = {}) {
  const { lang = 'es-ES', rate = 1, pitch = 1, volume = 1 } = options
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const onEndRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    setIsSupported('speechSynthesis' in window)
  }, [])

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window) || !text) return

    window.speechSynthesis.cancel()
    onEndRef.current = onEnd || null

    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/[-*]\s/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\n+/g, '. ')
      .trim()

    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    // Try to pick a voice for the language
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]))
    if (voice) utterance.voice = voice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      onEndRef.current?.()
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      onEndRef.current?.()
    }

    window.speechSynthesis.speak(utterance)
  }, [lang, rate, pitch, volume])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    onEndRef.current = null
  }, [])

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
  }
}
