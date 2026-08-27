import React from 'react'
import { Activity, Accessibility, BicepsFlexed, Dumbbell, Footprints, PersonStanding, Weight, Zap } from 'lucide-react'
import type { CategoryIconViewProps } from './CategoryIconView.types'

export const categoryIconOptions = [
  { id: 'bench', labelKey: 'iconBenchPress', Icon: Dumbbell },
  { id: 'squat', labelKey: 'iconSquat', Icon: PersonStanding },
  { id: 'deadlift', labelKey: 'iconDeadlift', Icon: Weight },
  { id: 'arms', labelKey: 'iconArms', Icon: BicepsFlexed },
  { id: 'legs', labelKey: 'iconLegs', Icon: Footprints },
  { id: 'full-body', labelKey: 'iconFullBody', Icon: Accessibility },
  { id: 'conditioning', labelKey: 'iconConditioning', Icon: Zap },
  { id: 'cardio', labelKey: 'iconCardio', Icon: Activity },
]

export const CategoryIcon = ({ name = 'bench', ...props }: CategoryIconViewProps) => {
  const Icon = categoryIconOptions.find(option => option.id === name)?.Icon || Dumbbell
  return <Icon {...props} />
}
