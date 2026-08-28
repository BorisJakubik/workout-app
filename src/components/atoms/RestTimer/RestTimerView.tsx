import React from 'react'
import { Check, Pause, Play, RotateCcw } from 'lucide-react'
import type { RestTimerViewProps } from './RestTimerView.types'

export const RestTimerView = ({
  activeDots,
  formattedTime,
  isFinished,
  isRunning,
  onComplete,
  onPause,
  onReset,
  onResume,
  t,
}: RestTimerViewProps) => {
  return (
    <div className="rest-timer-view">
      <header>
        <p className="eyebrow">{t('restTimer')}</p>
        <strong>{isRunning ? t('restTimerRunning') : isFinished ? t('restTimerFinished') : t('restTimerPaused')}</strong>
      </header>
      <main>
        <div className="rest-timer-ring" role="timer" aria-label={`${t('restTimer')}: ${formattedTime}`}>
          {Array.from({ length: 60 }, (_, index) => (
            <span
              className={`rest-timer-dot ${index >= 60 - activeDots ? 'active' : ''}`}
              key={index}
              style={{ '--angle': `${index * 6}deg` } as React.CSSProperties}
            />
          ))}
          <strong>{formattedTime}</strong>
        </div>
        {isFinished ? (
          <button className="rest-timer-complete" type="button" onClick={onComplete} autoFocus>
            <Check size={19} /> {t('confirmRestTimer')}
          </button>
        ) : (
          <div className="rest-timer-view-actions">
            <button
              className="rest-timer-primary"
              type="button"
              onClick={isRunning ? onPause : onResume}
              aria-label={isRunning ? t('pauseRestTimer') : t('resumeRestTimer')}
            >
              {isRunning ? <Pause size={25} fill="currentColor" /> : <Play size={25} fill="currentColor" />}
            </button>
            <button className="rest-timer-reset" type="button" onClick={onReset}>
              <RotateCcw size={18} /> {t('endRestTimer')}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
