import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  cancelWorkout,
  deleteWorkout,
  finishWorkout,
  setLanguage,
  setTheme,
  setWeightUnit,
  startWorkout,
  updateActiveWorkout,
  updateProfile,
  updateWorkout,
  store,
  replaceData,
} from '../../../store'
import type { RootState } from '../../../store'
import { supabase } from '../../../lib/supabase'
import { signIn, signOut, signUp } from '../../../services/auth'
import { getWorkouts, createWorkout, updateWorkout as saveWorkout, deleteWorkout as removeWorkout } from '../../../services/workouts'
import { getCatalog } from '../../../services/catalog'
import { getProfile, saveProfile } from '../../../services/profiles'
import { AuthView } from '../Auth/AuthView'
import { useTranslation } from '../../../i18n'
import { AppView } from './AppView'
import { isValidWorkout } from '../../../utils'
import type { AppContainerProps } from './AppContainer.types'
import type { Screen } from './AppView.types'

const activeWorkoutStorageKey = 'fittrack.active-workout'
const screenPaths: Record<Screen, string> = {
  home: '/',
  history: '/history',
  progress: '/progress',
  library: '/library',
  settings: '/settings',
  workout: '/workout',
}

const getScreenFromPathname = (pathname: string): Screen | null => {
  if (pathname === '/') return 'home'
  if (pathname === '/workout/rest') return 'workout'
  if (/^\/workout\/[^/]+(?:\/edit)?$/.test(pathname)) return 'history'
  return (Object.entries(screenPaths).find(([, path]) => path === pathname)?.[0] as Screen | undefined) ?? null
}

const readStoredActiveWorkout = userId => {
  try {
    const stored = window.localStorage.getItem(activeWorkoutStorageKey)
    const snapshot = stored ? JSON.parse(stored) : null
    return snapshot?.userId === userId ? snapshot.workout : null
  } catch {
    return null
  }
}

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

export const AppContainer = (_props: AppContainerProps) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { language, t } = useTranslation()
  const { workouts, categories, exercises, activeWorkout } = useSelector((state: RootState) => state.fitness)
  const theme = useSelector((state: RootState) => state.fitness.theme || 'dark')
  const weightUnit = useSelector((state: RootState) => (state.fitness.weightUnit === 'lbs' ? 'lbs' : 'kg'))
  const storedProfile = useSelector((state: RootState) => state.fitness.profile)
  const profile = {
    name: storedProfile?.name || 'Boris',
    surname: storedProfile?.surname || '',
    email: storedProfile?.email || '',
    photo: storedProfile?.photo || '',
  }
  const matchedScreen = getScreenFromPathname(location.pathname)
  const screen = matchedScreen ?? 'home'
  const workoutRoute = location.pathname === '/workout/rest' ? null : location.pathname.match(/^\/workout\/([^/]+)(?:\/(edit))?$/)
  const workoutNumber = workoutRoute ? Number(workoutRoute[1]) : null
  const selectedWorkout =
    Number.isSafeInteger(workoutNumber) && workoutNumber > 0 ? workouts.find(workout => workout.workoutNumber === workoutNumber) || null : null
  const editingWorkout = Boolean(workoutRoute?.[2])
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [workoutConfirmation, setWorkoutConfirmation] = useState(null)
  const [session, setSession] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [dataLoadedForUserId, setDataLoadedForUserId] = useState(null)
  const [error, setError] = useState('')
  const profileMenuRef = useRef(null)
  useEffect(() => {
    if (!session) return
    const storedActiveWorkout = readStoredActiveWorkout(session.user.id)
    if (storedActiveWorkout) {
      dispatch(updateActiveWorkout(storedActiveWorkout))
    }
  }, [dispatch, session])
  useEffect(() => {
    if (session === undefined) return
    try {
      if (activeWorkout && session)
        window.localStorage.setItem(activeWorkoutStorageKey, JSON.stringify({ userId: session.user.id, workout: activeWorkout }))
      else window.localStorage.removeItem(activeWorkoutStorageKey)
    } catch {
      // The workout remains usable when browser storage is unavailable.
    }
  }, [activeWorkout, session])
  useEffect(() => {
    if (!supabase) {
      setSession(null)
      setError('Supabase nie je nakonfigurovaný.')
      return undefined
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!session) {
      setDataLoadedForUserId(null)
      return undefined
    }

    let cancelled = false
    const userId = session.user.id
    setDataLoadedForUserId(null)
    setError('')
    Promise.all([getWorkouts(), getCatalog(), getProfile(userId)])
      .then(([remoteWorkouts, catalog, remoteProfile]) => {
        if (cancelled) return
        dispatch(
          replaceData({
            ...store.getState().fitness,
            ...catalog,
            workouts: remoteWorkouts,
            profile: { ...remoteProfile, email: session.user.email || '' },
          }),
        )
      })
      .catch(reason => {
        if (!cancelled) setError(reason.message || 'Dáta sa nepodarilo načítať.')
      })
      .finally(() => {
        if (!cancelled) setDataLoadedForUserId(userId)
      })

    return () => {
      cancelled = true
    }
  }, [session])
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
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
    navigate(screenPaths.workout)
  }
  const saveSelected = updated => {
    saveWorkout(updated)
      .then(saved => {
        dispatch(updateWorkout(saved))
        navigate(`/workout/${saved.workoutNumber}`, { replace: true })
        setWorkoutConfirmation({ id: Date.now(), message: t('workoutSaved', { name: saved.name }) })
      })
      .catch(reason => setError(reason.message))
  }
  const deleteSelected = () => {
    removeWorkout(selectedWorkout.id)
      .then(() => {
        dispatch(deleteWorkout(selectedWorkout.id))
        navigate(screenPaths.history, { replace: true })
      })
      .catch(reason => setError(reason.message))
  }
  const authenticate = async (method, credentials) => {
    setLoading(true)
    setError('')
    const { data, error: authError } = await method(credentials)
    setLoading(false)
    if (authError) setError(authError.message)
    else if (!data.session && method === signUp) setError(t('accountCreatedCheckEmail'))
  }
  if (session === undefined)
    return (
      <div className="app-state" role="status">
        {t('loadingSignIn')}
      </div>
    )
  if (!session)
    return (
      <AuthView
        loading={loading}
        error={error}
        language={language}
        t={t}
        onLanguageChange={() => dispatch(setLanguage(language === 'sk' ? 'en' : 'sk'))}
        onLogin={credentials => authenticate(signIn, credentials)}
        onRegister={credentials => authenticate(signUp, credentials)}
      />
    )
  if (loading || dataLoadedForUserId !== session.user.id)
    return (
      <div className="app-state" role="status" aria-live="polite">
        <span className="app-loader" aria-hidden="true" />
        {t('loadingWorkouts')}
      </div>
    )
  if (workoutRoute && !selectedWorkout) return <Navigate to={screenPaths.history} replace />
  if (!matchedScreen && !workoutRoute) return <Navigate to={screenPaths.home} replace />
  if (screen === 'workout' && !activeWorkout) return <Navigate to={screenPaths.home} replace />
  const previousWeight =
    selectedWorkout &&
    workouts
      .filter(workout => workout.id !== selectedWorkout.id && new Date(workout.date) <= new Date(selectedWorkout.date) && workout.bodyWeight != null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.bodyWeight
  return (
    <AppView
      activeWorkout={activeWorkout}
      calorieWeight={selectedWorkout?.bodyWeight ?? previousWeight ?? 80}
      categories={categories}
      exercises={exercises}
      language={language}
      onCancelWorkout={() => {
        dispatch(cancelWorkout())
        navigate(screenPaths.home)
      }}
      onDeleteWorkout={deleteSelected}
      onFinishWorkout={() => {
        if (!isValidWorkout(activeWorkout) || ['in_progress', 'paused'].includes(activeWorkout?.workoutState)) return
        const workoutName = activeWorkout?.name || t('workout')
        const draft = { ...activeWorkout, completed: true }
        createWorkout(draft)
          .then(saved => {
            dispatch(updateActiveWorkout(saved))
            dispatch(finishWorkout())
            navigate(screenPaths.home)
            setWorkoutConfirmation({ id: Date.now(), message: t('workoutCreated', { name: workoutName }) })
          })
          .catch(reason => setError(reason.message))
      }}
      onLanguageChange={() => dispatch(setLanguage(language === 'sk' ? 'en' : 'sk'))}
      onProfileMenuToggle={() => setProfileMenuOpen(open => !open)}
      onLogout={() => signOut()}
      onSaveWorkout={saveSelected}
      onScreenChange={nextScreen => navigate(screenPaths[nextScreen])}
      onStartWorkout={start}
      onThemeChange={value => dispatch(setTheme(value))}
      onWeightUnitChange={value => dispatch(setWeightUnit(value))}
      onUpdateActiveWorkout={draft => dispatch(updateActiveWorkout(draft))}
      onUpdateProfile={value =>
        saveProfile(session.user.id, value)
          .then(() => dispatch(updateProfile(value)))
          .catch(reason => setError(reason.message))
      }
      openWorkout={workout => navigate(workout?.workoutNumber ? `/workout/${workout.workoutNumber}` : screenPaths.history)}
      editingWorkout={editingWorkout}
      onEditingWorkoutChange={editing => navigate(`/workout/${selectedWorkout.workoutNumber}${editing ? '/edit' : ''}`)}
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
      error={error}
      onDismissWorkoutConfirmation={() => setWorkoutConfirmation(null)}
      weightUnit={weightUnit}
    />
  )
}
