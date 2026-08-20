import React from 'react'
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react'
import { toDateInputValue } from '../../../utils'
import { WorkoutRow } from '../WorkoutRow/WorkoutRowContainer'

export const CalendarView = ({
  cells,
  changeMonth,
  embedded,
  locale,
  openWorkout,
  selectDay,
  selectedDate,
  selectedWorkouts,
  t,
  today,
  visibleMonth,
  weekdays,
  workoutDates,
}) => {
  const Wrapper = embedded ? 'div' : 'section'
  return (
    <Wrapper className={embedded ? 'history-calendar' : 'page calendar-page'}>
      {!embedded && (
        <>
          <p className="eyebrow">{t('trainingDays')}</p>
          <h1>{t('calendar')}</h1>
          <p className="muted">{t('trainingDaysHint')}</p>
        </>
      )}
      <div className="calendar-card">
        <div className="calendar-heading">
          <button onClick={() => changeMonth(-1)} aria-label={t('previousMonth')}>
            <ChevronLeft />
          </button>
          <h2>{new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(visibleMonth)}</h2>
          <button onClick={() => changeMonth(1)} aria-label={t('nextMonth')}>
            <ChevronRight />
          </button>
        </div>
        <div className="calendar-grid weekdays">
          {weekdays.map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="calendar-grid days">
          {cells.map((day, index) => {
            if (!day) return <span key={`empty-${index}`} />
            const date = toDateInputValue(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day))
            return (
              <button
                key={date}
                className={`${date === selectedDate ? 'selected' : ''} ${date === toDateInputValue(today) ? 'today' : ''}`}
                onClick={() => selectDay(day)}
              >
                <span>{day}</span>
                {workoutDates.has(date) && (
                  <i>
                    <Dumbbell size={10} />
                  </i>
                )}
              </button>
            )
          })}
        </div>
      </div>
      <div className="calendar-results">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('selectedDay')}</p>
            <h2>{new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(`${selectedDate}T12:00:00`))}</h2>
          </div>
        </div>
        {selectedWorkouts.length ? (
          selectedWorkouts.map(workout => <WorkoutRow key={workout.id} workout={workout} onClick={() => openWorkout(workout)} />)
        ) : (
          <div className="empty-day">{t('noWorkout')}</div>
        )}
      </div>
    </Wrapper>
  )
}
