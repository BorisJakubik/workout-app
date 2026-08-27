import type { Category, Exercise, WeightUnit, Workout } from '../../../types'

export interface DashboardStats {
  count: number
  totalMinutes: number
  best: number
  bestExerciseKey: string | null
}

export interface DashboardContainerProps {
  workouts: Workout[]
  categories: Category[]
  exercises: Exercise[]
  stats: DashboardStats
  profileName: string
  startWorkout: (categoryId: string) => void
  setScreen: (screen: string) => void
  openWorkout: (workout: Workout) => void
  weightUnit: WeightUnit
}
