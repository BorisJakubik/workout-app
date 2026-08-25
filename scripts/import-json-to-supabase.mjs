import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const { VITE_SUPABASE_URL: url, VITE_SUPABASE_ANON_KEY: key, IMPORT_EMAIL: email, IMPORT_PASSWORD: password } = process.env
if (!url || !key || !email || !password) throw new Error('Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, IMPORT_EMAIL and IMPORT_PASSWORD.')
const db = createClient(url, key)
const { data: auth, error: loginError } = await db.auth.signInWithPassword({ email, password })
if (loginError) throw loginError
const source = JSON.parse(await readFile(new URL('../data/fitness-data.json', import.meta.url), 'utf8'))
const userId = auth.user.id
const ensure = async (table, rows) => { if (!rows.length) return; const { error } = await db.from(table).upsert(rows); if (error) throw error }
await ensure('categories', source.categories.map(item => ({ ...item, user_id: userId })))
await ensure('exercises', source.exercises.map(item => ({ id: item.id, name: item.name, category_id: item.categoryId, user_id: userId })))
for (const workout of source.workouts || []) {
  const { data: row, error } = await db.from('workouts').insert({ user_id: userId, category_id: workout.categoryId, name: workout.name, performed_at: workout.date, duration_minutes: workout.duration, completed: workout.completed, notes: workout.notes || '', rating: workout.rating || 0, body_weight: workout.bodyWeight, body_fat_percentage: workout.bodyFatPercentage }).select().single()
  if (error) throw error
  for (const [position, exercise] of workout.exercises.entries()) {
    const { data: exerciseRow, error: exerciseError } = await db.from('workout_exercises').insert({ workout_id: row.id, exercise_name: exercise.name, position }).select().single()
    if (exerciseError) throw exerciseError
    const { error: setsError } = await db.from('exercise_sets').insert(exercise.sets.map((set, setPosition) => ({ workout_exercise_id: exerciseRow.id, reps: set.reps, weight: set.weight, position: setPosition })))
    if (setsError) throw setsError
  }
}
console.log('Import complete.')
