import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const getJwtIssuedAt = (token: string | undefined) => {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = window.atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '='))
    const issuedAt = JSON.parse(json).iat
    return typeof issuedAt === 'number' ? issuedAt : null
  } catch {
    return null
  }
}

const issuedAt = getJwtIssuedAt(anonKey)
const maxClockSkewInSeconds = 5 * 60
const requestTimeoutInMilliseconds = 15_000
export const supabaseConfigurationError =
  issuedAt && issuedAt > Math.floor(Date.now() / 1000) + maxClockSkewInSeconds
    ? 'Supabase kľúč je vydaný v budúcnosti. Vygenerujte nový publishable/anon key v Supabase a nastavte ho v VITE_SUPABASE_ANON_KEY.'
    : null

const fetchWithTimeout: typeof fetch = async (input, init) => {
  const controller = new globalThis.AbortController()
  let timedOut = false
  const timeout = window.setTimeout(() => {
    timedOut = true
    controller.abort()
  }, requestTimeoutInMilliseconds)

  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } catch (error) {
    if (timedOut) throw new Error('SUPABASE_REQUEST_TIMEOUT')
    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

// The anon key is designed for browser use; data access is protected by RLS.
export const supabase = url && anonKey && !supabaseConfigurationError ? createClient(url, anonKey, { global: { fetch: fetchWithTimeout } }) : null

export const requireSupabase = () => {
  if (!supabase)
    throw new Error(supabaseConfigurationError || 'Supabase nie je nakonfigurovaný. Nastavte VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY.')
  return supabase
}
