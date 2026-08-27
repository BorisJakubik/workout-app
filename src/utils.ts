export const formatDate = (value, locale = 'sk-SK') => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(value))
export const toDateInputValue = value => {
  const date = value ? new Date(value) : new Date()
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export const formatDuration = totalMinutes => {
  const minutes = Math.max(0, Math.floor(Number(totalMinutes) || 0))
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const remainingMinutes = minutes % 60

  return days > 0 ? `${days} d ${hours} h ${remainingMinutes} min` : `${hours} h ${remainingMinutes} min`
}

export const POUNDS_PER_KILOGRAM = 2.20462

export const weightFromKg = (value, unit = 'kg') => {
  if (value == null || value === '') return value
  const weight = Number(value)
  const displayedWeight = unit === 'lbs' ? weight * POUNDS_PER_KILOGRAM : weight
  return Number(displayedWeight.toFixed(2))
}

export const weightToKg = (value, unit = 'kg') => {
  if (value == null || value === '') return value
  const weight = Number(String(value).replace(',', '.'))
  return unit === 'lbs' ? Number((weight / POUNDS_PER_KILOGRAM).toFixed(8)) : weight
}

const isFilledNumber = value => value !== '' && value != null && Number.isFinite(Number(value))

export const isValidWorkout = workout =>
  Boolean(
    workout?.name?.trim() &&
      isFilledNumber(workout.duration) &&
      Number(workout.duration) > 0 &&
      workout.exercises?.length &&
      workout.exercises.every(
        exercise =>
          exercise.name?.trim() &&
          exercise.sets?.length &&
          exercise.sets.every(set => isFilledNumber(set.reps) && Number(set.reps) > 0),
      ),
  )
