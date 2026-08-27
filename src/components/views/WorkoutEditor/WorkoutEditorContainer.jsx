import React, { useEffect, useState } from 'react'
import { useTranslation } from '../../../i18n'
import { WorkoutEditorView } from './WorkoutEditorView'
import { isValidWorkout, weightToKg } from '../../../utils'

export const WorkoutEditorContainer = ({ draft, exercises, workouts = [], setDraft, finish, cancel, weightUnit }) => {
  const { t, locale } = useTranslation()
  const categoryExercises = exercises.filter(exercise => exercise.categoryId === draft.categoryId)
  const selectedExerciseNames = new Set(draft.exercises.map(exercise => exercise.name.trim().toLocaleLowerCase()))
  const availableExercises = exercises.filter(
    (exercise, index, allExercises) =>
      !selectedExerciseNames.has(exercise.name.trim().toLocaleLowerCase()) &&
      allExercises.findIndex(item => item.name.trim().toLocaleLowerCase() === exercise.name.trim().toLocaleLowerCase()) === index,
  )
  const [workoutDetailsOpen, setWorkoutDetailsOpen] = useState(false)
  const [collapsedExercises, setCollapsedExercises] = useState(() => new Set())
  const [chosen, setChosen] = useState(categoryExercises[0]?.name || exercises[0]?.name || '')
  const [importDate, setImportDate] = useState('')
  const [restartConfirmationOpen, setRestartConfirmationOpen] = useState(false)
  const [restDurationSeconds, setRestDurationSeconds] = useState(60)
  const [restRemainingSeconds, setRestRemainingSeconds] = useState(60)
  const [restTimerState, setRestTimerState] = useState('idle')
  const [restTimerEndsAt, setRestTimerEndsAt] = useState(null)
  const workoutState = draft.workoutState || 'not_started'
  const legacyElapsedSeconds = draft.startedAt && draft.endedAt ? Math.max(0, Math.floor((draft.endedAt - draft.startedAt) / 1000)) : 0
  const storedElapsedSeconds = Number(draft.timerElapsedSeconds ?? legacyElapsedSeconds)
  const [elapsedSeconds, setElapsedSeconds] = useState(() => storedElapsedSeconds)
  useEffect(() => {
    if (workoutState !== 'in_progress' || !draft.startedAt) {
      setElapsedSeconds(storedElapsedSeconds)
      return undefined
    }
    const updateElapsedTime = () => setElapsedSeconds(storedElapsedSeconds + Math.max(0, Math.floor((Date.now() - draft.startedAt) / 1000)))
    updateElapsedTime()
    const interval = window.setInterval(updateElapsedTime, 1000)
    return () => window.clearInterval(interval)
  }, [draft.startedAt, storedElapsedSeconds, workoutState])
  useEffect(() => {
    if (restTimerState !== 'running' || !restTimerEndsAt) return undefined
    const updateRestTimer = () => {
      const remaining = Math.max(0, Math.ceil((restTimerEndsAt - Date.now()) / 1000))
      setRestRemainingSeconds(remaining)
      if (remaining === 0) {
        setRestTimerState('finished')
        setRestTimerEndsAt(null)
      }
    }
    updateRestTimer()
    const interval = window.setInterval(updateRestTimer, 250)
    return () => window.clearInterval(interval)
  }, [restTimerEndsAt, restTimerState])
  useEffect(() => {
    if (!availableExercises.some(exercise => exercise.name === chosen)) {
      setChosen(availableExercises.find(exercise => exercise.categoryId === draft.categoryId)?.name || availableExercises[0]?.name || '')
    }
  }, [availableExercises, chosen, draft.categoryId])
  const draftDate = draft.date.slice(0, 10)
  const importableWorkouts = workouts
    .filter(workout => workout.completed && workout.date.slice(0, 10) < draftDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  const workoutToImport = importableWorkouts.find(workout => workout.date.slice(0, 10) === importDate)
  const updateSet = (exerciseId, setIndex, field, value) =>
    setDraft({
      ...draft,
      exercises: draft.exercises.map(exercise =>
        exercise.id !== exerciseId
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets.map((set, index) =>
                index === setIndex
                  ? {
                      ...set,
                      [field]:
                        value === '' ? null : field === 'weight' ? weightToKg(value, weightUnit) : Math.max(0, Number(value)),
                    }
                  : set,
              ),
            },
      ),
    })
  const addExercise = () => {
    if (!availableExercises.some(exercise => exercise.name === chosen)) return
    setDraft({ ...draft, exercises: [...draft.exercises, { id: crypto.randomUUID(), name: chosen, sets: [{ reps: 10, weight: 0 }] }] })
  }
  const addSet = id =>
    setDraft({
      ...draft,
      exercises: draft.exercises.map(exercise =>
        exercise.id === id ? { ...exercise, sets: [...exercise.sets, { reps: 10, weight: exercise.sets.at(-1)?.weight ?? 0 }] } : exercise,
      ),
    })
  const removeSet = (exerciseId, setIndex) =>
    setDraft({
      ...draft,
      exercises: draft.exercises.map(exercise =>
        exercise.id === exerciseId ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) } : exercise,
      ),
    })
  const importWorkout = () => {
    if (!workoutToImport) return
    setDraft({
      ...draft,
      exercises: workoutToImport.exercises.map(exercise => ({
        ...exercise,
        id: crypto.randomUUID(),
        sets: exercise.sets.map(set => ({ ...set })),
      })),
    })
    setCollapsedExercises(new Set())
  }
  const toggleExercise = exerciseId =>
    setCollapsedExercises(current => {
      const next = new Set(current)
      if (next.has(exerciseId)) next.delete(exerciseId)
      else next.add(exerciseId)
      return next
    })
  const startTimer = () => {
    const startedAt = Date.now()
    const timerElapsedSeconds = workoutState === 'paused' ? storedElapsedSeconds : 0
    setElapsedSeconds(timerElapsedSeconds)
    setDraft({ ...draft, workoutState: 'in_progress', startedAt, endedAt: null, timerElapsedSeconds })
  }
  const pauseTimer = () => {
    const timerElapsedSeconds = storedElapsedSeconds + Math.max(0, Math.floor((Date.now() - draft.startedAt) / 1000))
    setElapsedSeconds(timerElapsedSeconds)
    setDraft({ ...draft, workoutState: 'paused', startedAt: null, timerElapsedSeconds })
  }
  const endTimer = () => {
    const endedAt = Date.now()
    const timerElapsedSeconds = Number.isFinite(draft.startedAt)
      ? storedElapsedSeconds + Math.max(0, Math.floor((endedAt - draft.startedAt) / 1000))
      : storedElapsedSeconds
    setElapsedSeconds(timerElapsedSeconds)
    setDraft({ ...draft, workoutState: 'finished', startedAt: null, endedAt, timerElapsedSeconds, duration: Math.max(1, Math.ceil(timerElapsedSeconds / 60)) })
  }
  const updateRestDuration = value => {
    const seconds = value === '' ? 0 : Math.max(0, Math.round(Number(value) * 60))
    setRestDurationSeconds(seconds)
    if (restTimerState !== 'running') setRestRemainingSeconds(seconds)
  }
  const startRestTimer = () => {
    const seconds = restTimerState === 'paused' ? restRemainingSeconds : restDurationSeconds
    if (seconds <= 0) return
    setRestRemainingSeconds(seconds)
    setRestTimerEndsAt(Date.now() + seconds * 1000)
    setRestTimerState('running')
  }
  const pauseRestTimer = () => {
    if (restTimerEndsAt) setRestRemainingSeconds(Math.max(0, Math.ceil((restTimerEndsAt - Date.now()) / 1000)))
    setRestTimerEndsAt(null)
    setRestTimerState('paused')
  }
  const resetRestTimer = () => {
    setRestTimerEndsAt(null)
    setRestRemainingSeconds(restDurationSeconds)
    setRestTimerState('idle')
  }
  const completeRestTimer = () => {
    setRestRemainingSeconds(restDurationSeconds)
    setRestTimerState('idle')
  }
  return (
    <WorkoutEditorView
      addExercise={addExercise}
      addSet={addSet}
      cancel={cancel}
      chosen={chosen}
      collapsedExercises={collapsedExercises}
      draft={draft}
      exercises={availableExercises}
      finish={finish}
      importDate={importDate}
      importWorkout={importWorkout}
      importableWorkouts={importableWorkouts}
      isValid={isValidWorkout(draft)}
      locale={locale}
      removeSet={removeSet}
      setChosen={setChosen}
      setDraft={setDraft}
      setImportDate={setImportDate}
      setWorkoutDetailsOpen={setWorkoutDetailsOpen}
      pauseTimer={pauseTimer}
      pauseRestTimer={pauseRestTimer}
      restartConfirmationOpen={restartConfirmationOpen}
      resetRestTimer={resetRestTimer}
      restDurationSeconds={restDurationSeconds}
      restRemainingSeconds={restRemainingSeconds}
      restTimerState={restTimerState}
      requestRestart={() => setRestartConfirmationOpen(true)}
      cancelRestart={() => setRestartConfirmationOpen(false)}
      completeRestTimer={completeRestTimer}
      confirmRestart={() => {
        setRestartConfirmationOpen(false)
        startTimer()
      }}
      startTimer={startTimer}
      startRestTimer={startRestTimer}
      t={t}
      toggleExercise={toggleExercise}
      updateSet={updateSet}
      updateRestDuration={updateRestDuration}
      endTimer={endTimer}
      elapsedSeconds={elapsedSeconds}
      workoutState={workoutState}
      workoutToImport={workoutToImport}
      workoutDetailsOpen={workoutDetailsOpen}
      weightUnit={weightUnit}
    />
  )
}

export { WorkoutEditorContainer as WorkoutEditor }
