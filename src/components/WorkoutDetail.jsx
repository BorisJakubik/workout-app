import React, { useState } from 'react';
import { Check, ChevronLeft, Edit3, Plus, Trash2, X } from 'lucide-react';
import { RatingStars } from './RatingStars';
import { toDateInputValue } from '../utils';

export const WorkoutDetail = ({ workout, onBack, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(workout);
  const displayedWorkout = editing ? draft : workout;
  const updateExercise = (exerciseId, updater) =>
    setDraft({ ...draft, exercises: draft.exercises.map(exercise => (exercise.id === exerciseId ? updater(exercise) : exercise)) });
  const updateSet = (exerciseId, setIndex, field, value) =>
    updateExercise(exerciseId, exercise => ({
      ...exercise,
      sets: exercise.sets.map((set, index) => (index === setIndex ? { ...set, [field]: Math.max(0, Number(value)) } : set)),
    }));
  const save = () => {
    if (!draft.name.trim()) return;
    onSave({ ...draft, name: draft.name.trim() });
    setEditing(false);
  };

  return (
    <div className="app-shell detail-page">
      <header className="editor-header">
        <button className="icon-btn" onClick={onBack}>
          <ChevronLeft />
        </button>
        <div className="detail-header-title">
          <p className="eyebrow">{editing ? 'ÚPRAVA TRÉNINGU' : 'DETAIL TRÉNINGU'}</p>
          {editing ? <input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /> : <h2>{workout.name}</h2>}
        </div>
        {editing ? (
          <div className="edit-actions">
            <button
              className="icon-btn"
              onClick={() => {
                setDraft(workout);
                setEditing(false);
              }}
            >
              <X />
            </button>
            <button className="finish-top" onClick={save}>
              <Check size={18} /> Uložiť
            </button>
          </div>
        ) : (
          <button className="finish-top" onClick={() => setEditing(true)}>
            <Edit3 size={16} /> Edit
          </button>
        )}
      </header>
      <main>
        <div className="detail-hero">
          {editing ? (
            <label className="detail-date-edit">
              Dátum
              <input
                type="date"
                value={toDateInputValue(draft.date)}
                onChange={event => setDraft({ ...draft, date: `${event.target.value}T12:00:00` })}
              />
            </label>
          ) : (
            <span>{new Intl.DateTimeFormat('sk-SK', { dateStyle: 'long' }).format(new Date(displayedWorkout.date))}</span>
          )}
          <strong>{displayedWorkout.duration} min</strong>
          <small>{displayedWorkout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)} sérií</small>
          {editing && (
            <label className="duration-edit">
              Trvanie{' '}
              <input
                type="number"
                min="1"
                value={draft.duration}
                onChange={event => setDraft({ ...draft, duration: Math.max(1, Number(event.target.value)) })}
              />{' '}
              min
            </label>
          )}
          <div className="detail-rating">
            <span>Hodnotenie</span>
            <RatingStars value={displayedWorkout.rating || 0} onChange={editing ? rating => setDraft({ ...draft, rating }) : undefined} />
          </div>
        </div>
        <section className="detail-notes">
          <p className="eyebrow">POZNÁMKY</p>
          {editing ? (
            <textarea
              value={draft.notes || ''}
              onChange={event => setDraft({ ...draft, notes: event.target.value })}
              placeholder="Zapíš si poznámky k tréningu…"
            />
          ) : (
            <p>{workout.notes?.trim() || 'K tomuto tréningu zatiaľ nemáš poznámky.'}</p>
          )}
        </section>
        {displayedWorkout.exercises.map((exercise, index) => (
          <article className="detail-exercise" key={exercise.id}>
            <div className="detail-exercise-title">
              <span>{String(index + 1).padStart(2, '0')}</span>
              {editing ? (
                <input value={exercise.name} onChange={event => updateExercise(exercise.id, item => ({ ...item, name: event.target.value }))} />
              ) : (
                <h2>{exercise.name}</h2>
              )}
              {editing && (
                <button onClick={() => setDraft({ ...draft, exercises: draft.exercises.filter(item => item.id !== exercise.id) })}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className={`detail-set header ${editing ? 'editing' : ''}`}>
              <span>Séria</span>
              <span>Váha</span>
              <span>Opakovania</span>
              {editing && <span />}
            </div>
            {exercise.sets.map((set, setIndex) => (
              <div className={`detail-set ${editing ? 'editing' : ''}`} key={setIndex}>
                <strong>{setIndex + 1}</strong>
                {editing ? (
                  <input
                    type="number"
                    min="0"
                    value={set.weight}
                    onChange={event => updateSet(exercise.id, setIndex, 'weight', event.target.value)}
                  />
                ) : (
                  <span>{set.weight} kg</span>
                )}
                {editing ? (
                  <input type="number" min="0" value={set.reps} onChange={event => updateSet(exercise.id, setIndex, 'reps', event.target.value)} />
                ) : (
                  <span>{set.reps}×</span>
                )}
                {editing && (
                  <button
                    onClick={() =>
                      updateExercise(exercise.id, item => ({ ...item, sets: item.sets.filter((_, currentIndex) => currentIndex !== setIndex) }))
                    }
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
            {editing && (
              <button
                className="add-set"
                onClick={() =>
                  updateExercise(exercise.id, item => ({ ...item, sets: [...item.sets, { weight: item.sets.at(-1)?.weight || 0, reps: 8 }] }))
                }
              >
                <Plus size={16} /> Pridať sériu
              </button>
            )}
          </article>
        ))}
      </main>
    </div>
  );
};
