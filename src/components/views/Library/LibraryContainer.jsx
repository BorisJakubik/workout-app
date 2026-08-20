import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addCategory, addLibraryExercise, removeCategory, removeLibraryExercise, renameCategory, updateCategoryIcon } from '../../../store'
import { useTranslation } from '../../../i18n'
import { LibraryView } from './LibraryView'

export const LibraryContainer = ({ categories, exercises }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [categoryName, setCategoryName] = useState('')
  const [categoryIcon, setCategoryIcon] = useState('bench')
  const [exerciseName, setExerciseName] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [editingId, setEditingId] = useState(null)
  const [editedName, setEditedName] = useState('')
  const submitCategory = event => { event.preventDefault(); if (!categoryName.trim()) return; dispatch(addCategory({ name: categoryName, icon: categoryIcon })); setCategoryName('') }
  const submitExercise = event => { event.preventDefault(); if (!exerciseName.trim() || !categoryId) return; dispatch(addLibraryExercise({ name: exerciseName, categoryId })); setExerciseName('') }
  const beginRename = category => { setEditingId(category.id); setEditedName(category.name) }
  const saveRename = () => { if (editedName.trim()) dispatch(renameCategory({ id: editingId, name: editedName })); setEditingId(null) }
  return <LibraryView categories={categories} categoryIcon={categoryIcon} categoryId={categoryId} categoryName={categoryName} editedName={editedName} editingId={editingId} exerciseName={exerciseName} exercises={exercises} onBeginRename={beginRename} onCategoryIconChange={setCategoryIcon} onCategoryIdChange={setCategoryId} onCategoryNameChange={setCategoryName} onEditedNameChange={setEditedName} onExerciseNameChange={setExerciseName} onIconChange={payload => dispatch(updateCategoryIcon(payload))} onRemoveCategory={id => dispatch(removeCategory(id))} onRemoveExercise={id => dispatch(removeLibraryExercise(id))} onSaveRename={saveRename} onSubmitCategory={submitCategory} onSubmitExercise={submitExercise} t={t} />
}

export { LibraryContainer as LibraryView }
