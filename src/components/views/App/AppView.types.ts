import type { RefObject } from 'react'
import type { Category, Exercise, Language, Profile, Theme, WeightUnit, Workout } from '../../../types'
import type { DashboardStats } from '../Dashboard/DashboardContainer.types'
import type { Translate } from '../../molecules/NotesDictation/NotesDictation.types'

export type Screen = 'home' | 'history' | 'progress' | 'library' | 'settings' | 'workout'
export interface WorkoutConfirmation {
  id: number
  message: string
}
export interface AppViewProps {
  activeWorkout: Workout | null
  calorieWeight: number
  categories: Category[]
  exercises: Exercise[]
  language: Language
  profile: Required<Profile>
  profileMenuOpen: boolean
  profileMenuRef: RefObject<HTMLDivElement | null>
  screen: Screen
  selectedWorkout: Workout | null
  stats: DashboardStats
  t: Translate
  theme: Theme
  workouts: Workout[]
  weightUnit: WeightUnit
  onCancelWorkout: () => void
  onDeleteWorkout: () => void
  onDismissWorkoutConfirmation: () => void
  onFinishWorkout: () => void
  onLanguageChange: () => void
  onLogout: () => void
  onProfileMenuToggle: () => void
  onSaveWorkout: (workout: Workout) => void
  onScreenChange: (screen: Screen) => void
  onStartWorkout: (categoryId: string) => void
  onThemeChange: (theme: Theme) => void
  onUpdateActiveWorkout: (workout: Workout) => void
  onUpdateProfile: (profile: Required<Profile>) => void
  onWeightUnitChange: (unit: WeightUnit) => void
  openWorkout: (workout: Workout | null) => void
  workoutConfirmation: WorkoutConfirmation | null
  error: string
  editingWorkout: boolean
  onEditingWorkoutChange: (editing: boolean) => void
}
