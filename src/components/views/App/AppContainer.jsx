import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  cancelWorkout,
  deleteWorkout,
  finishWorkout,
  initializeData,
  setLanguage,
  setTheme,
  setWeightUnit,
  startWorkout,
  updateActiveWorkout,
  updateProfile,
  updateWorkout,
} from '../../../store'
import { useTranslation } from '../../../i18n'
import { AppView } from './AppView'

const bigThreeLifts = [
  { key: 'benchPress', aliases: ['bench press', 'benchpress'] },
  { key: 'deadlift', aliases: ['mrtvy tah', 'deadlift'] },
  { key: 'squat', aliases: ['drep', 'squat'] },
]

const normalizeExerciseName = name =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const getBestBigThreeLift = workouts =>
  workouts.reduce(
    (best, workout) =>
      workout.exercises.reduce((workoutBest, exercise) => {
        const normalizedName = normalizeExerciseName(exercise.name)
        const lift = bigThreeLifts.find(item => item.aliases.some(alias => normalizedName.includes(alias)))
        if (!lift) return workoutBest

        const weight = Math.max(0, ...exercise.sets.map(set => Number(set.weight || 0)))
        return weight > workoutBest.value ? { value: weight, exerciseKey: lift.key } : workoutBest
      }, best),
    { value: 0, exerciseKey: null },
  )

export const AppContainer = () => {
  const dispatch = useDispatch()
  const { language, t } = useTranslation()
  const { workouts, categories, exercises, activeWorkout } = useSelector(state => state.fitness)
  const theme = useSelector(state => state.fitness.theme || 'dark')
  const weightUnit = useSelector(state => (state.fitness.weightUnit === 'lbs' ? 'lbs' : 'kg'))
  const storedProfile = useSelector(state => state.fitness.profile)
  const profile = {
    name: storedProfile?.name || 'Boris',
    surname: storedProfile?.surname || '',
    email: storedProfile?.email || '',
    photo: storedProfile?.photo || '',
  }
  const [screen, setScreen] = useState(activeWorkout ? 'workout' : 'home')
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [workoutConfirmation, setWorkoutConfirmation] = useState(null)
  const profileMenuRef = useRef(null)
  useEffect(() => {
    initializeData()
  }, [])
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
  useEffect(() => {
    if (!selectedWorkout) return
    const localizedWorkout = workouts.find(workout => workout.id === selectedWorkout.id)
    if (localizedWorkout && localizedWorkout !== selectedWorkout) setSelectedWorkout(localizedWorkout)
  }, [workouts, selectedWorkout])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  useEffect(() => {
    if (!workoutConfirmation) return undefined
    const timeout = window.setTimeout(() => setWorkoutConfirmation(null), 3500)
    return () => window.clearTimeout(timeout)
  }, [workoutConfirmation])
  useEffect(() => {
    if (!profileMenuOpen) return undefined
    const closeMenu = event => {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      if (event.type === 'pointerdown' && profileMenuRef.current?.contains(event.target)) return
      setProfileMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeMenu)
    document.addEventListener('keydown', closeMenu)
    return () => {
      document.removeEventListener('pointerdown', closeMenu)
      document.removeEventListener('keydown', closeMenu)
    }
  }, [profileMenuOpen])
  const stats = useMemo(() => {
    const bestBigThreeLift = getBestBigThreeLift(workouts)
    return {
      count: workouts.length,
      totalMinutes: workouts.reduce((sum, workout) => sum + Number(workout.duration || 0), 0),
      best: bestBigThreeLift.value,
      bestExerciseKey: bestBigThreeLift.exerciseKey,
    }
  }, [workouts])
  const start = categoryId => {
    dispatch(startWorkout(categoryId))
    setScreen('workout')
  }
  const saveSelected = updated => {
    dispatch(updateWorkout(updated))
    setSelectedWorkout(updated)
    setWorkoutConfirmation({ id: Date.now(), message: t('workoutSaved', { name: updated.name }) })
  }
  const deleteSelected = () => {
    dispatch(deleteWorkout(selectedWorkout.id))
    setSelectedWorkout(null)
  }
  const previousWeight =
    selectedWorkout &&
    workouts
      .filter(workout => workout.id !== selectedWorkout.id && new Date(workout.date) <= new Date(selectedWorkout.date) && workout.bodyWeight != null)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.bodyWeight
  return (
    <AppView
      activeWorkout={activeWorkout}
      calorieWeight={selectedWorkout?.bodyWeight ?? previousWeight ?? 80}
      categories={categories}
      exercises={exercises}
      language={language}
      onCancelWorkout={() => {
        dispatch(cancelWorkout())
        setScreen('home')
      }}
      onDeleteWorkout={deleteSelected}
      onFinishWorkout={() => {
        const workoutName = activeWorkout?.name || t('workout')
        dispatch(finishWorkout())
        setScreen('home')
        setWorkoutConfirmation({ id: Date.now(), message: t('workoutCreated', { name: workoutName }) })
      }}
      onLanguageChange={() => dispatch(setLanguage(language === 'sk' ? 'en' : 'sk'))}
      onProfileMenuToggle={() => setProfileMenuOpen(open => !open)}
      onSaveWorkout={saveSelected}
      onScreenChange={setScreen}
      onStartWorkout={start}
      onThemeChange={value => dispatch(setTheme(value))}
      onWeightUnitChange={value => dispatch(setWeightUnit(value))}
      onUpdateActiveWorkout={draft => dispatch(updateActiveWorkout(draft))}
      onUpdateProfile={value => dispatch(updateProfile(value))}
      openWorkout={setSelectedWorkout}
      profile={profile}
      profileMenuOpen={profileMenuOpen}
      profileMenuRef={profileMenuRef}
      screen={screen}
      selectedWorkout={selectedWorkout}
      stats={stats}
      t={t}
      theme={theme}
      workouts={workouts}
      workoutConfirmation={workoutConfirmation}
      onDismissWorkoutConfirmation={() => setWorkoutConfirmation(null)}
      weightUnit={weightUnit}
    />
  )
}
