import type { Workout } from '../../../types'
import type { Translate } from '../NotesDictation/NotesDictation.types'

export interface WorkoutRowViewProps {
  locale: string
  onClick: () => void
  setCount: number
  t: Translate
  workout: Workout
}
