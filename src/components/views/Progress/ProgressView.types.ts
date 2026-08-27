import type { WeightUnit, Workout } from '../../../types'
import type { DashboardStats } from '../Dashboard/DashboardContainer.types'
import type { Translate } from '../../molecules/NotesDictation/NotesDictation.types'

export interface ProgressPoint { x: number; y: number }
export type ProgressWorkout = Workout & { value?: number }
export interface ProgressSeries { history: ProgressWorkout[]; points: ProgressPoint[]; polyline: string }
export interface ProgressLift { key: string; value: number }
export interface ProgressViewProps {
  bigThreeProgress: ProgressSeries
  bodyFatProgress: ProgressSeries
  locale: string
  maxDuration: number
  powerlifting: ProgressLift[]
  powerliftingTotal: number
  recent: Workout[]
  stats: DashboardStats
  t: Translate
  weightProgress: ProgressSeries
  weightUnit: WeightUnit
}
