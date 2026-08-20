import React, { useState } from 'react'
import { Check, ChevronLeft, Edit3, Plus, Trash2, X } from 'lucide-react'
import { RatingStars } from './RatingStars'
import { toDateInputValue } from '../utils'
import { useTranslation } from '../i18n'

export const WorkoutDetail = ({ workout, onBack, onSave }) => {
  const { t, locale } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(workout)
  const displayedWorkout = editing ? draft : workout
  const updateExercise = (exerciseId, updater) =>
    setDraft({ ...draft, exercises: draft.exercises.map(exercise => (exercise.id === exerciseId ? updater(exercise) : exercise)) })
  const updateSet = (exerciseId, setIndex, field, value) =>
    updateExercise(exerciseId, exercise => ({
      ...exercise,
      sets: exercise.sets.map((set, index) => (index === setIndex ? { ...set, [field]: Math.max(0, Number(value)) } : set)),
    }))
  const save = () => {
    if (!draft.name.trim()) return
    onSave({ ...draft, name: draft.name.trim() })
    setEditing(false)
  }

  return (
    <div className="app-shell detail-page">
      <header className="editor-header">
        <button className="icon-btn" onClick={onBack}>
          <ChevronLeft />
        </button>
        <div className="detail-header-title">
          <p className="eyebrow">{editing ? t('editWorkout') : t('workoutDetail')}</p>
          {editing ? <input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /> : <h2>{workout.name}</h2>}
        </div>
        {editing ? (
          <div className="edit-actions">
            <button
              className="icon-btn"
              onClick={() => {
                setDraft(workout)
                setEditing(false)
              }}
            >
              <X />
            </button>
            <button className="finish-top" onClick={save}>
              <Check size={18} /> {t('save')}
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
              {t('workoutDate')}
              <input
                type="date"
                value={toDateInputValue(draft.date)}
                onChange={event => setDraft({ ...draft, date: `${event.target.value}T12:00:00` })}
              />
            </label>
          ) : (
            <span>{new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(displayedWorkout.date))}</span>
          )}
          <strong>{displayedWorkout.duration} min</strong>
          <small>
            {displayedWorkout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)} {t('sets')}
          </small>
          {editing && (
            <label className="duration-edit">
              {t('duration')}{' '}
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
            <span>{t('rating')}</span>
            <RatingStars value={displayedWorkout.rating || 0} onChange={editing ? rating => setDraft({ ...draft, rating }) : undefined} />
          </div>
        </div>
        <section className="detail-notes">
          <p className="eyebrow">{t('notes')}</p>
          {editing ? (
            <textarea
              value={draft.notes || ''}
              onChange={event => setDraft({ ...draft, notes: event.target.value })}
              placeholder={t('detailNotesPlaceholder')}
            />
          ) : (
            <p>{workout.notes?.trim() || t('noNotes')}</p>
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
              <span>{t('set')}</span>
              <span>KG</span>
              <span>{t('reps')}</span>
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
                <Plus size={16} /> {t('addSet')}
              </button>
            )}
          </article>
        ))}
      </main>
    </div>
  )
}
