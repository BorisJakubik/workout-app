import { describe, expect, it } from 'vitest'
import { fitnessReducer, finishWorkout, updateWorkout, deleteWorkout } from './store'

const draft = { id: 'draft', name: 'Push', categoryId: 'push', date: '2026-08-25T12:00:00', duration: 60, completed: false, exercises: [{ id: 'bench', name: 'Bench press', sets: [{ reps: 8, weight: 70 }] }] }
describe('workout business flows', () => {
  it('creates a completed workout by finishing the active draft', () => {
    const state = fitnessReducer({ activeWorkout: draft, workouts: [] }, finishWorkout())
    expect(state.workouts).toHaveLength(1); expect(state.workouts[0].completed).toBe(true)
  })
  it('edits an existing workout', () => {
    const state = fitnessReducer({ workouts: [{ ...draft, completed: true }] }, updateWorkout({ ...draft, name: 'Updated' }))
    expect(state.workouts[0].name).toBe('Updated')
  })
  it('deletes a workout by id', () => {
    expect(fitnessReducer({ workouts: [draft] }, deleteWorkout('draft')).workouts).toEqual([])
  })
})
