import React from 'react'
import { Dumbbell, Trophy } from 'lucide-react'
import { formatDate } from '../../../utils'

export const ProgressView = ({ locale, maxDuration, powerlifting, powerliftingTotal, recent, stats, t, weightProgress }) => (
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
            <div className="bar" style={{ height: `${Math.max(12, ((workout.duration || 0) / maxDuration) * 100)}%` }} />
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
      {weightProgress.history.length ? (
        <>
          <div className="weight-chart">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={t('weightHistory')}>
              <line x1="6" y1="88" x2="94" y2="88" />
              <polyline points={weightProgress.polyline} />
              {weightProgress.history.map((workout, index) => (
                <circle
                  key={workout.id}
                  cx={weightProgress.points[index].x}
                  cy={weightProgress.points[index].y}
                  r="2"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          </div>
          <div className="weight-chart-labels">
            {weightProgress.history.map(workout => (
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
