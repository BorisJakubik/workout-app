import type { Profile, Theme, WeightUnit } from '../../../types'

export interface SettingsContainerProps {
  profile: Required<Profile>
  theme: Theme
  weightUnit: WeightUnit
  onSave: (profile: Required<Profile>) => void
  onThemeChange: (theme: Theme) => void
  onWeightUnitChange: (unit: WeightUnit) => void
}
