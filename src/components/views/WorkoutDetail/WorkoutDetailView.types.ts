import type { RefObject } from 'react'
import type { Exercise, WeightUnit, Workout, WorkoutExercise } from '../../../types'
import type { Translate } from '../../molecules/NotesDictation/NotesDictation.types'

export interface EditableSet {
  reps: number | null
  weight: number | null
}
export type EditableWorkoutExercise = Omit<WorkoutExercise, 'sets'> & { sets: EditableSet[] }
export type EditableWorkout = Omit<Workout, 'bodyFatPercentage' | 'bodyWeight' | 'duration' | 'exercises'> & {
  bodyFatPercentage?: number | null
  bodyWeight?: number | null
  duration: number | null
  exercises: EditableWorkoutExercise[]
}

export interface WorkoutDetailViewProps {
  caloriesBurned: number
  chosenExercise: string
  collapsedExercises: Set<string>
  deleteModalOpen: boolean
  displayedCalorieWeight: number
  displayedWorkout: EditableWorkout
  draft: EditableWorkout
  editing: boolean
  exercises: Exercise[]
  isValid: boolean
  locale: string
  menuOpen: boolean
  menuRef: RefObject<HTMLDivElement | null>
  onBack: () => void
  onDelete: () => void
  orderedExercises: Exercise[]
  save: () => void
  setChosenExercise: (name: string) => void
  setDeleteModalOpen: (open: boolean) => void
  setDraft: (workout: EditableWorkout) => void
  setEditing: (editing: boolean) => void
  setMenuOpen: (update: boolean | ((open: boolean) => boolean)) => void
  t: Translate
  toggleExercise: (exerciseId: string) => void
  updateExercise: (exerciseId: string, updater: (exercise: EditableWorkoutExercise) => EditableWorkoutExercise) => void
  updateSet: (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: string) => void
  workout: EditableWorkout
  weightUnit: WeightUnit
}
