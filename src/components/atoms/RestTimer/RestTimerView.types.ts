import type { Translate } from '../../molecules/NotesDictation/NotesDictation.types'

export interface RestTimerViewProps {
  activeDots: number
  formattedTime: string
  isFinished: boolean
  isRunning: boolean
  onComplete: () => void
  onPause: () => void
  onReset: () => void
  onResume: () => void
  t: Translate
}
