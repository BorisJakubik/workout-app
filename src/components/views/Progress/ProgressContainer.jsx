import React from 'react'
import { useTranslation } from '../../../i18n'
import { ProgressView } from './ProgressView'

const normalizeName = name =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const getHighestSet = (workouts, aliases) =>
  Math.max(
    0,
    ...workouts.flatMap(workout =>
      workout.exercises
        .filter(exercise => aliases.some(alias => normalizeName(exercise.name).includes(alias)))
        .flatMap(exercise => exercise.sets.map(set => Number(set.weight || 0))),
    ),
  )

const getWeightProgress = workouts => {
  const history = workouts.filter(workout => workout.bodyWeight != null).sort((a, b) => new Date(a.date) - new Date(b.date))
  const values = history.map(workout => Number(workout.bodyWeight))
  const min = values.length ? Math.min(...values) : 0
  const range = Math.max(1, (values.length ? Math.max(...values) : 1) - min)
  const points = history.map((workout, index) => ({
    x: history.length === 1 ? 50 : 6 + (index / (history.length - 1)) * 88,
    y: history.length === 1 ? 50 : 88 - ((Number(workout.bodyWeight) - min) / range) * 76,
  }))
  return { history, points, polyline: points.map(point => `${point.x},${point.y}`).join(' ') }
}

export const ProgressContainer = ({ workouts, stats }) => {
  const { t, locale } = useTranslation()
  const recent = workouts.slice(0, 6).reverse()
  const powerlifting = [
    { key: 'benchPress', value: getHighestSet(workouts, ['bench press', 'benchpress']) },
    { key: 'deadlift', value: getHighestSet(workouts, ['mrtvy tah', 'deadlift']) },
    { key: 'squat', value: getHighestSet(workouts, ['drep', 'squat']) },
  ]
  return (
    <ProgressView
      locale={locale}
      maxDuration={Math.max(1, ...recent.map(workout => workout.duration || 0))}
      powerlifting={powerlifting}
      powerliftingTotal={powerlifting.reduce((sum, lift) => sum + lift.value, 0)}
      recent={recent}
      stats={stats}
      t={t}
      weightProgress={getWeightProgress(workouts)}
    />
  )
}

export { ProgressContainer as ProgressView }
