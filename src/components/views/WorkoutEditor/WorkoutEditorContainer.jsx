import React, { useEffect, useState } from 'react'
import { useTranslation } from '../../../i18n'
import { WorkoutEditorView } from './WorkoutEditorView'
import { weightToKg } from '../../../utils'

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
                        field === 'weight' && value === ''
                          ? undefined
                          : Math.max(0, field === 'weight' ? weightToKg(value, weightUnit) : Number(value)),
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
      locale={locale}
      removeSet={removeSet}
      setChosen={setChosen}
      setDraft={setDraft}
      setImportDate={setImportDate}
      setWorkoutDetailsOpen={setWorkoutDetailsOpen}
      t={t}
      toggleExercise={toggleExercise}
      updateSet={updateSet}
      workoutToImport={workoutToImport}
      workoutDetailsOpen={workoutDetailsOpen}
      weightUnit={weightUnit}
    />
  )
}

export { WorkoutEditorContainer as WorkoutEditor }
