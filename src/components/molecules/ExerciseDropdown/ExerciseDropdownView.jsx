import React from 'react'
import { Check, ChevronDown } from 'lucide-react'

export const ExerciseDropdownView = ({ canShowAll, dropdownRef, onExpand, onSelect, onToggle, open, t, value, visibleExercises }) => (
  <div className="exercise-dropdown" ref={dropdownRef}>
    <button className="exercise-dropdown-trigger" type="button" aria-label={t('addExercise')} aria-haspopup="listbox" aria-expanded={open} onClick={onToggle}>
      <span>{value}</span><ChevronDown size={17} />
    </button>
    {open && (
      <div className="exercise-dropdown-menu" role="listbox">
        {visibleExercises.map(exercise => (
          <button className={value === exercise.name ? 'selected' : ''} type="button" role="option" aria-selected={value === exercise.name} key={exercise.id} onClick={() => onSelect(exercise.name)}>
            {exercise.name}{value === exercise.name && <Check size={15} />}
          </button>
        ))}
        {canShowAll && <button className="expand-exercises" type="button" onClick={onExpand}><span>•••</span> {t('showAllExercises')}</button>}
      </div>
    )}
  </div>
)
