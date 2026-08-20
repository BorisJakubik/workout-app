import React, { useState } from 'react'
import { useTranslation } from '../../../i18n'
import { WorkoutEditorView } from './WorkoutEditorView'

export const WorkoutEditorContainer = ({ draft, exercises, setDraft, finish, cancel }) => {
  const { t } = useTranslation()
  const categoryExercises = exercises.filter(exercise => exercise.categoryId === draft.categoryId)
  const [workoutDetailsOpen, setWorkoutDetailsOpen] = useState(false)
  const [collapsedExercises, setCollapsedExercises] = useState(() => new Set())
  const [chosen, setChosen] = useState(categoryExercises[0]?.name || exercises[0]?.name || '')
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
    chosen && setDraft({ ...draft, exercises: [...draft.exercises, { id: crypto.randomUUID(), name: chosen, sets: [{ reps: 10, weight: 0 }] }] })
  const addSet = id =>
    setDraft({
      ...draft,
      exercises: draft.exercises.map(exercise =>
        exercise.id === id ? { ...exercise, sets: [...exercise.sets, { reps: 10, weight: exercise.sets.at(-1)?.weight || 0 }] } : exercise,
      ),
    })
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
      exercises={exercises}
      finish={finish}
      setChosen={setChosen}
      setDraft={setDraft}
      setWorkoutDetailsOpen={setWorkoutDetailsOpen}
      t={t}
      toggleExercise={toggleExercise}
      updateSet={updateSet}
      workoutDetailsOpen={workoutDetailsOpen}
    />
  )
}

export { WorkoutEditorContainer as WorkoutEditor }
