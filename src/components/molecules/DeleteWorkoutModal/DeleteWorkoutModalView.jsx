import React from 'react'
import { Trash2 } from 'lucide-react'

export const DeleteWorkoutModalView = ({ onCancel, onDelete, t }) => (
  <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onCancel()}>
    <div className="delete-workout-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-workout-title" aria-describedby="delete-workout-description">
      <div className="delete-workout-icon"><Trash2 size={22} /></div>
      <div>
        <p className="eyebrow">{t('deleteWorkout')}</p>
        <h2 id="delete-workout-title">{t('deleteWorkoutTitle')}</h2>
        <p id="delete-workout-description">{t('deleteWorkoutConfirm')}</p>
      </div>
      <div className="delete-workout-modal-actions">
        <button className="modal-cancel" onClick={onCancel} autoFocus>{t('cancel')}</button>
        <button className="modal-delete" onClick={onDelete}><Trash2 size={16} /> {t('delete')}</button>
      </div>
    </div>
  </div>
)
