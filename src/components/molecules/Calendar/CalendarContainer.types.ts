import type { Workout } from '../../../types'

export interface CalendarContainerProps {
  workouts: Workout[]
  openWorkout: (workout: Workout) => void
  embedded?: boolean
}
