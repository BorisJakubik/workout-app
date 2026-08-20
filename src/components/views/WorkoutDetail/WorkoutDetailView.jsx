import React from 'react'
import { ChevronDown, Plus, Trash2, X } from 'lucide-react'
import { RatingStars } from '../../atoms/RatingStars/RatingStarsContainer'
import { toDateInputValue } from '../../../utils'
import { ExerciseDropdown } from '../../molecules/ExerciseDropdown/ExerciseDropdownContainer'
import { DeleteWorkoutModalView } from '../../molecules/DeleteWorkoutModal/DeleteWorkoutModalView'
import { WorkoutDetailHeaderView } from '../../molecules/WorkoutDetailHeader/WorkoutDetailHeaderView'

const STRENGTH_TRAINING_MET = 6

export const WorkoutDetailView = ({
  caloriesBurned,
  chosenExercise,
  collapsedExercises,
  deleteModalOpen,
  displayedCalorieWeight,
  displayedWorkout,
  draft,
  editing,
  exercises,
  locale,
  menuOpen,
  menuRef,
  onBack,
  onDelete,
  orderedExercises,
  save,
  setChosenExercise,
  setDeleteModalOpen,
  setDraft,
  setEditing,
  setMenuOpen,
  t,
  toggleExercise,
  updateExercise,
  updateSet,
  workout,
}) => {
  return (
    <div className="app-shell detail-page">
      <WorkoutDetailHeaderView
        editing={editing}
        menuOpen={menuOpen}
        menuRef={menuRef}
        onBack={onBack}
        onMenuToggle={() => setMenuOpen(open => !open)}
        onNameChange={name => setDraft({ ...draft, name })}
        onSave={save}
        t={t}
        workout={editing ? draft : workout}
        onCancelEdit={() => {
          setDraft(workout)
          setEditing(false)
        }}
        onEdit={() => {
          setMenuOpen(false)
          setEditing(true)
        }}
        onDeleteRequest={() => {
          setMenuOpen(false)
          setDeleteModalOpen(true)
        }}
      />
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
              <div className="detail-exercise-title-actions">
                <button
                  className="collapse-exercise"
                  type="button"
                  aria-label={collapsedExercises.has(exercise.id) ? t('expandSets') : t('collapseSets')}
                  aria-expanded={!collapsedExercises.has(exercise.id)}
                  onClick={() => toggleExercise(exercise.id)}
                >
                  <ChevronDown className={collapsedExercises.has(exercise.id) ? 'collapsed' : ''} size={18} />
                </button>
                {editing && (
                  <button type="button" onClick={() => setDraft({ ...draft, exercises: draft.exercises.filter(item => item.id !== exercise.id) })}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            {!collapsedExercises.has(exercise.id) && (
              <>
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
                      <input
                        type="number"
                        min="0"
                        value={set.reps}
                        onChange={event => updateSet(exercise.id, setIndex, 'reps', event.target.value)}
                      />
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
              </>
            )}
          </article>
        ))}
        {editing && orderedExercises.length > 0 && (
          <div className="exercise-picker detail-exercise-picker">
            <ExerciseDropdown exercises={exercises} categoryId={workout.categoryId} value={chosenExercise} onChange={setChosenExercise} />
            <button
              onClick={() => {
                if (!chosenExercise) return
                setDraft({
                  ...draft,
                  exercises: [...draft.exercises, { id: crypto.randomUUID(), name: chosenExercise, sets: [{ reps: 10, weight: 0 }] }],
                })
              }}
            >
              <Plus size={18} /> {t('addExercise')}
            </button>
          </div>
        )}
      </main>
      {deleteModalOpen && <DeleteWorkoutModalView onCancel={() => setDeleteModalOpen(false)} onDelete={onDelete} t={t} />}
    </div>
  )
}
