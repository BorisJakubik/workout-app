import React from 'react'
import { WorkoutRow } from './WorkoutRow'
import { useTranslation } from '../i18n'

export const HistoryView = ({ workouts, openWorkout }) => {
  const { t } = useTranslation()
  return (
    <section className="page">
      <p className="eyebrow">{t('workoutJourney')}</p>
      <h1>{t('history')}</h1>
      <p className="muted">{t('tapHistory')}</p>
      <div className="history-list">
        {workouts.map(workout => (
          <WorkoutRow key={workout.id} workout={workout} onClick={() => openWorkout(workout)} />
        ))}
      </div>
    </section>
  )
}
