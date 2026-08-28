import { requireSupabase } from '../lib/supabase'

export type WorkoutSet = { reps: number; weight: number }
export type WorkoutExercise = { id?: string; name: string; exerciseId?: string | null; sets: WorkoutSet[] }
export type Workout = {
  id: string; categoryId?: string | null; name: string; date: string; duration: number; completed: boolean
  notes?: string; rating?: number; bodyWeight?: number | null; bodyFatPercentage?: number | null; exercises: WorkoutExercise[]
}

const mapWorkout = (row: any): Workout => ({
  id: row.id, workoutNumber: Number(row.workout_number), categoryId: row.category_id, name: row.name, date: row.performed_at, duration: row.duration_minutes,
  completed: row.completed, notes: row.notes || '', rating: row.rating || 0, bodyWeight: row.body_weight,
  bodyFatPercentage: row.body_fat_percentage,
  exercises: (row.workout_exercises || []).sort((a: any, b: any) => a.position - b.position).map((exercise: any) => ({
    id: exercise.id, name: exercise.exercise_name, exerciseId: exercise.exercise_id,
    sets: (exercise.exercise_sets || []).sort((a: any, b: any) => a.position - b.position).map((set: any) => ({ reps: set.reps, weight: Number(set.weight) })),
  })),
})
const select = '*, workout_exercises(*, exercise_sets(*))'
const payload = (workout: Partial<Workout>) => ({
  category_id: workout.categoryId || null, name: workout.name, performed_at: workout.date, duration_minutes: workout.duration,
  completed: workout.completed ?? true, notes: workout.notes || '', rating: workout.rating || 0,
  body_weight: workout.bodyWeight ?? null, body_fat_percentage: workout.bodyFatPercentage ?? null,
})
async function replaceExercises(workoutId: string, exercises: WorkoutExercise[]) {
  const db = requireSupabase()
  const { error: oldError } = await db.from('workout_exercises').delete().eq('workout_id', workoutId)
  if (oldError) throw oldError
  if (!exercises.length) return
  const { data: rows, error } = await db.from('workout_exercises').insert(exercises.map((item, position) => ({ workout_id: workoutId, exercise_id: item.exerciseId || null, exercise_name: item.name, position }))).select()
  if (error) throw error
  const sets = rows.flatMap((row: any, index: number) => exercises[index].sets.map((set, position) => ({ workout_exercise_id: row.id, reps: set.reps, weight: set.weight, position })))
  if (sets.length) { const { error: setsError } = await db.from('exercise_sets').insert(sets); if (setsError) throw setsError }
}
export async function getWorkouts(): Promise<Workout[]> {
  const { data, error } = await requireSupabase().from('workouts').select(select).order('performed_at', { ascending: false })
  if (error) throw error
  return data.map(mapWorkout)
}
export async function getWorkoutById(id: string): Promise<Workout | null> {
  const { data, error } = await requireSupabase().from('workouts').select(select).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapWorkout(data) : null
}
export async function createWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
  const db = requireSupabase(); const { data, error } = await db.from('workouts').insert(payload(workout)).select().single()
  if (error) throw error
  await replaceExercises(data.id, workout.exercises)
  return (await getWorkoutById(data.id))!
}
export async function updateWorkout(workout: Workout): Promise<Workout> {
  const { error } = await requireSupabase().from('workouts').update(payload(workout)).eq('id', workout.id)
  if (error) throw error
  await replaceExercises(workout.id, workout.exercises)
  return (await getWorkoutById(workout.id))!
}
export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await requireSupabase().from('workouts').delete().eq('id', id)
  if (error) throw error
}
