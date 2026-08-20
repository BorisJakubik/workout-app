import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Check, Dumbbell, Plus, Trash2, X } from 'lucide-react'
import { addCategory, addLibraryExercise, removeCategory, removeLibraryExercise, renameCategory } from '../store'
import { useTranslation } from '../i18n'

export const LibraryView = ({ categories, exercises }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [categoryName, setCategoryName] = useState('')
  const [exerciseName, setExerciseName] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [editingId, setEditingId] = useState(null)
  const [editedName, setEditedName] = useState('')
  const submitCategory = event => {
    event.preventDefault()
    if (!categoryName.trim()) return
    dispatch(addCategory(categoryName))
    setCategoryName('')
  }
  const submitExercise = event => {
    event.preventDefault()
    if (!exerciseName.trim() || !categoryId) return
    dispatch(addLibraryExercise({ name: exerciseName, categoryId }))
    setExerciseName('')
  }
  const beginRename = category => {
    setEditingId(category.id)
    setEditedName(category.name)
  }
  const saveRename = () => {
    if (editedName.trim()) dispatch(renameCategory({ id: editingId, name: editedName }))
    setEditingId(null)
  }

  return (
    <section className="page">
      <p className="eyebrow">{t('customPlan')}</p>
      <h1>
        {t('categoriesExercises')
          .split('\n')
          .map((line, index) => (
            <React.Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
      </h1>
      <p className="muted">{t('renameHint')}</p>
      <div className="manage-card">
        <h2>{t('newCategory')}</h2>
        <form className="create-form" onSubmit={submitCategory}>
          <input value={categoryName} onChange={event => setCategoryName(event.target.value)} placeholder={t('categoryPlaceholder')} />
          <button>
            <Plus size={18} /> {t('add')}
          </button>
        </form>
      </div>
      <div className="manage-card">
        <h2>{t('newExercise')}</h2>
        <form className="create-form stacked" onSubmit={submitExercise}>
          <input value={exerciseName} onChange={event => setExerciseName(event.target.value)} placeholder={t('exercisePlaceholder')} />
          <select value={categoryId} onChange={event => setCategoryId(event.target.value)}>
            {categories.map(category => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button>
            <Plus size={18} /> {t('addExerciseButton')}
          </button>
        </form>
      </div>
      <div className="library-groups">
        {categories.map(category => (
          <article className="library-group" key={category.id}>
            <div className="library-title">
              <div>
                <span>
                  {exercises.filter(exercise => exercise.categoryId === category.id).length} {t('exercises').toUpperCase()}
                </span>
                {editingId === category.id ? (
                  <div className="rename-row">
                    <input
                      autoFocus
                      value={editedName}
                      onChange={event => setEditedName(event.target.value)}
                      onKeyDown={event => event.key === 'Enter' && saveRename()}
                    />
                    <button onClick={saveRename}>
                      <Check size={17} />
                    </button>
                  </div>
                ) : (
                  <button className="editable-title" onClick={() => beginRename(category)}>
                    <h2>{category.name}</h2>
                  </button>
                )}
              </div>
              <button onClick={() => dispatch(removeCategory(category.id))}>
                <Trash2 size={17} />
              </button>
            </div>
            {exercises
              .filter(exercise => exercise.categoryId === category.id)
              .map(exercise => (
                <div className="library-exercise" key={exercise.id}>
                  <Dumbbell size={16} />
                  <span>{exercise.name}</span>
                  <button onClick={() => dispatch(removeLibraryExercise(exercise.id))}>
                    <X size={16} />
                  </button>
                </div>
              ))}
          </article>
        ))}
      </div>
    </section>
  )
}
