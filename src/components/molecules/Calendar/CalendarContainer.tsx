import React, { useMemo, useState } from 'react'
import { toDateInputValue } from '../../../utils'
import { useTranslation } from '../../../i18n'
import { CalendarView } from './CalendarView'
import type { CalendarContainerProps } from './CalendarContainer.types'

export const CalendarContainer = ({ workouts, openWorkout, embedded = false }: CalendarContainerProps) => {
  const { t, locale, weekdays } = useTranslation()
  const today = new Date()
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(today))
  const workoutDates = useMemo(() => new Set(workouts.map(workout => toDateInputValue(workout.date))), [workouts])
  const leadingDays = (new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay() + 6) % 7
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate()
  const cells = [...Array(leadingDays).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
  const selectedWorkouts = workouts.filter(workout => toDateInputValue(workout.date) === selectedDate)
  const changeMonth = amount => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + amount, 1))
  const selectDay = day => setSelectedDate(toDateInputValue(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day)))
  return (
    <CalendarView
      cells={cells}
      changeMonth={changeMonth}
      embedded={embedded}
      locale={locale}
      openWorkout={openWorkout}
      selectDay={selectDay}
      selectedDate={selectedDate}
      selectedWorkouts={selectedWorkouts}
      t={t}
      today={today}
      visibleMonth={visibleMonth}
      weekdays={weekdays}
      workoutDates={workoutDates}
    />
  )
}

export { CalendarContainer as CalendarView }
