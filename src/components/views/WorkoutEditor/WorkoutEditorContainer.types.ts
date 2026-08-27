import type { Exercise, WeightUnit, Workout } from '../../../types'

export interface WorkoutEditorContainerProps {
  draft: Workout
  exercises: Exercise[]
  workouts?: Workout[]
  setDraft: (workout: Workout) => void
  finish: () => void
  cancel: () => void
  weightUnit: WeightUnit
}
