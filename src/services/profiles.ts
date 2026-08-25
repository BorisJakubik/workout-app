import { requireSupabase } from '../lib/supabase'
export const getProfile = async userId => {
  const { data, error } = await requireSupabase().from('profiles').select('first_name,last_name,avatar_url').eq('id', userId).maybeSingle()
  if (error) throw error
  return data ? { name: data.first_name, surname: data.last_name, photo: data.avatar_url || '' } : { name: '', surname: '', photo: '' }
}
export const saveProfile = async (userId, profile) => {
  const { error } = await requireSupabase().from('profiles').upsert({ id: userId, first_name: profile.name, last_name: profile.surname, avatar_url: profile.photo || '' })
  if (error) throw error
}
