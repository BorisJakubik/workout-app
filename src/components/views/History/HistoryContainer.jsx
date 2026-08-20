import React from 'react'
import { useTranslation } from '../../../i18n'
import { HistoryView } from './HistoryView'

export const HistoryContainer = props => {
  const { t } = useTranslation()
  return <HistoryView {...props} t={t} />
}

export { HistoryContainer as History }
