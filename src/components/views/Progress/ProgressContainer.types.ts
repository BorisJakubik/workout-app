import type { WeightUnit, Workout } from '../../../types'
import type { DashboardStats } from '../Dashboard/DashboardContainer.types'

export interface ProgressContainerProps {
  workouts: Workout[]
  stats: DashboardStats
  weightUnit: WeightUnit
}
