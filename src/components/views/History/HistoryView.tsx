import React, { useState } from 'react'
import { WorkoutRow } from '../../molecules/WorkoutRow/WorkoutRowContainer'
import { CalendarView } from '../../molecules/Calendar/CalendarContainer'
import type { HistoryViewProps } from './HistoryView.types'

export const HistoryView = ({ workouts, openWorkout, t }: HistoryViewProps) => {
  const [visibleWorkoutsCount, setVisibleWorkoutsCount] = useState(5)
  const visibleWorkouts = workouts.slice(0, visibleWorkoutsCount)
  const hasMoreWorkouts = visibleWorkoutsCount < workouts.length

  return (
    <section className="page">
      <p className="eyebrow">{t('workoutJourney')}</p>
      <h1>{t('history')}</h1>
      <p className="muted">{t('tapHistory')}</p>
      <div className="section-heading history-calendar-heading">
        <div>
          <p className="eyebrow">{t('trainingDays')}</p>
          <h2>{t('calendar')}</h2>
        </div>
      </div>
      <CalendarView workouts={workouts} openWorkout={openWorkout} embedded />
      <div className="history-list">
        {visibleWorkouts.map(workout => (
          <WorkoutRow key={workout.id} workout={workout} onClick={() => openWorkout(workout)} />
        ))}
        {hasMoreWorkouts && (
          <button className="history-show-more" onClick={() => setVisibleWorkoutsCount(count => count + 5)}>
            {t('showMore')}
          </button>
        )}
      </div>
    </section>
  )
}
