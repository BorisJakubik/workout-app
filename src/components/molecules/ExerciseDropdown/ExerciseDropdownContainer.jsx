import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../../i18n'
import { ExerciseDropdownView } from './ExerciseDropdownView'

export const ExerciseDropdownContainer = ({ exercises, categoryId, value, onChange }) => {
  const { t } = useTranslation()
  const [showAll, setShowAll] = useState(false)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const categoryExercises = exercises.filter(exercise => exercise.categoryId === categoryId)
  const otherExercises = exercises.filter(exercise => exercise.categoryId !== categoryId)
  const visibleExercises = showAll || !categoryExercises.length ? [...categoryExercises, ...otherExercises] : categoryExercises

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

  const selectExercise = name => {
    onChange(name)
    setOpen(false)
  }
  return <ExerciseDropdownView canShowAll={!showAll && categoryExercises.length > 0 && otherExercises.length > 0} dropdownRef={dropdownRef} onExpand={() => setShowAll(true)} onSelect={selectExercise} onToggle={() => setOpen(current => !current)} open={open} t={t} value={value} visibleExercises={visibleExercises} />
}

export { ExerciseDropdownContainer as ExerciseDropdown }
