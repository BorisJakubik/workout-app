import React, { useEffect, useState } from 'react'
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
  const [collapsedCategories, setCollapsedCategories] = useState({})
  const [deleteItem, setDeleteItem] = useState(null)
  useEffect(() => {
    if (!categories.some(category => category.id === categoryId)) setCategoryId(categories[0]?.id || '')
  }, [categories, categoryId])
  useEffect(() => {
    if (!deleteItem) return undefined
    const closeModal = event => event.key === 'Escape' && setDeleteItem(null)
    document.addEventListener('keydown', closeModal)
    return () => document.removeEventListener('keydown', closeModal)
  }, [deleteItem])
  const submitCategory = event => { event.preventDefault(); if (!categoryName.trim()) return; dispatch(addCategory({ name: categoryName, icon: categoryIcon })); setCategoryName('') }
  const submitExercise = event => { event.preventDefault(); if (!exerciseName.trim() || !categoryId) return; dispatch(addLibraryExercise({ name: exerciseName, categoryId })); setExerciseName('') }
  const beginRename = category => { setEditingId(category.id); setEditedName(category.name) }
  const saveRename = () => { if (editedName.trim()) dispatch(renameCategory({ id: editingId, name: editedName })); setEditingId(null) }
  const confirmDelete = () => {
    if (deleteItem.type === 'category') dispatch(removeCategory(deleteItem.id))
    else dispatch(removeLibraryExercise(deleteItem.id))
    setDeleteItem(null)
  }
  const toggleCategory = id => setCollapsedCategories(current => ({ ...current, [id]: !current[id] }))
  return <LibraryView categories={categories} categoryIcon={categoryIcon} categoryId={categoryId} categoryName={categoryName} collapsedCategories={collapsedCategories} deleteItem={deleteItem} editedName={editedName} editingId={editingId} exerciseName={exerciseName} exercises={exercises} onBeginRename={beginRename} onCancelDelete={() => setDeleteItem(null)} onCategoryIconChange={setCategoryIcon} onCategoryIdChange={setCategoryId} onCategoryNameChange={setCategoryName} onConfirmDelete={confirmDelete} onEditedNameChange={setEditedName} onExerciseNameChange={setExerciseName} onIconChange={payload => dispatch(updateCategoryIcon(payload))} onRemoveCategory={category => setDeleteItem({ id: category.id, name: category.name, type: 'category' })} onRemoveExercise={exercise => setDeleteItem({ id: exercise.id, name: exercise.name, type: 'exercise' })} onSaveRename={saveRename} onSubmitCategory={submitCategory} onSubmitExercise={submitExercise} onToggleCategory={toggleCategory} t={t} />
}

export { LibraryContainer as LibraryView }
