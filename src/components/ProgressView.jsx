import React from 'react'
import { Trophy } from 'lucide-react'
import { formatDate } from '../utils'
import { useTranslation } from '../i18n'

export const ProgressView = ({ workouts, stats }) => {
  const { t, locale } = useTranslation()
  const recent = workouts.slice(0, 6).reverse()
  const max = Math.max(1, ...recent.map(workout => workout.duration || 0))
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
