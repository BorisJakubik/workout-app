import React from 'react'
import { useTranslation } from '../../../i18n'
import { WorkoutRowView } from './WorkoutRowView'
import type { WorkoutRowContainerProps } from './WorkoutRowContainer.types'

export const WorkoutRowContainer = ({ workout, onClick }: WorkoutRowContainerProps) => {
  const { t, locale } = useTranslation()
  return (
    <WorkoutRowView
      locale={locale}
      onClick={onClick}
      setCount={workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)}
      t={t}
      workout={workout}
    />
  )
}

export { WorkoutRowContainer as WorkoutRow }
