import React, { useEffect, useRef, useState } from 'react'
import { Check, ChevronLeft, Edit3, EllipsisVertical, Plus, Trash2, X } from 'lucide-react'
import { RatingStars } from './RatingStars'
import { toDateInputValue } from '../utils'
import { useTranslation } from '../i18n'

const STRENGTH_TRAINING_MET = 6

export const WorkoutDetail = ({ workout, calorieWeight, onBack, onSave, onDelete }) => {
  const { t, locale } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(workout)
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const menuRef = useRef(null)
  const displayedWorkout = editing ? draft : workout
  const displayedCalorieWeight = displayedWorkout.bodyWeight ?? calorieWeight
  const caloriesBurned = Math.round(Number(displayedWorkout.duration || 0) * (STRENGTH_TRAINING_MET * 3.5 * displayedCalorieWeight))
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
  useEffect(() => {
    if (!menuOpen) return undefined
    const closeMenu = event => {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      if (event.type === 'pointerdown' && menuRef.current?.contains(event.target)) return
      setMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [menuOpen])
  useEffect(() => {
    if (!deleteModalOpen) return undefined
    const closeModal = event => {
      if (event.key === 'Escape') setDeleteModalOpen(false)
    }
    document.addEventListener('keydown', closeModal)
    return () => document.removeEventListener('keydown', closeModal)
  }, [deleteModalOpen])

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
          <div className="workout-actions" ref={menuRef}>
            <button
              className="icon-btn workout-actions-trigger"
              aria-label={t('workoutActions')}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(open => !open)}
            >
              <EllipsisVertical />
            </button>
            {menuOpen && (
              <div className="workout-actions-menu" role="menu">
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    setEditing(true)
                  }}
                >
                  <Edit3 size={16} /> {t('edit')}
                </button>
                <button
                  className="danger"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    setDeleteModalOpen(true)
                  }}
                >
                  <Trash2 size={16} /> {t('deleteWorkout')}
                </button>
              </div>
            )}
          </div>
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
          <div className="detail-calories">
            <span>{t('caloriesBurned')}</span>
            <strong>{caloriesBurned.toLocaleString(locale)} kcal</strong>
            <small>{t('calorieCalculation', { met: STRENGTH_TRAINING_MET, weight: displayedCalorieWeight })}</small>
          </div>
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
          {editing ? (
            <div className="detail-body-metrics editing">
              <label>
                {t('currentWeight')} <small>{t('optional')}</small>
                <span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={draft.bodyWeight ?? ''}
                    placeholder="—"
                    onChange={event => setDraft({ ...draft, bodyWeight: event.target.value === '' ? null : Math.max(0, Number(event.target.value)) })}
                  />{' '}
                  kg
                </span>
              </label>
              <label>
                {t('bodyFatPercentage')} <small>{t('optional')}</small>
                <span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={draft.bodyFatPercentage ?? ''}
                    placeholder="—"
                    onChange={event =>
                      setDraft({
                        ...draft,
                        bodyFatPercentage: event.target.value === '' ? null : Math.min(100, Math.max(0, Number(event.target.value))),
                      })
                    }
                  />{' '}
                  %
                </span>
              </label>
            </div>
          ) : (
            (displayedWorkout.bodyWeight != null || displayedWorkout.bodyFatPercentage != null) && (
              <div className="detail-body-metrics">
                {displayedWorkout.bodyWeight != null && (
                  <span>
                    {t('currentWeight')} <strong>{displayedWorkout.bodyWeight} kg</strong>
                  </span>
                )}
                {displayedWorkout.bodyFatPercentage != null && (
                  <span>
                    {t('bodyFatPercentage')} <strong>{displayedWorkout.bodyFatPercentage}%</strong>
                  </span>
                )}
              </div>
            )
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
      {deleteModalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setDeleteModalOpen(false)
          }}
        >
          <div
            className="delete-workout-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-workout-title"
            aria-describedby="delete-workout-description"
          >
            <div className="delete-workout-icon">
              <Trash2 size={22} />
            </div>
            <div>
              <p className="eyebrow">{t('deleteWorkout')}</p>
              <h2 id="delete-workout-title">{t('deleteWorkoutTitle')}</h2>
              <p id="delete-workout-description">{t('deleteWorkoutConfirm')}</p>
            </div>
            <div className="delete-workout-modal-actions">
              <button className="modal-cancel" onClick={() => setDeleteModalOpen(false)} autoFocus>
                {t('cancel')}
              </button>
              <button className="modal-delete" onClick={onDelete}>
                <Trash2 size={16} /> {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
