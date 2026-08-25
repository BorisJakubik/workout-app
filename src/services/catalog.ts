import { requireSupabase } from '../lib/supabase'

export const getCatalog = async () => {
  const db = requireSupabase()
  const [{ data: categories, error: categoryError }, { data: exercises, error: exerciseError }] = await Promise.all([
    db.from('categories').select('id,name,icon').order('name'), db.from('exercises').select('id,name,category_id').order('name'),
  ])
  if (categoryError || exerciseError) throw categoryError || exerciseError
  return { categories, exercises: exercises.map(item => ({ id: item.id, name: item.name, categoryId: item.category_id })) }
}
export const createCategory = async category => {
  const { error } = await requireSupabase().from('categories').insert(category); if (error) throw error
}
export const updateCategory = async category => {
  const { error } = await requireSupabase().from('categories').update({ name: category.name, icon: category.icon }).eq('id', category.id); if (error) throw error
}
export const deleteCategory = async id => {
  const { error } = await requireSupabase().from('categories').delete().eq('id', id); if (error) throw error
}
export const createExercise = async exercise => {
  const { error } = await requireSupabase().from('exercises').insert({ id: exercise.id, name: exercise.name, category_id: exercise.categoryId }); if (error) throw error
}
export const deleteExercise = async id => {
  const { error } = await requireSupabase().from('exercises').delete().eq('id', id); if (error) throw error
}
