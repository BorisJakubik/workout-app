import { configureStore, createSlice } from '@reduxjs/toolkit';

const defaultCategories = [
  { id: 'push', name: 'Push tréning' },
  { id: 'pull', name: 'Pull tréning' },
  { id: 'legs', name: 'Nohy' },
  { id: 'full-body', name: 'Full body' },
];
const defaultExercises = [
  ['Bench press', 'push'],
  ['Tlaky s jednoručkami', 'push'],
  ['Tlaky nad hlavu', 'push'],
  ['Upažovanie', 'push'],
  ['Tricepsové sťahovanie', 'push'],
  ['Mŕtvy ťah', 'pull'],
  ['Zhyby', 'pull'],
  ['Príťahy v predklone', 'pull'],
  ['Sťahovanie kladky', 'pull'],
  ['Bicepsový zdvih', 'pull'],
  ['Drep', 'legs'],
  ['Leg press', 'legs'],
  ['Rumunský mŕtvy ťah', 'legs'],
  ['Predkopávanie', 'legs'],
  ['Výpony na lýtka', 'legs'],
  ['Drep', 'full-body'],
  ['Bench press', 'full-body'],
  ['Príťahy v predklone', 'full-body'],
  ['Tlaky nad hlavu', 'full-body'],
  ['Plank', 'full-body'],
].map(([name, categoryId], index) => ({ id: `exercise-${index}`, name, categoryId }));
const starterWorkouts = [
  {
    id: 1,
    categoryId: 'push',
    name: 'Push tréning',
    date: '2026-08-18T17:30:00',
    duration: 58,
    completed: true,
    exercises: [
      {
        id: 11,
        name: 'Bench press',
        sets: [
          { reps: 8, weight: 70 },
          { reps: 8, weight: 70 },
          { reps: 6, weight: 75 },
        ],
      },
      {
        id: 12,
        name: 'Tlaky nad hlavu',
        sets: [
          { reps: 10, weight: 30 },
          { reps: 9, weight: 30 },
          { reps: 8, weight: 30 },
        ],
      },
      {
        id: 13,
        name: 'Upažovanie',
        sets: [
          { reps: 12, weight: 10 },
          { reps: 12, weight: 10 },
          { reps: 11, weight: 10 },
        ],
      },
    ],
  },
  {
    id: 2,
    categoryId: 'legs',
    name: 'Nohy',
    date: '2026-08-15T18:10:00',
    duration: 64,
    completed: true,
    exercises: [
      {
        id: 21,
        name: 'Drep',
        sets: [
          { reps: 8, weight: 80 },
          { reps: 8, weight: 80 },
          { reps: 6, weight: 85 },
        ],
      },
      {
        id: 22,
        name: 'Leg press',
        sets: [
          { reps: 10, weight: 140 },
          { reps: 10, weight: 140 },
          { reps: 9, weight: 140 },
        ],
      },
    ],
  },
];
const read = key => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};
const initialState = read('fittrack-redux') || {
  categories: defaultCategories,
  exercises: defaultExercises,
  workouts: read('fittrack-workouts') || starterWorkouts,
  activeWorkout: null,
};

const fitnessSlice = createSlice({
  name: 'fitness',
  initialState,
  reducers: {
    addCategory(state, action) {
      state.categories.push({ id: crypto.randomUUID(), name: action.payload.trim() });
    },
    renameCategory(state, action) {
      const category = state.categories.find(c => c.id === action.payload.id);
      if (category && action.payload.name.trim()) category.name = action.payload.name.trim();
      if (state.activeWorkout?.categoryId === action.payload.id) state.activeWorkout.name = action.payload.name.trim();
    },
    removeCategory(state, action) {
      state.categories = state.categories.filter(c => c.id !== action.payload);
      state.exercises = state.exercises.filter(e => e.categoryId !== action.payload);
    },
    addLibraryExercise(state, action) {
      state.exercises.push({ id: crypto.randomUUID(), ...action.payload, name: action.payload.name.trim() });
    },
    removeLibraryExercise(state, action) {
      state.exercises = state.exercises.filter(e => e.id !== action.payload);
    },
    startWorkout(state, action) {
      const category = state.categories.find(c => c.id === action.payload);
      const first = state.exercises.find(e => e.categoryId === action.payload);
      state.activeWorkout = {
        id: Date.now(),
        categoryId: category.id,
        name: category.name,
        date: `${new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10)}T12:00:00`,
        duration: 0,
        notes: '',
        rating: 0,
        completed: false,
        exercises: first ? [{ id: crypto.randomUUID(), name: first.name, sets: [{ reps: 8, weight: 0 }] }] : [],
      };
    },
    updateActiveWorkout(state, action) {
      state.activeWorkout = action.payload;
    },
    cancelWorkout(state) {
      state.activeWorkout = null;
    },
    finishWorkout(state) {
      if (!state.activeWorkout) return;
      state.workouts.unshift({
        ...state.activeWorkout,
        duration:
          state.activeWorkout.duration > 0 ? state.activeWorkout.duration : Math.max(1, Math.round((Date.now() - state.activeWorkout.id) / 60000)),
        completed: true,
      });
      state.activeWorkout = null;
    },
    updateWorkout(state, action) {
      const index = state.workouts.findIndex(workout => workout.id === action.payload.id);
      if (index !== -1) state.workouts[index] = { ...action.payload, completed: true };
    },
    replaceData(state, action) {
      state.categories = action.payload.categories;
      state.exercises = action.payload.exercises;
      state.workouts = action.payload.workouts;
      state.activeWorkout = action.payload.activeWorkout || null;
    },
  },
});
export const {
  addCategory,
  renameCategory,
  removeCategory,
  addLibraryExercise,
  removeLibraryExercise,
  startWorkout,
  updateActiveWorkout,
  cancelWorkout,
  finishWorkout,
  updateWorkout,
  replaceData,
} = fitnessSlice.actions;
export const store = configureStore({ reducer: { fitness: fitnessSlice.reducer } });

let fileSyncEnabled = false;
let saveTimer;

store.subscribe(() => {
  const data = store.getState().fitness;
  localStorage.setItem('fittrack-redux', JSON.stringify(data));
  if (!fileSyncEnabled) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(error => console.error('JSON súbor sa nepodarilo uložiť:', error));
  }, 400);
});

export const initializeData = async () => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    store.dispatch(replaceData(await response.json()));
  } catch (error) {
    console.warn('Používam lokálne záložné dáta:', error);
  } finally {
    fileSyncEnabled = true;
  }
};
