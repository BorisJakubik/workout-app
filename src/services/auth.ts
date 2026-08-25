import { requireSupabase } from '../lib/supabase'
export const signIn = ({ email, password }) => requireSupabase().auth.signInWithPassword({ email, password })
export const signUp = ({ email, password }) => requireSupabase().auth.signUp({ email, password })
export const signOut = () => requireSupabase().auth.signOut()
