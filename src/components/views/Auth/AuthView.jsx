import React, { useState } from 'react'

export const AuthView = ({ onLogin, onRegister, onLanguageChange, error, language, loading, t }) => {
  const [register, setRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submit = event => {
    event.preventDefault()
    ;(register ? onRegister : onLogin)({ email, password })
  }
  return <main className="auth-page"><section className="auth-card"><div className="auth-card-header"><div className="brand-mark">🏋</div><button type="button" className="language-toggle auth-language-toggle" onClick={onLanguageChange} aria-label={t('changeLanguage')}>{language === 'sk' ? 'EN' : 'SK'}</button></div><h1>{register ? t('signUp') : t('signIn')}</h1><p>{register ? t('signUpHint') : t('signInHint')}</p><form onSubmit={submit}><label>{t('email')}<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></label><label>{t('password')}<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" autoComplete={register ? 'new-password' : 'current-password'} /></label>{error && <p role="alert" className="form-error">{error}</p>}<button type="submit" className="primary-button" disabled={loading}>{loading ? t('loading') : register ? t('signUpAction') : t('signInAction')}</button></form><button type="button" className="text-button" onClick={() => setRegister(value => !value)}>{register ? t('alreadyHaveAccount') : t('createAccount')}</button></section></main>
}
