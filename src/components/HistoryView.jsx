import React from 'react';
import { WorkoutRow } from './WorkoutRow';

export const HistoryView = ({ workouts, openWorkout }) => (
  <section className="page">
    <p className="eyebrow">TVOJA CESTA</p>
    <h1>História</h1>
    <p className="muted">Ťuknutím otvoríš všetky cviky a série tréningu.</p>
    <div className="history-list">
      {workouts.map(workout => (
        <WorkoutRow key={workout.id} workout={workout} onClick={() => openWorkout(workout)} />
      ))}
    </div>
  </section>
);
