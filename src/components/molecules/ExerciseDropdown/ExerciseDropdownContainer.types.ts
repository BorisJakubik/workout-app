import type { Exercise } from '../../../types'

export interface ExerciseDropdownContainerProps {
  exercises: Exercise[]
  categoryId?: string | null
  value: string
  onChange: (exerciseName: string) => void
}
