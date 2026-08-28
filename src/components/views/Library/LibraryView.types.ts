import type { SubmitEvent } from 'react'
import type { Category, Exercise } from '../../../types'
import type { Translate } from '../../molecules/NotesDictation/NotesDictation.types'

export interface LibraryDeleteItem {
  id: string
  name: string
  type: 'category' | 'exercise'
}
export interface LibraryViewProps {
  categories: Category[]
  categoryIcon: string
  categoryId: string
  categoryName: string
  collapsedCategories: Record<string, boolean>
  deleteItem: LibraryDeleteItem | null
  editedName: string
  editingId: string | null
  exerciseName: string
  exercises: Exercise[]
  t: Translate
  onBeginRename: (category: Category) => void
  onCancelDelete: () => void
  onCategoryIconChange: (icon: string) => void
  onCategoryIdChange: (id: string) => void
  onCategoryNameChange: (name: string) => void
  onConfirmDelete: () => void
  onEditedNameChange: (name: string) => void
  onExerciseNameChange: (name: string) => void
  onIconChange: (payload: { id: string; icon: string }) => void
  onRemoveCategory: (category: Category) => void
  onRemoveExercise: (exercise: Exercise) => void
  onSaveRename: () => void
  onSubmitCategory: (event: SubmitEvent) => void
  onSubmitExercise: (event: SubmitEvent) => void
  onToggleCategory: (id: string) => void
}
