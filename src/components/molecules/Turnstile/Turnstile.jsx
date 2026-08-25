import React, { useEffect, useRef } from 'react'

const SCRIPT_ID = 'cloudflare-turnstile-script'

export const Turnstile = ({ language, onError, onToken, siteKey }) => {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        language,
        callback: onToken,
        'error-callback': onError,
        'expired-callback': () => onToken(null),
      })
    }

    const script = document.getElementById(SCRIPT_ID)
    if (window.turnstile) renderWidget()
    else if (script) script.addEventListener('load', renderWidget, { once: true })
    else {
      const turnstileScript = document.createElement('script')
      turnstileScript.id = SCRIPT_ID
      turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      turnstileScript.async = true
      turnstileScript.addEventListener('load', renderWidget, { once: true })
      document.head.appendChild(turnstileScript)
    }

    return () => {
      cancelled = true
      if (widgetIdRef.current != null && window.turnstile) window.turnstile.remove(widgetIdRef.current)
    }
  }, [language, onError, onToken, siteKey])

  return <div className="turnstile-widget" ref={containerRef} />
}
