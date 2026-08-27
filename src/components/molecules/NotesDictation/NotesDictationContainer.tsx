import React, { useEffect, useRef, useState } from 'react'
import { NotesDictationView } from './NotesDictationView'
import type { NotesDictationContainerProps } from './NotesDictation.types'

const getSpeechRecognition = () =>
  typeof window === 'undefined' ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null

export const NotesDictationContainer = ({ locale, onChange, placeholder, t, value }: NotesDictationContainerProps) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const onChangeRef = useRef(onChange)
  const valueRef = useRef(value)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState('')
  const SpeechRecognition = getSpeechRecognition()

  useEffect(() => {
    valueRef.current = value
    onChangeRef.current = onChange
  }, [onChange, value])

  useEffect(
    () => () => {
      recognitionRef.current?.abort()
    },
    [],
  )

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const startListening = () => {
    if (!SpeechRecognition) return

    setError('')
    const recognition = new SpeechRecognition()
    recognition.lang = locale
    recognition.continuous = true
    recognition.interimResults = false
    recognition.onresult = event => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .filter(result => result.isFinal)
        .map(result => result[0].transcript.trim())
        .filter(Boolean)
        .join(' ')
      if (!transcript) return

      const currentValue = valueRef.current || ''
      const nextValue = `${currentValue}${currentValue && !currentValue.endsWith(' ') ? ' ' : ''}${transcript}`
      valueRef.current = nextValue
      onChangeRef.current(nextValue)
    }
    recognition.onerror = event => {
      if (event.error !== 'aborted') {
        setError(event.error === 'not-allowed' ? t('microphonePermissionError') : t('speechRecognitionError'))
      }
      setIsListening(false)
    }
    recognition.onend = () => {
      recognitionRef.current = null
      setIsListening(false)
    }
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  return (
    <NotesDictationView
      error={error}
      isListening={isListening}
      isSupported={Boolean(SpeechRecognition)}
      onStartListening={startListening}
      onStopListening={stopListening}
      onValueChange={onChange}
      placeholder={placeholder}
      t={t}
      value={value}
    />
  )
}

export { NotesDictationContainer as NotesDictation }
