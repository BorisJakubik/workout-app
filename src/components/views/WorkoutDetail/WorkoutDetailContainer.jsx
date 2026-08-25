import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../../i18n'
import { WorkoutDetailView } from './WorkoutDetailView'
import { isValidWorkout, weightToKg } from '../../../utils'

const STRENGTH_TRAINING_MET = 6

export const WorkoutDetailContainer = ({ workout, exercises, calorieWeight, onBack, onSave, onDelete, weightUnit }) => {
  const { t, locale } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(workout)
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [collapsedExercises, setCollapsedExercises] = useState(() => new Set())
  const selectedExerciseNames = new Set(draft.exercises.map(exercise => exercise.name.trim().toLocaleLowerCase()))
  const availableExercises = exercises.filter(
    (exercise, index, allExercises) =>
      !selectedExerciseNames.has(exercise.name.trim().toLocaleLowerCase()) &&
      allExercises.findIndex(item => item.name.trim().toLocaleLowerCase() === exercise.name.trim().toLocaleLowerCase()) === index,
  )
  const orderedExercises = [
    ...availableExercises.filter(exercise => exercise.categoryId === workout.categoryId),
    ...availableExercises.filter(exercise => exercise.categoryId !== workout.categoryId),
  ]
  const [chosenExercise, setChosenExercise] = useState(orderedExercises[0]?.name || '')
  const menuRef = useRef(null)
  const displayedWorkout = editing ? draft : workout
  const displayedCalorieWeight = displayedWorkout.bodyWeight ?? calorieWeight
  const caloriesBurned = Math.round((Number(displayedWorkout.duration || 0) * STRENGTH_TRAINING_MET * 3.5 * displayedCalorieWeight) / 200)
  const updateExercise = (exerciseId, updater) =>
    setDraft({ ...draft, exercises: draft.exercises.map(exercise => (exercise.id === exerciseId ? updater(exercise) : exercise)) })
  const updateSet = (exerciseId, setIndex, field, value) =>
    updateExercise(exerciseId, exercise => ({
      ...exercise,
      sets: exercise.sets.map((set, index) =>
        index === setIndex
          ? {
              ...set,
              [field]: value === '' ? null : Math.max(0, field === 'weight' ? weightToKg(value, weightUnit) : Number(value)),
            }
          : set,
      ),
    }))
  useEffect(() => {
    if (!orderedExercises.some(exercise => exercise.name === chosenExercise)) {
      setChosenExercise(orderedExercises[0]?.name || '')
    }
  }, [chosenExercise, orderedExercises])
  const toggleExercise = exerciseId =>
    setCollapsedExercises(current => {
      const next = new Set(current)
      if (next.has(exerciseId)) next.delete(exerciseId)
      else next.add(exerciseId)
      return next
    })
  const save = () => {
    if (!isValidWorkout(draft)) return
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
    const closeModal = event => event.key === 'Escape' && setDeleteModalOpen(false)
    document.addEventListener('keydown', closeModal)
    return () => document.removeEventListener('keydown', closeModal)
  }, [deleteModalOpen])
  return (
    <WorkoutDetailView
      caloriesBurned={caloriesBurned}
      chosenExercise={chosenExercise}
      collapsedExercises={collapsedExercises}
      deleteModalOpen={deleteModalOpen}
      displayedCalorieWeight={displayedCalorieWeight}
      displayedWorkout={displayedWorkout}
      draft={draft}
      editing={editing}
      exercises={availableExercises}
      isValid={isValidWorkout(draft)}
      locale={locale}
      menuOpen={menuOpen}
      menuRef={menuRef}
      onBack={onBack}
      onDelete={onDelete}
      orderedExercises={orderedExercises}
      save={save}
      setChosenExercise={setChosenExercise}
      setDeleteModalOpen={setDeleteModalOpen}
      setDraft={setDraft}
      setEditing={setEditing}
      setMenuOpen={setMenuOpen}
      t={t}
      toggleExercise={toggleExercise}
      updateExercise={updateExercise}
      updateSet={updateSet}
      workout={workout}
      weightUnit={weightUnit}
    />
  )
}

export { WorkoutDetailContainer as WorkoutDetail }
