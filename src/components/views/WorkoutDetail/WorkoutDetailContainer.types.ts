import type { Exercise, WeightUnit, Workout } from '../../../types'

export interface WorkoutDetailContainerProps {
  workout: Workout
  exercises: Exercise[]
  calorieWeight: number
  editing: boolean
  onEditingChange: (editing: boolean) => void
  onBack: () => void
  onSave: (workout: Workout) => void
  onDelete: () => void
  weightUnit: WeightUnit
}
