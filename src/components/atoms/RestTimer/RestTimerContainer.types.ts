export interface RestTimerContainerProps {
  restTimerState: 'idle' | 'running' | 'paused' | 'finished'
  remainingSeconds: number
  restDurationSeconds: number
  onComplete: () => void
  onPause: () => void
  onReset: () => void
  onResume: () => void
}
