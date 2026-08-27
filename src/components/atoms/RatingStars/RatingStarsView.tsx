import React from 'react'
import { Star } from 'lucide-react'
import type { RatingStarsViewProps } from './RatingStarsView.types'

export const RatingStarsView = ({ value = 0, onChange = undefined, size = 22, t }: RatingStarsViewProps) => {
  return (
    <div className="rating-stars" aria-label={t('ratingLabel', { value })}>
      {[1, 2, 3, 4, 5].map(star => {
        const StarWrapper = onChange ? 'button' : 'span'
        return (
          <StarWrapper
            key={star}
            type={onChange ? 'button' : undefined}
            className={star <= value ? 'selected' : ''}
            onClick={onChange ? () => onChange(star === value ? 0 : star) : undefined}
            aria-label={t('starsLabel', { value: star })}
          >
            <Star size={size} fill={star <= value ? 'currentColor' : 'none'} />
          </StarWrapper>
        )
      })}
    </div>
  )
}
