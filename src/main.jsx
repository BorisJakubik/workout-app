import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BarChart3, CalendarDays, Dumbbell, History, Home, Plus } from 'lucide-react';
import { cancelWorkout, finishWorkout, initializeData, startWorkout, store, updateActiveWorkout, updateWorkout } from './store';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { HistoryView } from './components/HistoryView';
import { LibraryView } from './components/LibraryView';
import { NavButton } from './components/NavButton';
import { ProgressView } from './components/ProgressView';
import { WorkoutDetail } from './components/WorkoutDetail';
import { WorkoutEditor } from './components/WorkoutEditor';
import './styles.css';

const App = () => {
  const dispatch = useDispatch();
  const { workouts, categories, exercises, activeWorkout } = useSelector(state => state.fitness);
  const [screen, setScreen] = useState(activeWorkout ? 'workout' : 'home');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  useEffect(() => {
    initializeData();
  }, []);
  const stats = useMemo(
    () => ({
      count: workouts.length,
      totalMinutes: workouts.reduce((sum, workout) => sum + Number(workout.duration || 0), 0),
      best: Math.max(0, ...workouts.flatMap(workout => workout.exercises.flatMap(exercise => exercise.sets.map(set => Number(set.weight || 0))))),
    }),
    [workouts],
  );
  const begin = categoryId => {
    dispatch(startWorkout(categoryId));
    setScreen('workout');
  };

  if (screen === 'workout' && activeWorkout)
    return (
      <WorkoutEditor
        draft={activeWorkout}
        exercises={exercises.filter(exercise => exercise.categoryId === activeWorkout.categoryId)}
        setDraft={draft => dispatch(updateActiveWorkout(draft))}
        finish={() => {
          dispatch(finishWorkout());
          setScreen('home');
        }}
        cancel={() => {
          dispatch(cancelWorkout());
          setScreen('home');
        }}
      />
    );
  if (selectedWorkout)
    return (
      <WorkoutDetail
        workout={selectedWorkout}
        onBack={() => setSelectedWorkout(null)}
        onSave={updated => {
          dispatch(updateWorkout(updated));
          setSelectedWorkout(updated);
        }}
      />
    );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-mark">
          <Dumbbell size={19} />
        </div>
        <span className="brand">FitTrack</span>
        <button className="avatar">BJ</button>
      </header>
      <main>
        {screen === 'home' && (
          <Dashboard
            workouts={workouts}
            categories={categories}
            exercises={exercises}
            stats={stats}
            startWorkout={begin}
            setScreen={setScreen}
            openWorkout={setSelectedWorkout}
          />
        )}
        {screen === 'history' && <HistoryView workouts={workouts} openWorkout={setSelectedWorkout} />}
        {screen === 'calendar' && <CalendarView workouts={workouts} openWorkout={setSelectedWorkout} />}
        {screen === 'progress' && <ProgressView workouts={workouts} stats={stats} />}
        {screen === 'library' && <LibraryView categories={categories} exercises={exercises} />}
      </main>
      <nav className="bottom-nav">
        <NavButton active={screen === 'home'} icon={Home} label="Domov" onClick={() => setScreen('home')} />
        <NavButton active={screen === 'history'} icon={History} label="História" onClick={() => setScreen('history')} />
        <NavButton active={screen === 'calendar'} icon={CalendarDays} label="Kalendár" onClick={() => setScreen('calendar')} />
        <button className="start-fab" onClick={() => categories[0] && begin(categories[0].id)}>
          <Plus />
        </button>
        <NavButton active={screen === 'progress'} icon={BarChart3} label="Progres" onClick={() => setScreen('progress')} />
        <NavButton active={screen === 'library'} icon={Dumbbell} label="Cviky" onClick={() => setScreen('library')} />
      </nav>
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
