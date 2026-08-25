import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The anon key is designed for browser use; data access is protected by RLS.
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const requireSupabase = () => {
  if (!supabase) throw new Error('Supabase nie je nakonfigurovaný. Nastavte VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY.')
  return supabase
}
