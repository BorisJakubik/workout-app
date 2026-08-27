import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../../i18n'
import { CategoryDropdownView } from './CategoryDropdownView'
import type { CategoryDropdownContainerProps } from './CategoryDropdownContainer.types'

export const CategoryDropdownContainer = ({ categories, value, onChange }: CategoryDropdownContainerProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const closeDropdown = event => {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      if (event.type === 'pointerdown' && dropdownRef.current?.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', closeDropdown)
    document.addEventListener('keydown', closeDropdown)
    return () => {
      document.removeEventListener('pointerdown', closeDropdown)
      document.removeEventListener('keydown', closeDropdown)
    }
  }, [open])

  const selectCategory = id => {
    onChange(id)
    setOpen(false)
  }

  return (
    <CategoryDropdownView
      categories={categories}
      dropdownRef={dropdownRef}
      onSelect={selectCategory}
      onToggle={() => setOpen(current => !current)}
      open={open}
      t={t}
      value={value}
    />
  )
}

export { CategoryDropdownContainer as CategoryDropdown }
