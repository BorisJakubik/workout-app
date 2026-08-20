import React from 'react'
import { Activity, Dumbbell, Plus, Trophy } from 'lucide-react'
import { WorkoutRow } from './WorkoutRow'
import { CategoryIcon } from './CategoryIcon'
import { useTranslation } from '../i18n'

export const Dashboard = ({ workouts, categories, exercises, stats, startWorkout, setScreen, openWorkout }) => {
  const { t } = useTranslation()
  return (
    <>
      <section className="hero">
        <p className="eyebrow">{t('today')}</p>
        <h1>
          {t('letsTrain')}
          <br />
          <span>Boris.</span>
        </h1>
        <p className="muted">{t('everySetCounts')}</p>
      </section>
      <section className="stats-grid">
        <div className="stat-card">
          <Activity />
          <strong>{stats.count}</strong>
          <span>{t('workouts')}</span>
        </div>
        <div className="stat-card">
          <Dumbbell />
          <strong>{stats.totalMinutes} min</strong>
          <span>{t('totalTime')}</span>
        </div>
        <div className="stat-card accent">
          <Trophy />
          <strong>{stats.best} kg</strong>
          <span>{t('highestWeight')}</span>
        </div>
      </section>
      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('todaysWorkout')}</p>
            <h2>{t('chooseWorkout')}</h2>
          </div>
          <button className="text-btn" onClick={() => setScreen('library')}>
            {t('edit')}
          </button>
        </div>
        <div className="workout-types">
          {categories.map((category, index) => (
            <button className="type-card" key={category.id} onClick={() => startWorkout(category.id)}>
              <span className="type-number">{String(index + 1).padStart(2, '0')}</span>
              <CategoryIcon name={category.icon} />
              <div>
                <strong>{category.name}</strong>
                <small>
                  {exercises.filter(exercise => exercise.categoryId === category.id).length} {t('exercises')}
                </small>
              </div>
              <Plus size={19} />
            </button>
          ))}
        </div>
      </section>
      <section className="recent">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('recent')}</p>
            <h2>{t('recentWorkouts')}</h2>
          </div>
          <button className="text-btn" onClick={() => setScreen('history')}>
            {t('showAll')}
          </button>
        </div>
        {workouts.slice(0, 2).map(workout => (
          <WorkoutRow key={workout.id} workout={workout} onClick={() => openWorkout(workout)} />
        ))}
      </section>
    </>
  )
}
