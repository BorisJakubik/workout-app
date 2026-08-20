import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BarChart3, Dumbbell, History, Home, Plus, Settings } from 'lucide-react'
import {
  cancelWorkout,
  deleteWorkout,
  finishWorkout,
  initializeData,
  setLanguage,
  setTheme,
  startWorkout,
  store,
  updateActiveWorkout,
  updateProfile,
  updateWorkout,
} from '../../../store'
import { useTranslation } from '../../../i18n'
import { NavButton } from '../../atoms/NavButton/NavButtonView'
import { Dashboard } from '../Dashboard/DashboardView'
import { HistoryView } from '../History/HistoryView'
import { LibraryView } from '../Library/LibraryContainer'
import { ProgressView } from '../Progress/ProgressContainer'
import { SettingsView } from '../Settings/SettingsContainer'
import { WorkoutDetail } from '../WorkoutDetail/WorkoutDetailContainer'
import { WorkoutEditor } from '../WorkoutEditor/WorkoutEditorContainer'

export const AppContainer = () => {
  const dispatch = useDispatch()
  const { language, t } = useTranslation()
  const { workouts, categories, exercises, activeWorkout } = useSelector(state => state.fitness)
  const theme = useSelector(state => state.fitness.theme || 'dark')
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
  const profileMenuRef = useRef(null)
  useEffect(() => {
    initializeData()
  }, [])
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
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
  const initials = `${profile.name.trim()[0] || ''}${profile.surname.trim()[0] || ''}`.toUpperCase() || 'U'
  const fullName = [profile.name, profile.surname].filter(Boolean).join(' ')
  const stats = useMemo(
    () => ({
      count: workouts.length,
      totalMinutes: workouts.reduce((sum, workout) => sum + Number(workout.duration || 0), 0),
      best: Math.max(0, ...workouts.flatMap(workout => workout.exercises.flatMap(exercise => exercise.sets.map(set => Number(set.weight || 0))))),
    }),
    [workouts],
  )
  const begin = categoryId => {
    dispatch(startWorkout(categoryId))
    setScreen('workout')
  }

  if (screen === 'workout' && activeWorkout)
    return (
      <WorkoutEditor
        draft={activeWorkout}
        exercises={exercises}
        setDraft={draft => dispatch(updateActiveWorkout(draft))}
        finish={() => {
          dispatch(finishWorkout())
          setScreen('home')
        }}
        cancel={() => {
          dispatch(cancelWorkout())
          setScreen('home')
        }}
      />
    )
  if (selectedWorkout)
    return (() => {
      const previousWeight = workouts
        .filter(
          workout => workout.id !== selectedWorkout.id && new Date(workout.date) <= new Date(selectedWorkout.date) && workout.bodyWeight != null,
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.bodyWeight
      const calorieWeight = selectedWorkout.bodyWeight ?? previousWeight ?? 80

      return (
        <WorkoutDetail
          workout={selectedWorkout}
          exercises={exercises}
          calorieWeight={calorieWeight}
          onBack={() => setSelectedWorkout(null)}
          onSave={updated => {
            dispatch(updateWorkout(updated))
            setSelectedWorkout(updated)
          }}
          onDelete={() => {
            dispatch(deleteWorkout(selectedWorkout.id))
            setSelectedWorkout(null)
          }}
        />
      )
    })()

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark">
          <Dumbbell size={19} />
        </div>
        <span className="brand">FitTrack</span>
        <button className="language-toggle" onClick={() => dispatch(setLanguage(language === 'sk' ? 'en' : 'sk'))} aria-label="Change language">
          {language === 'sk' ? 'EN' : 'SK'}
        </button>
        <div className="profile-menu" ref={profileMenuRef}>
          <button
            className={`avatar profile-menu-trigger ${profile.photo ? 'has-photo' : ''}`}
            aria-label={t('profileMenu')}
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            onClick={() => setProfileMenuOpen(open => !open)}
          >
            {profile.photo ? <img src={profile.photo} alt="" /> : initials}
          </button>
          {profileMenuOpen && (
            <div className="profile-dropdown" role="menu">
              <div className="profile-dropdown-user">
                <strong>{fullName}</strong>
                {profile.email && <small>{profile.email}</small>}
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  setScreen('settings')
                  setProfileMenuOpen(false)
                }}
              >
                <Settings size={17} /> {t('settings')}
              </button>
            </div>
          )}
        </div>
      </header>
      <main>
        {screen === 'home' && (
          <Dashboard
            workouts={workouts}
            categories={categories}
            exercises={exercises}
            stats={stats}
            profileName={profile.name}
            startWorkout={begin}
            setScreen={setScreen}
            openWorkout={setSelectedWorkout}
          />
        )}
        {screen === 'history' && <HistoryView workouts={workouts} openWorkout={setSelectedWorkout} />}
        {screen === 'progress' && <ProgressView workouts={workouts} stats={stats} />}
        {screen === 'library' && <LibraryView categories={categories} exercises={exercises} />}
        {screen === 'settings' && (
          <SettingsView
            profile={profile}
            theme={theme}
            onThemeChange={value => dispatch(setTheme(value))}
            onSave={value => dispatch(updateProfile(value))}
          />
        )}
      </main>
      <nav className="bottom-nav">
        <NavButton active={screen === 'home'} icon={Home} label={t('home')} onClick={() => setScreen('home')} />
        <NavButton active={screen === 'history'} icon={History} label={t('history')} onClick={() => setScreen('history')} />
        <button className="start-fab" onClick={() => categories[0] && begin(categories[0].id)}>
          <Plus />
        </button>
        <NavButton active={screen === 'progress'} icon={BarChart3} label={t('progress')} onClick={() => setScreen('progress')} />
        <NavButton active={screen === 'library'} icon={Dumbbell} label={t('exercisesNav')} onClick={() => setScreen('library')} />
      </nav>
    </div>
  )
}
