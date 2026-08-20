import React, { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Plus, Trash2, X } from 'lucide-react'
import { RatingStars } from './RatingStars'
import { toDateInputValue } from '../utils'
import { useTranslation } from '../i18n'

export const WorkoutEditor = ({ draft, exercises, setDraft, finish, cancel }) => {
  const { t } = useTranslation()
  const categoryExercises = exercises.filter(exercise => exercise.categoryId === draft.categoryId)
  const otherExercises = exercises.filter(exercise => exercise.categoryId !== draft.categoryId)
  const [showAllExercises, setShowAllExercises] = useState(false)
  const [exerciseDropdownOpen, setExerciseDropdownOpen] = useState(false)
  const exerciseDropdownRef = useRef(null)
  const [chosen, setChosen] = useState(categoryExercises[0]?.name || exercises[0]?.name || '')
  const visibleExercises = showAllExercises || categoryExercises.length === 0 ? [...categoryExercises, ...otherExercises] : categoryExercises
  useEffect(() => {
    if (!exerciseDropdownOpen) return undefined
    const closeDropdown = event => {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      if (event.type === 'pointerdown' && exerciseDropdownRef.current?.contains(event.target)) return
      setExerciseDropdownOpen(false)
    }
    document.addEventListener('pointerdown', closeDropdown)
    document.addEventListener('keydown', closeDropdown)
    return () => {
      document.removeEventListener('pointerdown', closeDropdown)
      document.removeEventListener('keydown', closeDropdown)
    }
  }, [exerciseDropdownOpen])
  const updateSet = (exerciseId, setIndex, field, value) =>
    setDraft({
      ...draft,
      exercises: draft.exercises.map(exercise =>
        exercise.id !== exerciseId
          ? exercise
          : { ...exercise, sets: exercise.sets.map((set, index) => (index === setIndex ? { ...set, [field]: Math.max(0, Number(value)) } : set)) },
      ),
    })
  const addExercise = () =>
    chosen && setDraft({ ...draft, exercises: [...draft.exercises, { id: crypto.randomUUID(), name: chosen, sets: [{ reps: 8, weight: 0 }] }] })
  const addSet = id =>
    setDraft({
      ...draft,
      exercises: draft.exercises.map(exercise =>
        exercise.id === id ? { ...exercise, sets: [...exercise.sets, { reps: 8, weight: exercise.sets.at(-1)?.weight || 0 }] } : exercise,
      ),
    })
  return (
    <div className="app-shell editor">
      <header className="editor-header">
        <button className="icon-btn" onClick={cancel}>
          <X />
        </button>
        <div className="active-title">
          <p className="eyebrow">{t('activeWorkout')}</p>
          <input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} aria-label={t('chooseWorkout')} />
        </div>
        <button className="finish-top" onClick={finish}>
          <Check size={18} /> {t('done')}
        </button>
      </header>
      <main>
        <div className="live-banner">
          <span className="pulse" />
          <div>
            <strong>{t('workoutInProgress')}</strong>
            <small>{t('savedToRedux')}</small>
          </div>
          <span className="timer">LIVE</span>
        </div>
        <section className="workout-meta-card">
          <label>
            {t('workoutDate')}
            <input
              className="date-input"
              type="date"
              value={toDateInputValue(draft.date)}
              onChange={event => setDraft({ ...draft, date: `${event.target.value}T12:00:00` })}
            />
          </label>
          <label>
            {t('workoutTime')}{' '}
            <span>
              <input
                type="number"
                min="0"
                value={draft.duration || ''}
                placeholder="0"
                onChange={event => setDraft({ ...draft, duration: Math.max(0, Number(event.target.value)) })}
              />{' '}
              min
            </span>
          </label>
          <label>
            <span>
              {t('currentWeight')} <small>{t('optional')}</small>
            </span>
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
            <span>
              {t('bodyFatPercentage')} <small>{t('optional')}</small>
            </span>
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
          <div className="rating-field">
            <span>
              {t('rating')} <small>{t('optional')}</small>
            </span>
            <RatingStars value={draft.rating || 0} onChange={rating => setDraft({ ...draft, rating })} />
          </div>
          <label className="notes-field">
            {t('notes')}
            <textarea
              value={draft.notes || ''}
              onChange={event => setDraft({ ...draft, notes: event.target.value })}
              placeholder={t('notesPlaceholder')}
            />
          </label>
        </section>
        {draft.exercises.map((exercise, exerciseIndex) => (
          <article className="exercise-card" key={exercise.id}>
            <div className="exercise-title">
              <span>{String(exerciseIndex + 1).padStart(2, '0')}</span>
              <input
                value={exercise.name}
                onChange={event =>
                  setDraft({
                    ...draft,
                    exercises: draft.exercises.map(item => (item.id === exercise.id ? { ...item, name: event.target.value } : item)),
                  })
                }
              />
              <button onClick={() => setDraft({ ...draft, exercises: draft.exercises.filter(item => item.id !== exercise.id) })}>
                <Trash2 size={17} />
              </button>
            </div>
            <div className="set-head">
              <span>{t('set')}</span>
              <span>KG</span>
              <span>{t('reps')}</span>
              <span />
            </div>
            {exercise.sets.map((set, index) => (
              <div className="set-row" key={index}>
                <span className="set-index">{index + 1}</span>
                <input type="number" value={set.weight} onChange={event => updateSet(exercise.id, index, 'weight', event.target.value)} />
                <input type="number" value={set.reps} onChange={event => updateSet(exercise.id, index, 'reps', event.target.value)} />
                <span className="set-check">
                  <Check size={16} />
                </span>
              </div>
            ))}
            <button className="add-set" onClick={() => addSet(exercise.id)}>
              <Plus size={16} /> {t('addSet')}
            </button>
          </article>
        ))}
        <div className="exercise-picker">
          <div className="exercise-dropdown" ref={exerciseDropdownRef}>
            <button
              className="exercise-dropdown-trigger"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={exerciseDropdownOpen}
              onClick={() => setExerciseDropdownOpen(open => !open)}
            >
              <span>{chosen}</span>
              <ChevronDown size={17} />
            </button>
            {exerciseDropdownOpen && (
              <div className="exercise-dropdown-menu" role="listbox">
                {visibleExercises.map(exercise => (
                  <button
                    className={chosen === exercise.name ? 'selected' : ''}
                    type="button"
                    role="option"
                    aria-selected={chosen === exercise.name}
                    key={exercise.id}
                    onClick={() => {
                      setChosen(exercise.name)
                      setExerciseDropdownOpen(false)
                    }}
                  >
                    {exercise.name}
                    {chosen === exercise.name && <Check size={15} />}
                  </button>
                ))}
                {!showAllExercises && categoryExercises.length > 0 && otherExercises.length > 0 && (
                  <button className="expand-exercises" type="button" onClick={() => setShowAllExercises(true)}>
                    <span>•••</span> {t('showAllExercises')}
                  </button>
                )}
              </div>
            )}
          </div>
          <button onClick={addExercise}>
            <Plus /> {t('addExercise')}
          </button>
        </div>
        <button className="finish-workout" onClick={finish}>
          <Check /> {t('finishWorkout')}
        </button>
      </main>
    </div>
  )
}
