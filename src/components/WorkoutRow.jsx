import React from 'react';
import { ChevronRight } from 'lucide-react';
import { RatingStars } from './RatingStars';

export const WorkoutRow = ({ workout, onClick }) => (
  <button className="workout-row clickable-row" onClick={onClick}>
    <div className="date-box">
      <strong>{new Date(workout.date).getDate()}</strong>
      <span>{new Intl.DateTimeFormat('sk-SK', { month: 'short' }).format(new Date(workout.date)).replace('.', '')}</span>
    </div>
    <div className="row-main">
      <strong>{workout.name}</strong>
      <span>
        {workout.exercises.length} cviky · {workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)} sérií
      </span>
    </div>
    <div className="row-volume">
      {workout.rating > 0 ? <RatingStars value={workout.rating} size={11} /> : <span>Bez hodnotenia</span>}
      <strong>{workout.duration} min</strong>
    </div>
    <ChevronRight size={17} />
  </button>
);
