import type { Workout } from '../../../types'

export interface HistoryContainerProps {
  workouts: Workout[]
  openWorkout: (workout: Workout) => void
}
