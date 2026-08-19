import React from 'react';
import { Trophy } from 'lucide-react';
import { formatDate } from '../utils';

export const ProgressView = ({ workouts, stats }) => {
  const recent = workouts.slice(0, 6).reverse();
  const max = Math.max(1, ...recent.map(workout => workout.duration || 0));
  return (
    <section className="page">
      <p className="eyebrow">VÝSLEDKY</p>
      <h1>Tvoj progres</h1>
      <p className="muted">Konzistentnosť mení čísla na výsledky.</p>
      <div className="progress-card">
        <div className="section-heading">
          <h2>Čas tréningov</h2>
        </div>
        <div className="chart">
          {recent.map(workout => (
            <div className="bar-wrap" key={workout.id}>
              <div className="bar" style={{ height: `${Math.max(12, ((workout.duration || 0) / max) * 100)}%` }} />
              <small>{formatDate(workout.date)}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="milestone">
        <Trophy />
        <div>
          <small>OSOBNÝ REKORD</small>
          <strong>{stats.best} kg</strong>
          <span>Najvyššia zaznamenaná váha</span>
        </div>
      </div>
    </section>
  );
};
