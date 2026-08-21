import React from 'react'
import { Check, ChevronDown, Copy, Plus, Trash2, X } from 'lucide-react'
import { RatingStars } from '../../atoms/RatingStars/RatingStarsContainer'
import { toDateInputValue, weightFromKg, weightToKg } from '../../../utils'
import { ExerciseDropdown } from '../../molecules/ExerciseDropdown/ExerciseDropdownContainer'

export const WorkoutEditorView = ({
  addExercise,
  addSet,
  cancel,
  chosen,
  collapsedExercises,
  draft,
  exercises,
  finish,
  importDate,
  importWorkout,
  importableWorkouts,
  removeSet,
  setChosen,
  setDraft,
  setImportDate,
  setWorkoutDetailsOpen,
  t,
  toggleExercise,
  updateSet,
  workoutToImport,
  workoutDetailsOpen,
  weightUnit,
}) => {
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
                value={draft.duration || 60}
                placeholder="0"
                onChange={event => setDraft({ ...draft, duration: Math.max(0, Number(event.target.value)) })}
              />{' '}
              min
            </span>
          </label>
          <button
            className="workout-details-toggle"
            type="button"
            aria-expanded={workoutDetailsOpen}
            onClick={() => setWorkoutDetailsOpen(open => !open)}
          >
            <span>
              <strong>{t('additionalWorkoutDetails')}</strong>
              <small>{workoutDetailsOpen ? t('collapseDetails') : t('expandDetails')}</small>
            </span>
            <ChevronDown className={workoutDetailsOpen ? 'open' : ''} size={19} />
          </button>
          {workoutDetailsOpen && (
            <>
              <label>
                <span>
                  {t('currentWeight')} <small>{t('optional')}</small>
                </span>
                <span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={weightFromKg(draft.bodyWeight ?? 80, weightUnit)}
                    placeholder="—"
                    onChange={event =>
                      setDraft({
                        ...draft,
                        bodyWeight: event.target.value === '' ? null : Math.max(0, weightToKg(event.target.value, weightUnit)),
                      })
                    }
                  />{' '}
                  {weightUnit}
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
            </>
          )}
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
              <div className="exercise-title-actions">
                <button
                  className="collapse-exercise"
                  aria-label={collapsedExercises.has(exercise.id) ? t('expandSets') : t('collapseSets')}
                  aria-expanded={!collapsedExercises.has(exercise.id)}
                  onClick={() => toggleExercise(exercise.id)}
                >
                  <ChevronDown className={collapsedExercises.has(exercise.id) ? 'collapsed' : ''} size={18} />
                </button>
                <button onClick={() => setDraft({ ...draft, exercises: draft.exercises.filter(item => item.id !== exercise.id) })}>
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
            {!collapsedExercises.has(exercise.id) && (
              <div className="exercise-sets">
                <div className="set-head">
                  <span>{t('set')}</span>
                  <span>{weightUnit.toUpperCase()}</span>
                  <span>{t('reps')}</span>
                  <span />
                </div>
                {exercise.sets.map((set, index) => (
                  <div className="set-row" key={index}>
                    <span className="set-index">{index + 1}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={weightFromKg(set.weight, weightUnit)}
                      onChange={event => updateSet(exercise.id, index, 'weight', event.target.value)}
                    />
                    <input type="number" value={set.reps} onChange={event => updateSet(exercise.id, index, 'reps', event.target.value)} />
                    <button
                      className="set-delete"
                      type="button"
                      aria-label={t('deleteSet', { number: index + 1 })}
                      onClick={() => removeSet(exercise.id, index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button className="add-set" onClick={() => addSet(exercise.id)}>
                  <Plus size={16} /> {t('addSet')}
                </button>
              </div>
            )}
          </article>
        ))}
        <section className="workout-import">
          <div className="workout-import-heading">
            <Copy size={18} />
            <span>
              <strong>{t('importWorkout')}</strong>
              <small>{t('importWorkoutHint')}</small>
            </span>
          </div>
          <div className="workout-import-controls">
            <input
              aria-label={t('importWorkoutDate')}
              className="date-input"
              type="date"
              max={importableWorkouts[0]?.date.slice(0, 10)}
              value={importDate}
              onChange={event => setImportDate(event.target.value)}
            />
            <button type="button" disabled={!workoutToImport} onClick={importWorkout}>
              <Copy size={17} /> {t('import')}
            </button>
          </div>
          {importDate && !workoutToImport && <small className="workout-import-status">{t('noWorkoutToImport')}</small>}
          {!importDate && importableWorkouts.length === 0 && <small className="workout-import-status">{t('noPreviousWorkouts')}</small>}
          {workoutToImport && (
            <small className="workout-import-status available">
              {t('workoutReadyToImport', { name: workoutToImport.name, count: workoutToImport.exercises.length })}
            </small>
          )}
        </section>
        <div className="exercise-picker">
          <ExerciseDropdown exercises={exercises} categoryId={draft.categoryId} value={chosen} onChange={setChosen} />
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
