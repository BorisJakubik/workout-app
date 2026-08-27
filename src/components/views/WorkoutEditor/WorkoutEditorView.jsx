import React from 'react'
import { Check, ChevronDown, Copy, Pause, Play, Plus, RotateCcw, Square, Trash2, X } from 'lucide-react'
import { RatingStars } from '../../atoms/RatingStars/RatingStarsContainer'
import { toDateInputValue, weightFromKg, weightToKg } from '../../../utils'
import { ExerciseDropdown } from '../../molecules/ExerciseDropdown/ExerciseDropdownContainer'
import { NotesDictation } from '../../molecules/NotesDictation/NotesDictation'

export const WorkoutEditorView = ({
  addExercise,
  addSet,
  cancel,
  cancelRestart,
  chosen,
  collapsedExercises,
  confirmRestart,
  draft,
  elapsedSeconds,
  endTimer,
  exercises,
  finish,
  importDate,
  importWorkout,
  importableWorkouts,
  isValid,
  locale,
  pauseTimer,
  requestRestart,
  restartConfirmationOpen,
  removeSet,
  setChosen,
  setDraft,
  setImportDate,
  setWorkoutDetailsOpen,
  startTimer,
  t,
  toggleExercise,
  updateSet,
  workoutToImport,
  workoutDetailsOpen,
  workoutState,
  weightUnit,
}) => {
  const isInProgress = workoutState === 'in_progress'
  const isPaused = workoutState === 'paused'
  const isFinished = workoutState === 'finished'
  const isTimerActive = isInProgress || isPaused
  const formattedElapsedTime = new Date(elapsedSeconds * 1000).toISOString().slice(11, 19)
  const stateTitle = isInProgress ? t('workoutInProgress') : isPaused ? t('workoutPaused') : isFinished ? t('workoutFinished') : t('workoutNotStarted')
  const stateHint = isInProgress ? t('workoutTimerRunning') : isPaused ? t('workoutTimerPaused') : isFinished ? t('workoutTimerFinished') : t('workoutTimerNotStarted')
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
        <button className="finish-top" onClick={finish} disabled={!isValid || isTimerActive}>
          <Check size={18} /> {t('done')}
        </button>
      </header>
      <main>
        <div className="live-banner">
          <span className={`pulse ${isInProgress ? '' : 'inactive'}`} />
          <div>
            <strong>{stateTitle}</strong>
            <small>{stateHint}</small>
          </div>
          <span className="timer">{formattedElapsedTime}</span>
          {isInProgress ? (
            <div className="timer-actions">
              <button className="timer-action" type="button" onClick={pauseTimer} aria-label={t('pauseWorkout')} title={t('pauseWorkout')}>
                <Pause size={15} fill="currentColor" />
              </button>
              <button className="timer-action end" type="button" onClick={endTimer} aria-label={t('endWorkout')} title={t('endWorkout')}>
                <Square size={15} fill="currentColor" />
              </button>
            </div>
          ) : isPaused ? (
            <div className="timer-actions">
              <button className="timer-action" type="button" onClick={startTimer} aria-label={t('resumeWorkout')} title={t('resumeWorkout')}>
                <Play size={15} fill="currentColor" />
              </button>
              <button className="timer-action end" type="button" onClick={endTimer} aria-label={t('endWorkout')} title={t('endWorkout')}>
                <Square size={15} fill="currentColor" />
              </button>
            </div>
          ) : !isFinished ? (
            <button className="timer-action" type="button" onClick={startTimer} aria-label={t('startWorkout')} title={t('startWorkout')}>
              <Play size={15} fill="currentColor" />
            </button>
          ) : (
            <button className="timer-action" type="button" onClick={requestRestart} aria-label={t('restartWorkout')} title={t('restartWorkout')}>
              <RotateCcw size={15} />
            </button>
          )}
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
                min="1"
                value={draft.duration ?? ''}
                placeholder="60"
                required
                disabled={isTimerActive}
                onChange={event => setDraft({ ...draft, duration: event.target.value === '' ? null : Number(event.target.value) })}
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
                <NotesDictation
                  locale={locale}
                  value={draft.notes || ''}
                  onChange={notes => setDraft({ ...draft, notes })}
                  placeholder={t('notesPlaceholder')}
                  t={t}
                />
              </label>
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
                      step={weightFromKg(5, weightUnit)}
                      value={weightFromKg(set.weight, weightUnit) ?? ''}
                      required
                      onChange={event => updateSet(exercise.id, index, 'weight', event.target.value)}
                    />
                    <input type="number" min="1" value={set.reps ?? ''} required onChange={event => updateSet(exercise.id, index, 'reps', event.target.value)} />
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
        <div className="exercise-picker">
          <ExerciseDropdown exercises={exercises} categoryId={draft.categoryId} value={chosen} onChange={setChosen} />
          <button onClick={addExercise}>
            <Plus /> {t('addExercise')}
          </button>
        </div>
        <button className="finish-workout" onClick={finish} disabled={!isValid || isTimerActive}>
          <Check /> {t('finishWorkout')}
        </button>
      </main>
      {restartConfirmationOpen && (
        <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && cancelRestart()}>
          <div className="delete-workout-modal" role="alertdialog" aria-modal="true" aria-labelledby="restart-workout-title" aria-describedby="restart-workout-description">
            <div className="restart-workout-icon">
              <RotateCcw size={22} />
            </div>
            <div>
              <p className="eyebrow">{t('restartWorkout')}</p>
              <h2 id="restart-workout-title">{t('restartWorkoutTitle')}</h2>
              <p id="restart-workout-description">{t('restartWorkoutConfirm')}</p>
            </div>
            <div className="delete-workout-modal-actions">
              <button className="modal-cancel" onClick={cancelRestart} autoFocus>
                {t('cancel')}
              </button>
              <button className="modal-confirm" onClick={confirmRestart}>
                <Play size={16} fill="currentColor" /> {t('restartWorkout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
