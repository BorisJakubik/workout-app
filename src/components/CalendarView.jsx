import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import { toDateInputValue } from '../utils';
import { WorkoutRow } from './WorkoutRow';

const weekdays = ['PO', 'UT', 'ST', 'ŠT', 'PI', 'SO', 'NE'];

export const CalendarView = ({ workouts, openWorkout }) => {
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(today));
  const workoutDates = useMemo(() => new Set(workouts.map(workout => toDateInputValue(workout.date))), [workouts]);
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const leadingDays = (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay() + 6) % 7;
  const cells = [...Array(leadingDays).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  const selectedWorkouts = workouts.filter(workout => toDateInputValue(workout.date) === selectedDate);
  const changeMonth = amount => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + amount, 1));
  const selectDay = day => setSelectedDate(toDateInputValue(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day)));

  return (
    <section className="page calendar-page">
      <p className="eyebrow">TRÉNINGOVÉ DNI</p>
      <h1>Kalendár</h1>
      <p className="muted">Všetky dni, počas ktorých si cvičil.</p>
      <div className="calendar-card">
        <div className="calendar-heading">
          <button onClick={() => changeMonth(-1)} aria-label="Predchádzajúci mesiac">
            <ChevronLeft />
          </button>
          <h2>{new Intl.DateTimeFormat('sk-SK', { month: 'long', year: 'numeric' }).format(visibleMonth)}</h2>
          <button onClick={() => changeMonth(1)} aria-label="Nasledujúci mesiac">
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
            if (!day) return <span key={`empty-${index}`} />;
            const date = toDateInputValue(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day));
            const trained = workoutDates.has(date);
            return (
              <button
                key={date}
                className={`${date === selectedDate ? 'selected' : ''} ${date === toDateInputValue(today) ? 'today' : ''}`}
                onClick={() => selectDay(day)}
              >
                <span>{day}</span>
                {trained && (
                  <i>
                    <Dumbbell size={10} />
                  </i>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="calendar-results">
        <div className="section-heading">
          <div>
            <p className="eyebrow">VYBRANÝ DEŇ</p>
            <h2>{new Intl.DateTimeFormat('sk-SK', { dateStyle: 'long' }).format(new Date(`${selectedDate}T12:00:00`))}</h2>
          </div>
        </div>
        {selectedWorkouts.length ? (
          selectedWorkouts.map(workout => <WorkoutRow key={workout.id} workout={workout} onClick={() => openWorkout(workout)} />)
        ) : (
          <div className="empty-day">V tento deň nemáš zaznamenaný tréning.</div>
        )}
      </div>
    </section>
  );
};
