import React from 'react'
import { BarChart3, Dumbbell, History as HistoryIcon, Home, Plus, Settings } from 'lucide-react'
import { NavButton } from '../../atoms/NavButton/NavButtonView'
import { Dashboard } from '../Dashboard/DashboardContainer'
import { History } from '../History/HistoryContainer'
import { LibraryView } from '../Library/LibraryContainer'
import { ProgressView } from '../Progress/ProgressContainer'
import { SettingsView } from '../Settings/SettingsContainer'
import { WorkoutDetail } from '../WorkoutDetail/WorkoutDetailContainer'
import { WorkoutEditor } from '../WorkoutEditor/WorkoutEditorContainer'

export const AppView = props => {
  const {
    activeWorkout,
    calorieWeight,
    categories,
    exercises,
    language,
    profile,
    profileMenuOpen,
    profileMenuRef,
    screen,
    selectedWorkout,
    stats,
    t,
    theme,
    workouts,
  } = props
  if (screen === 'workout' && activeWorkout)
    return (
      <WorkoutEditor
        draft={activeWorkout}
        exercises={exercises}
        workouts={workouts}
        setDraft={props.onUpdateActiveWorkout}
        finish={props.onFinishWorkout}
        cancel={props.onCancelWorkout}
      />
    )
  if (selectedWorkout)
    return (
      <WorkoutDetail
        workout={selectedWorkout}
        exercises={exercises}
        calorieWeight={calorieWeight}
        onBack={() => props.openWorkout(null)}
        onSave={props.onSaveWorkout}
        onDelete={props.onDeleteWorkout}
      />
    )
  const initials = `${profile.name.trim()[0] || ''}${profile.surname.trim()[0] || ''}`.toUpperCase() || 'U'
  const fullName = [profile.name, profile.surname].filter(Boolean).join(' ')
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark">
          <Dumbbell size={19} />
        </div>
        <span className="brand">FitTrack</span>
        <button className="language-toggle" onClick={props.onLanguageChange} aria-label="Change language">
          {language === 'sk' ? 'EN' : 'SK'}
        </button>
        <div className="profile-menu" ref={profileMenuRef}>
          <button
            className={`avatar profile-menu-trigger ${profile.photo ? 'has-photo' : ''}`}
            aria-label={t('profileMenu')}
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
            onClick={props.onProfileMenuToggle}
          >
            {profile.photo ? <img src={profile.photo} alt="" /> : initials}
          </button>
          {profileMenuOpen && (
            <div className="profile-dropdown" role="menu">
              <div className="profile-dropdown-user">
                <strong>{fullName}</strong>
                {profile.email && <small>{profile.email}</small>}
              </div>
              <button role="menuitem" onClick={() => props.onScreenChange('settings')}>
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
            startWorkout={props.onStartWorkout}
            setScreen={props.onScreenChange}
            openWorkout={props.openWorkout}
          />
        )}
        {screen === 'history' && <History workouts={workouts} openWorkout={props.openWorkout} />}
        {screen === 'progress' && <ProgressView workouts={workouts} stats={stats} />}
        {screen === 'library' && <LibraryView categories={categories} exercises={exercises} />}
        {screen === 'settings' && <SettingsView profile={profile} theme={theme} onThemeChange={props.onThemeChange} onSave={props.onUpdateProfile} />}
      </main>
      <nav className="bottom-nav">
        <NavButton active={screen === 'home'} icon={Home} label={t('home')} onClick={() => props.onScreenChange('home')} />
        <NavButton active={screen === 'history'} icon={HistoryIcon} label={t('history')} onClick={() => props.onScreenChange('history')} />
        <button className="start-fab" onClick={() => categories[0] && props.onStartWorkout(categories[0].id)}>
          <Plus />
        </button>
        <NavButton active={screen === 'progress'} icon={BarChart3} label={t('progress')} onClick={() => props.onScreenChange('progress')} />
        <NavButton active={screen === 'library'} icon={Dumbbell} label={t('exercisesNav')} onClick={() => props.onScreenChange('library')} />
      </nav>
    </div>
  )
}
