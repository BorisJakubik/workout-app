import React from 'react'
import { Dumbbell, Trophy } from 'lucide-react'
import { formatDate, weightFromKg } from '../../../utils'

const LineProgressCard = ({ ariaLabel, emptyLabel, eyebrow, getValue, history, points, polyline, title, locale }) => (
  <div className="weight-progress-card">
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
    </div>
    {history.length ? (
      <>
        <div className="weight-chart">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
            <line x1="6" y1="88" x2="94" y2="88" />
            <polyline points={polyline} />
          </svg>
          {history.map((item, index) => (
            <span
              aria-hidden="true"
              className="weight-chart-point"
              key={item.id}
              style={{ left: `${points[index].x}%`, top: `${points[index].y}%` }}
            />
          ))}
        </div>
        <div className="weight-chart-labels">
          {history.map(item => (
            <div key={item.id}>
              <strong>{getValue(item)}</strong>
              <small>{formatDate(item.date, locale)}</small>
            </div>
          ))}
        </div>
      </>
    ) : (
      <p className="weight-chart-empty">{emptyLabel}</p>
    )}
  </div>
)

export const ProgressView = ({
  bigThreeProgress,
  bodyFatProgress,
  locale,
  maxDuration,
  powerlifting,
  powerliftingTotal,
  recent,
  stats,
  t,
  weightProgress,
  weightUnit,
}) => (
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
            <strong>
              {weightFromKg(lift.value, weightUnit)} {weightUnit}
            </strong>
            <small>{t('heaviestSet')}</small>
          </div>
        ))}
      </div>
      <div className="powerlifting-total">
        <span>{t('powerliftingTotal')}</span>
        <strong>
          {weightFromKg(powerliftingTotal, weightUnit)} {weightUnit}
        </strong>
      </div>
    </div>
    <LineProgressCard
      {...weightProgress}
      ariaLabel={t('weightHistory')}
      emptyLabel={t('noWeightData')}
      eyebrow={t('bodyWeightProgress')}
      getValue={workout => `${weightFromKg(workout.bodyWeight, weightUnit)} ${weightUnit}`}
      locale={locale}
      title={t('weightHistory')}
    />
    <LineProgressCard
      {...bigThreeProgress}
      ariaLabel={t('bigThreeTotalProgress')}
      emptyLabel={t('noBigThreeData')}
      eyebrow={t('powerlifting')}
      getValue={workout => `${weightFromKg(workout.value, weightUnit)} ${weightUnit}`}
      locale={locale}
      title={t('bigThreeTotalProgress')}
    />
    <LineProgressCard
      {...bodyFatProgress}
      ariaLabel={t('bodyFatProgress')}
      emptyLabel={t('noBodyFatData')}
      eyebrow={t('bodyFat')}
      getValue={workout => `${workout.bodyFatPercentage}%`}
      locale={locale}
      title={t('bodyFatProgress')}
    />
    <div className="milestone">
      <Trophy />
      <div>
        <small>{t('personalRecord')}</small>
        <strong>
          {weightFromKg(stats.best, weightUnit)} {weightUnit}
        </strong>
        <span>{t('highestWeight')}</span>
      </div>
    </div>
  </section>
)
