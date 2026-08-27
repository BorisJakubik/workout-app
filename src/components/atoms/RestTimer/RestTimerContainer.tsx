import React from 'react'
import { useTranslation } from '../../../i18n'
import { RestTimerView } from './RestTimerView'
import type { RestTimerContainerProps } from './RestTimerContainer.types'

export const RestTimerContainer = (props: RestTimerContainerProps) => {
  const { t } = useTranslation()
  const isRunning = props.restTimerState === 'running'
  const isFinished = props.restTimerState === 'finished'
  const activeDots = Math.max(0, Math.min(60, Math.round((props.remainingSeconds / props.restDurationSeconds) * 60)))
  const formattedTime = new Date(props.remainingSeconds * 1000).toISOString().slice(14, 19)
  return <RestTimerView {...props} activeDots={activeDots} formattedTime={formattedTime} isFinished={isFinished} isRunning={isRunning} t={t} />
}

export { RestTimerContainer as RestTimer }
