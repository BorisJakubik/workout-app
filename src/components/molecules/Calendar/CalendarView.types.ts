import type { Workout } from '../../../types'
import type { Translate } from '../NotesDictation/NotesDictation.types'

export interface CalendarViewProps {
  cells: Array<number | null>
  changeMonth: (amount: number) => void
  embedded: boolean
  locale: string
  openWorkout: (workout: Workout) => void
  selectDay: (day: number) => void
  selectedDate: string
  selectedWorkouts: Workout[]
  t: Translate
  today: Date
  visibleMonth: Date
  weekdays: string[]
  workoutDates: Set<string>
}
