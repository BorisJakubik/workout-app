import { requireSupabase } from '../lib/supabase'
export const signIn = ({ email, password, captchaToken }) => requireSupabase().auth.signInWithPassword({ email, password, options: { captchaToken } })
export const signUp = ({ email, password, captchaToken }) => requireSupabase().auth.signUp({ email, password, options: { captchaToken } })
export const signOut = () => requireSupabase().auth.signOut()
