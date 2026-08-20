import React from 'react'
import { Check, ChevronDown } from 'lucide-react'

export const CategoryDropdownView = ({ categories, dropdownRef, onSelect, onToggle, open, t, value }) => {
  const selectedCategory = categories.find(category => category.id === value)

  return (
    <div className="exercise-dropdown category-dropdown" ref={dropdownRef}>
      <button className="exercise-dropdown-trigger" type="button" aria-label={t('selectCategory')} aria-haspopup="listbox" aria-expanded={open} onClick={onToggle}>
        <span>{selectedCategory?.name || t('selectCategory')}</span><ChevronDown size={17} />
      </button>
      {open && (
        <div className="exercise-dropdown-menu" role="listbox">
          {categories.map(category => (
            <button className={value === category.id ? 'selected' : ''} type="button" role="option" aria-selected={value === category.id} key={category.id} onClick={() => onSelect(category.id)}>
              {category.name}{value === category.id && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
