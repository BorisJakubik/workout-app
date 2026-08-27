import type { RefObject } from 'react'
import type { Exercise } from '../../../types'
import type { Translate } from '../NotesDictation/NotesDictation.types'

export interface ExerciseDropdownViewProps { canShowAll: boolean; dropdownRef: RefObject<HTMLDivElement | null>; onExpand: () => void; onSelect: (name: string) => void; onToggle: () => void; open: boolean; t: Translate; value: string; visibleExercises: Exercise[] }
