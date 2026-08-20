import React from 'react'
import { WorkoutRow } from '../../molecules/WorkoutRow/WorkoutRowContainer'
import { CalendarView } from '../../molecules/Calendar/CalendarContainer'

export const HistoryView = ({ workouts, openWorkout, t }) => {
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
        {workouts.map(workout => (
          <WorkoutRow key={workout.id} workout={workout} onClick={() => openWorkout(workout)} />
        ))}
      </div>
    </section>
  )
}
