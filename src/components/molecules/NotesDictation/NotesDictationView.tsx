import React from 'react'
import { Mic, MicOff } from 'lucide-react'
import type { NotesDictationViewProps } from './NotesDictation.types'

export const NotesDictationView = ({
  error,
  isListening,
  isSupported,
  onStartListening,
  onStopListening,
  onValueChange,
  placeholder,
  t,
  value,
}: NotesDictationViewProps) => (
  <div className="notes-dictation">
    <textarea value={value} onChange={event => onValueChange(event.target.value)} placeholder={placeholder} />
    {isSupported ? (
      <button
        className={`dictation-button${isListening ? ' listening' : ''}`}
        type="button"
        aria-label={t(isListening ? 'stopDictation' : 'startDictation')}
        aria-pressed={isListening}
        onClick={isListening ? onStopListening : onStartListening}
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
