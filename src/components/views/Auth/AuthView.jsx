import React, { useState } from 'react'

export const AuthView = ({ onLogin, onRegister, error, loading }) => {
  const [register, setRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submit = event => {
    event.preventDefault()
    ;(register ? onRegister : onLogin)({ email, password })
  }
  return <main className="auth-page"><section className="auth-card"><div className="brand-mark">🏋</div><h1>FitTrack</h1><p>{register ? 'Vytvorte si účet pre svoje tréningy.' : 'Prihláste sa k svojim tréningom.'}</p><form onSubmit={submit}><label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></label><label>Heslo<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" autoComplete={register ? 'new-password' : 'current-password'} /></label>{error && <p role="alert" className="form-error">{error}</p>}<button type="submit" className="primary-button" disabled={loading}>{loading ? 'Načítavam…' : register ? 'Registrovať sa' : 'Prihlásiť sa'}</button></form><button type="button" className="text-button" onClick={() => setRegister(value => !value)}>{register ? 'Už mám účet' : 'Vytvoriť účet'}</button></section></main>
}
