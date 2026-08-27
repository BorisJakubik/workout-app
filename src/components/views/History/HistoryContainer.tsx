import React from 'react'
import { useTranslation } from '../../../i18n'
import { HistoryView } from './HistoryView'
import type { HistoryContainerProps } from './HistoryContainer.types'

export const HistoryContainer = (props: HistoryContainerProps) => {
  const { t } = useTranslation()
  return <HistoryView {...props} t={t} />
}

export { HistoryContainer as History }
