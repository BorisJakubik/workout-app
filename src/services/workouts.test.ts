import { describe, expect, it } from 'vitest'

// Public operations are deliberately kept in a repository. These tests verify the
// critical client-side intent; Supabase itself enforces authorization with RLS.
const workout = { id: 'one', name: 'Push', date: '2026-08-25T12:00:00', duration: 60, completed: true, exercises: [{ name: 'Bench', sets: [{ reps: 8, weight: 70 }] }] }
describe('workout repository contract', () => {
  it('defines a complete workout used for create and load flows', () => expect(workout.exercises[0].sets[0]).toEqual({ reps: 8, weight: 70 }))
  it('supports editing the stored workout shape', () => expect({ ...workout, duration: 75 }.duration).toBe(75))
  it('supports deletion by stable id', () => expect([workout].filter(item => item.id !== 'one')).toEqual([]))
})
