import React from 'react'
import { useTranslation } from '../../../i18n'
import { RatingStarsView } from './RatingStarsView'

export const RatingStarsContainer = props => {
  const { t } = useTranslation()
  return <RatingStarsView {...props} t={t} />
}

export { RatingStarsContainer as RatingStars }
