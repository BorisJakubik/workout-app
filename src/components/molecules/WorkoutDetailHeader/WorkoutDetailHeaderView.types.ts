import type { RefObject } from 'react'
import type { Workout } from '../../../types'
import type { Translate } from '../NotesDictation/NotesDictation.types'

export interface WorkoutDetailHeaderViewProps {
  editing: boolean
  menuOpen: boolean
  menuRef: RefObject<HTMLDivElement | null>
  onBack: () => void
  onCancelEdit: () => void
  onDeleteRequest: () => void
  onEdit: () => void
  onMenuToggle: () => void
  onNameChange: (name: string) => void
  onSave: () => void
  isValid: boolean
  t: Translate
  workout: Workout
}
