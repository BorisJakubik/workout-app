import React, { useEffect, useRef, useState } from 'react'
import { Mic, MicOff } from 'lucide-react'

const getSpeechRecognition = () => (typeof window === 'undefined' ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null)

export const NotesDictation = ({ locale, onChange, placeholder, t, value }) => {
  const recognitionRef = useRef(null)
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
      if (event.error !== 'aborted') setError(event.error === 'not-allowed' ? t('microphonePermissionError') : t('speechRecognitionError'))
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
    <div className="notes-dictation">
      <textarea value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />
      {SpeechRecognition ? (
        <button
          className={`dictation-button${isListening ? ' listening' : ''}`}
          type="button"
          aria-label={t(isListening ? 'stopDictation' : 'startDictation')}
          aria-pressed={isListening}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? <MicOff size={17} /> : <Mic size={17} />}
          {t(isListening ? 'stopDictation' : 'startDictation')}
        </button>
      ) : (
        <small className="dictation-message">{t('speechRecognitionUnsupported')}</small>
      )}
      {isListening && <small className="dictation-message listening">{t('listening')}</small>}
      {error && <small className="dictation-message error">{error}</small>}
    </div>
  )
}
