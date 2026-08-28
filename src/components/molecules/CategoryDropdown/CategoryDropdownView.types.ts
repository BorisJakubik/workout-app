import type { RefObject } from 'react'
import type { Category } from '../../../types'
import type { Translate } from '../NotesDictation/NotesDictation.types'

export interface CategoryDropdownViewProps {
  categories: Category[]
  dropdownRef: RefObject<HTMLDivElement | null>
  onSelect: (id: string) => void
  onToggle: () => void
  open: boolean
  t: Translate
  value: string
}
