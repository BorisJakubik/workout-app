import React from 'react'
import { useTranslation } from '../../../i18n'
import { RatingStarsView } from './RatingStarsView'
import type { RatingStarsContainerProps } from './RatingStarsContainer.types'

export const RatingStarsContainer = (props: RatingStarsContainerProps) => {
  const { t } = useTranslation()
  return <RatingStarsView {...props} t={t} />
}

export { RatingStarsContainer as RatingStars }
