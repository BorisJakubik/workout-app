import React from 'react'
import { ChevronRight } from 'lucide-react'
import { RatingStars } from '../../atoms/RatingStars/RatingStarsContainer'

export const WorkoutRowView = ({ locale, onClick, setCount, t, workout }) => (
  <button className="workout-row clickable-row" onClick={onClick}>
    <div className="date-box">
      <strong>{new Date(workout.date).getDate()}</strong>
      <span>{new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(workout.date)).replace('.', '')}</span>
    </div>
    <div className="row-main">
      <strong>{workout.name}</strong>
      <span>{workout.exercises.length} {t('exercises')} · {setCount} {t('sets')}</span>
    </div>
    <div className="row-volume">
      {workout.rating > 0 ? <RatingStars value={workout.rating} size={11} /> : <span>{t('noRating')}</span>}
      <strong>{workout.duration} min</strong>
    </div>
    <ChevronRight size={17} />
  </button>
)
