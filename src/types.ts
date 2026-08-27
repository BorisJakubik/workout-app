export type Language = 'sk' | 'en'
export type Theme = 'dark' | 'light'
export type WeightUnit = 'kg' | 'lbs'
export type WorkoutState = 'not_started' | 'in_progress' | 'paused' | 'finished'

export interface Category {
  id: string
  name: string
  icon: string
}

export interface ExerciseSet {
  reps: number
  weight: number
}

export interface Exercise {
  id: string
  name: string
  categoryId?: string | null
  exerciseId?: string | null
  sets?: ExerciseSet[]
}

export interface WorkoutExercise extends Exercise {
  sets: ExerciseSet[]
}

export interface Workout {
  id: string | number
  categoryId?: string | null
  name: string
  date: string
  duration: number
  completed: boolean
  exercises: WorkoutExercise[]
  workoutState?: WorkoutState
  startedAt?: string | number | null
  endedAt?: string | number | null
  timerElapsedSeconds?: number
  notes?: string
  rating?: number
  bodyWeight?: number | null
  bodyFatPercentage?: number | null
}

export interface Profile {
  name: string
  surname: string
  email?: string
  photo: string
}

export interface FitnessState {
  language: Language
  theme: Theme
  weightUnit: WeightUnit
  profile: Profile
  categories: Category[]
  exercises: Exercise[]
  workouts: Workout[]
  activeWorkout: Workout | null
}
