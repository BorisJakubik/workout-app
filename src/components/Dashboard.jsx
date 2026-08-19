import React from 'react';
import { Activity, Dumbbell, Plus, Trophy } from 'lucide-react';
import { WorkoutRow } from './WorkoutRow';

export const Dashboard = ({ workouts, categories, exercises, stats, startWorkout, setScreen, openWorkout }) => (
  <>
    <section className="hero">
      <p className="eyebrow">DNES</p>
      <h1>
        Poďme makať,
        <br />
        <span>Boris.</span>
      </h1>
      <p className="muted">Každá séria sa počíta.</p>
    </section>
    <section className="stats-grid">
      <div className="stat-card">
        <Activity />
        <strong>{stats.count}</strong>
        <span>tréningov</span>
      </div>
      <div className="stat-card">
        <Dumbbell />
        <strong>{stats.totalMinutes} min</strong>
        <span>čas spolu</span>
      </div>
      <div className="stat-card accent">
        <Trophy />
        <strong>{stats.best} kg</strong>
        <span>najvyššia váha</span>
      </div>
    </section>
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">DNEŠNÝ TRÉNING</p>
          <h2>Vyber si tréning</h2>
        </div>
        <button className="text-btn" onClick={() => setScreen('library')}>
          Upraviť
        </button>
      </div>
      <div className="workout-types">
        {categories.map((category, index) => (
          <button className="type-card" key={category.id} onClick={() => startWorkout(category.id)}>
            <span className="type-number">{String(index + 1).padStart(2, '0')}</span>
            <Dumbbell />
            <div>
              <strong>{category.name}</strong>
              <small>{exercises.filter(exercise => exercise.categoryId === category.id).length} cvikov</small>
            </div>
            <Plus size={19} />
          </button>
        ))}
      </div>
    </section>
    <section className="recent">
      <div className="section-heading">
        <div>
          <p className="eyebrow">NEDÁVNO</p>
          <h2>Posledné tréningy</h2>
        </div>
        <button className="text-btn" onClick={() => setScreen('history')}>
          Zobraziť všetko
        </button>
      </div>
      {workouts.slice(0, 2).map(workout => (
        <WorkoutRow key={workout.id} workout={workout} onClick={() => openWorkout(workout)} />
      ))}
    </section>
  </>
);
