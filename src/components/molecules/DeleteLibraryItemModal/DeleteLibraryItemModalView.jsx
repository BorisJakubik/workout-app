import React from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'

export const DeleteLibraryItemModalView = ({ item, onCancel, onDelete, t }) => {
  const isCategory = item.type === 'category'
  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onCancel()}>
      <div
        className="delete-workout-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-library-title"
        aria-describedby="delete-library-description"
      >
        <div className="delete-workout-icon">
          <AlertTriangle size={22} />
        </div>
        <div>
          <p className="eyebrow">{t('deleteWarning')}</p>
          <h2 id="delete-library-title">{t(isCategory ? 'deleteCategoryTitle' : 'deleteExerciseTitle')}</h2>
          <p id="delete-library-description">{t(isCategory ? 'deleteCategoryConfirm' : 'deleteExerciseConfirm').replace('{name}', item.name)}</p>
        </div>
        <div className="delete-workout-modal-actions">
          <button className="modal-cancel" onClick={onCancel} autoFocus>
            {t('cancel')}
          </button>
          <button className="modal-delete" onClick={onDelete}>
            <Trash2 size={16} /> {t('delete')}
          </button>
        </div>
      </div>
    </div>
  )
}
