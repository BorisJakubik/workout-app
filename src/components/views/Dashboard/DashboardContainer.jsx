import React from 'react'
import { useTranslation } from '../../../i18n'
import { DashboardView } from './DashboardView'

export const DashboardContainer = props => {
  const { t } = useTranslation()
  return <DashboardView {...props} t={t} />
}

export { DashboardContainer as Dashboard }
