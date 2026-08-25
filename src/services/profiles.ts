import { requireSupabase } from '../lib/supabase'
export const getProfile = async userId => {
  const { data, error } = await requireSupabase().from('profiles').select('first_name,last_name,avatar_url').eq('id', userId).single()
  if (error) throw error
  return { name: data.first_name, surname: data.last_name, photo: data.avatar_url || '' }
}
export const saveProfile = async (userId, profile) => {
  const { error } = await requireSupabase().from('profiles').update({ first_name: profile.name, last_name: profile.surname, avatar_url: profile.photo || '' }).eq('id', userId)
  if (error) throw error
}
