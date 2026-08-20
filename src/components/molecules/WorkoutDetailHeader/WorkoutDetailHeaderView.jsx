import React from 'react'
import { Check, ChevronLeft, Edit3, EllipsisVertical, Trash2, X } from 'lucide-react'

export const WorkoutDetailHeaderView = ({ editing, menuOpen, menuRef, onBack, onCancelEdit, onDeleteRequest, onEdit, onMenuToggle, onNameChange, onSave, t, workout }) => (
  <header className="editor-header">
    <button className="icon-btn" onClick={onBack}><ChevronLeft /></button>
    <div className="detail-header-title">
      <p className="eyebrow">{editing ? t('editWorkout') : t('workoutDetail')}</p>
      {editing ? <input value={workout.name} onChange={event => onNameChange(event.target.value)} /> : <h2>{workout.name}</h2>}
    </div>
    {editing ? (
      <div className="edit-actions">
        <button className="icon-btn" onClick={onCancelEdit}><X /></button>
        <button className="finish-top" onClick={onSave}><Check size={18} /> {t('save')}</button>
      </div>
    ) : (
      <div className="workout-actions" ref={menuRef}>
        <button className="icon-btn workout-actions-trigger" aria-label={t('workoutActions')} aria-haspopup="menu" aria-expanded={menuOpen} onClick={onMenuToggle}><EllipsisVertical /></button>
        {menuOpen && (
          <div className="workout-actions-menu" role="menu">
            <button role="menuitem" onClick={onEdit}><Edit3 size={16} /> {t('edit')}</button>
            <button className="danger" role="menuitem" onClick={onDeleteRequest}><Trash2 size={16} /> {t('deleteWorkout')}</button>
          </div>
        )}
      </div>
    )}
  </header>
)
