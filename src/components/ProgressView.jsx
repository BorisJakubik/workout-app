import React from 'react'
import { Dumbbell, Trophy } from 'lucide-react'
import { formatDate } from '../utils'
import { useTranslation } from '../i18n'

export const ProgressView = ({ workouts, stats }) => {
  const { t, locale } = useTranslation()
  const recent = workouts.slice(0, 6).reverse()
  const max = Math.max(1, ...recent.map(workout => workout.duration || 0))
  const normalizeName = name =>
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
  const highestSetFor = aliases =>
    Math.max(
      0,
      ...workouts.flatMap(workout =>
        workout.exercises
          .filter(exercise => aliases.some(alias => normalizeName(exercise.name).includes(alias)))
          .flatMap(exercise => exercise.sets.map(set => Number(set.weight || 0))),
      ),
    )
  const powerlifting = [
    { key: 'benchPress', value: highestSetFor(['bench press', 'benchpress']) },
    { key: 'deadlift', value: highestSetFor(['mrtvy tah', 'deadlift']) },
    { key: 'squat', value: highestSetFor(['drep', 'squat']) },
  ]
  const powerliftingTotal = powerlifting.reduce((sum, lift) => sum + lift.value, 0)
  const weightHistory = workouts.filter(workout => workout.bodyWeight != null).sort((a, b) => new Date(a.date) - new Date(b.date))
  const weightValues = weightHistory.map(workout => Number(workout.bodyWeight))
  const minWeight = weightValues.length ? Math.min(...weightValues) : 0
  const maxWeight = weightValues.length ? Math.max(...weightValues) : 1
  const weightRange = Math.max(1, maxWeight - minWeight)
  const weightPoints = weightHistory
    .map((workout, index) => {
      const x = weightHistory.length === 1 ? 50 : 6 + (index / (weightHistory.length - 1)) * 88
      const y = weightHistory.length === 1 ? 50 : 88 - ((Number(workout.bodyWeight) - minWeight) / weightRange) * 76
      return `${x},${y}`
    })
    .join(' ')
  return (
    <section className="page">
      <p className="eyebrow">{t('results')}</p>
      <h1>{t('yourProgress')}</h1>
      <p className="muted">{t('consistency')}</p>
      <div className="progress-card">
        <div className="section-heading">
          <h2>{t('workoutTimeChart')}</h2>
        </div>
        <div className="chart">
          {recent.map(workout => (
            <div className="bar-wrap" key={workout.id}>
              <div className="bar" style={{ height: `${Math.max(12, ((workout.duration || 0) / max) * 100)}%` }} />
              <small>{formatDate(workout.date, locale)}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="powerlifting-card">
        <div className="powerlifting-heading">
          <div>
            <p className="eyebrow">{t('powerlifting')}</p>
            <h2>{t('powerliftingBigThree')}</h2>
          </div>
          <Dumbbell />
        </div>
        <div className="powerlifting-lifts">
          {powerlifting.map(lift => (
            <div className="powerlifting-lift" key={lift.key}>
              <span>{t(lift.key)}</span>
              <strong>{lift.value} kg</strong>
              <small>{t('heaviestSet')}</small>
            </div>
          ))}
        </div>
        <div className="powerlifting-total">
          <span>{t('powerliftingTotal')}</span>
          <strong>{powerliftingTotal} kg</strong>
        </div>
      </div>
      <div className="weight-progress-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('bodyWeightProgress')}</p>
            <h2>{t('weightHistory')}</h2>
          </div>
        </div>
        {weightHistory.length ? (
          <>
            <div className="weight-chart">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={t('weightHistory')}>
                <line x1="6" y1="88" x2="94" y2="88" />
                <polyline points={weightPoints} />
                {weightHistory.map((workout, index) => {
                  const [x, y] = weightPoints.split(' ')[index].split(',')
                  return <circle key={workout.id} cx={x} cy={y} r="2" vectorEffect="non-scaling-stroke" />
                })}
              </svg>
            </div>
            <div className="weight-chart-labels">
              {weightHistory.map(workout => (
                <div key={workout.id}>
                  <strong>{workout.bodyWeight} kg</strong>
                  <small>{formatDate(workout.date, locale)}</small>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="weight-chart-empty">{t('noWeightData')}</p>
        )}
      </div>
      <div className="milestone">
        <Trophy />
        <div>
          <small>{t('personalRecord')}</small>
          <strong>{stats.best} kg</strong>
          <span>{t('highestWeight')}</span>
        </div>
      </div>
    </section>
  )
}
