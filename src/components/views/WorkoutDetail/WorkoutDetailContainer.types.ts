import type { Exercise, WeightUnit, Workout } from '../../../types'

export interface WorkoutDetailContainerProps {
  workout: Workout
  exercises: Exercise[]
  calorieWeight: number
  onBack: () => void
  onSave: (workout: Workout) => void
  onDelete: () => void
  weightUnit: WeightUnit
}
