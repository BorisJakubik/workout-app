import type { Profile, Theme, WeightUnit } from '../../../types'
import type { Translate } from '../../molecules/NotesDictation/NotesDictation.types'
import type { SubmitEvent } from 'react'
export interface SettingsViewProps {
  draft: Required<Profile>
  onFieldChange: (field: keyof Required<Profile>, value: string) => void
  onPhotoSelect: (file?: File) => void
  onSubmit: (event: SubmitEvent) => void
  onThemeChange: (theme: Theme) => void
  onWeightUnitChange: (unit: WeightUnit) => void
  saved: boolean
  t: Translate
  theme: Theme
  weightUnit: WeightUnit
}
