import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ value = 0, onChange, size = 22 }) => (
  <div className="rating-stars" aria-label={`Hodnotenie ${value} z 5`}>
    {[1, 2, 3, 4, 5].map(star => {
      const StarWrapper = onChange ? 'button' : 'span';
      return (
        <StarWrapper
          key={star}
          type={onChange ? 'button' : undefined}
          className={star <= value ? 'selected' : ''}
          onClick={onChange ? () => onChange(star === value ? 0 : star) : undefined}
          aria-label={`${star} hviezdičiek`}
        >
          <Star size={size} fill={star <= value ? 'currentColor' : 'none'} />
        </StarWrapper>
      );
    })}
  </div>
);
