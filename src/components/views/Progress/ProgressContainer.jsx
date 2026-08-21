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

const getProgress = (history, getValue) => {
  const values = history.map(getValue)
  const min = values.length ? Math.min(...values) : 0
  const range = Math.max(1, (values.length ? Math.max(...values) : 1) - min)
  const points = history.map((item, index) => ({
    x: history.length === 1 ? 50 : 6 + (index / (history.length - 1)) * 88,
    y: history.length === 1 ? 50 : 88 - ((getValue(item) - min) / range) * 76,
  }))
  return { history, points, polyline: points.map(point => `${point.x},${point.y}`).join(' ') }
}

const getMeasurementProgress = (workouts, key) =>
  getProgress(
    workouts.filter(workout => workout[key] != null).sort((a, b) => new Date(a.date) - new Date(b.date)),
    workout => Number(workout[key]),
  )

const getBigThreeProgress = workouts => {
  const best = { benchPress: 0, deadlift: 0, squat: 0 }
  const lifts = [
    { key: 'benchPress', aliases: ['bench press', 'benchpress'] },
    { key: 'deadlift', aliases: ['mrtvy tah', 'deadlift'] },
    { key: 'squat', aliases: ['drep', 'squat'] },
  ]
  const history = workouts
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .flatMap(workout => {
      let changed = false
      lifts.forEach(lift => {
        const value = getHighestSet([workout], lift.aliases)
        if (value > best[lift.key]) {
          best[lift.key] = value
          changed = true
        }
      })
      return changed ? [{ ...workout, value: Object.values(best).reduce((sum, value) => sum + value, 0) }] : []
    })
  return getProgress(history, workout => workout.value)
}

export const ProgressContainer = ({ workouts, stats, weightUnit }) => {
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
      bigThreeProgress={getBigThreeProgress(workouts)}
      bodyFatProgress={getMeasurementProgress(workouts, 'bodyFatPercentage')}
      recent={recent}
      stats={stats}
      t={t}
      weightProgress={getMeasurementProgress(workouts, 'bodyWeight')}
      weightUnit={weightUnit}
    />
  )
}

export { ProgressContainer as ProgressView }
