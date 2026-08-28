import type { Translate } from '../../molecules/NotesDictation/NotesDictation.types'

export interface RatingStarsViewProps {
  value?: number
  onChange?: (value: number) => void
  size?: number
  t: Translate
}
