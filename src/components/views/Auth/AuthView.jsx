import React, { useCallback, useState } from 'react'
import { Turnstile } from '../../molecules/Turnstile/Turnstile'

export const AuthView = ({ onLogin, onRegister, onLanguageChange, error, language, loading, t }) => {
  const [register, setRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const [captchaError, setCaptchaError] = useState(false)
  const [captchaVersion, setCaptchaVersion] = useState(0)
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const handleCaptchaError = useCallback(() => setCaptchaError(true), [])
  const handleCaptchaToken = useCallback(token => {
    setCaptchaToken(token)
    setCaptchaError(false)
  }, [])
  const submit = async event => {
    event.preventDefault()
    if (!captchaToken) return
    await (register ? onRegister : onLogin)({ email, password, captchaToken })
    setCaptchaToken(null)
    setCaptchaVersion(version => version + 1)
  }
  const switchMode = () => {
    setRegister(value => !value)
    setCaptchaToken(null)
    setCaptchaError(false)
    setCaptchaVersion(version => version + 1)
  }
  return <main className="auth-page"><section className="auth-card"><div className="auth-card-header"><div className="brand-mark">🏋</div><button type="button" className="language-toggle auth-language-toggle" onClick={onLanguageChange} aria-label={t('changeLanguage')}>{language === 'sk' ? 'EN' : 'SK'}</button></div><h1>{register ? t('signUp') : t('signIn')}</h1><p>{register ? t('signUpHint') : t('signInHint')}</p><form onSubmit={submit}><label>{t('email')}<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></label><label>{t('password')}<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" autoComplete={register ? 'new-password' : 'current-password'} /></label>{siteKey ? <Turnstile key={`${register}-${language}-${captchaVersion}`} language={language} onError={handleCaptchaError} onToken={handleCaptchaToken} siteKey={siteKey} /> : <p role="alert" className="form-error">{t('captchaConfigurationMissing')}</p>}{captchaError && <p role="alert" className="form-error">{t('captchaVerificationFailed')}</p>}{error && <p role="alert" className="form-error">{error}</p>}<button type="submit" className="primary-button" disabled={loading || !captchaToken}>{loading ? t('loading') : register ? t('signUpAction') : t('signInAction')}</button></form><button type="button" className="text-button" onClick={switchMode}>{register ? t('alreadyHaveAccount') : t('createAccount')}</button></section></main>
}
