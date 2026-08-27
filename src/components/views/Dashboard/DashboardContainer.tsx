import React from 'react'
import { useTranslation } from '../../../i18n'
import { DashboardView } from './DashboardView'
import type { DashboardContainerProps } from './DashboardContainer.types'

export const DashboardContainer = (props: DashboardContainerProps) => {
  const { t } = useTranslation()
  return <DashboardView {...props} t={t} />
}

export { DashboardContainer as Dashboard }
