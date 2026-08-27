export type Translate = (key: string, values?: Record<string, string | number>) => string

export interface NotesDictationContainerProps {
  locale: string
  onChange: (value: string) => void
  placeholder: string
  t: Translate
  value: string
}

export interface NotesDictationViewProps {
  value: string
  placeholder: string
  t: Translate
  isSupported: boolean
  isListening: boolean
  error: string
  onValueChange: (value: string) => void
  onStartListening: () => void
  onStopListening: () => void
}
