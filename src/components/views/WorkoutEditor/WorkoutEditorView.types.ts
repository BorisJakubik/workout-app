import type { WeightUnit, Workout } from '../../../types'
import type { Translate } from '../../molecules/NotesDictation/NotesDictation.types'
import type { EditableWorkout } from '../WorkoutDetail/WorkoutDetailView.types'

export type RestTimerState = 'idle' | 'running' | 'paused' | 'finished'
export interface WorkoutEditorViewProps {
  addExercise: () => void
  addSet: (exerciseId: string) => void
  cancel: () => void
  cancelRestart: () => void
  chosen: string
  collapsedExercises: Set<string>
  completeRestTimer: () => void
  confirmRestart: () => void
  draft: EditableWorkout
  elapsedSeconds: number
  endTimer: () => void
  exercises: { id: string; name: string; categoryId?: string | null }[]
  finish: () => void
  importDate: string
  importWorkout: () => void
  importableWorkouts: Workout[]
  isValid: boolean
  locale: string
  pauseTimer: () => void
  pauseRestTimer: () => void
  requestRestart: () => void
  resetRestTimer: () => void
  restDurationSeconds: number
  restRemainingSeconds: number
  restTimerState: RestTimerState
  restartConfirmationOpen: boolean
  removeSet: (exerciseId: string, setIndex: number) => void
  setChosen: (name: string) => void
  setDraft: (workout: EditableWorkout) => void
  setImportDate: (date: string) => void
  setWorkoutDetailsOpen: (update: boolean | ((open: boolean) => boolean)) => void
  startRestTimer: () => void
  startTimer: () => void
  t: Translate
  toggleExercise: (exerciseId: string) => void
  updateSet: (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: string) => void
  updateRestDuration: (value: string) => void
  workoutToImport?: Workout
  workoutDetailsOpen: boolean
  workoutState: 'not_started' | 'in_progress' | 'paused' | 'finished'
  weightUnit: WeightUnit
}
