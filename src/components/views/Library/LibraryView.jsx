import React from 'react'
import { Check, Dumbbell, Plus, Trash2, X } from 'lucide-react'
import { CategoryIcon, categoryIconOptions } from '../../atoms/CategoryIcon/CategoryIconView'

export const LibraryView = props => {
  const { categories, categoryIcon, categoryId, categoryName, editedName, editingId, exerciseName, exercises, t } = props
  return (
    <section className="page">
      <p className="eyebrow">{t('customPlan')}</p>
      <h1>{t('categoriesExercises').split('\n').map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{line}</React.Fragment>)}</h1>
      <p className="muted">{t('renameHint')}</p>
      <div className="manage-card">
        <h2>{t('newCategory')}</h2>
        <form className="create-form" onSubmit={props.onSubmitCategory}>
          <input value={categoryName} onChange={event => props.onCategoryNameChange(event.target.value)} placeholder={t('categoryPlaceholder')} />
          <button><Plus size={18} /> {t('add')}</button>
          <div className="category-icon-picker new-category-icons">{categoryIconOptions.map(option => <button className={categoryIcon === option.id ? 'selected' : ''} type="button" key={option.id} aria-label={t(option.labelKey)} title={t(option.labelKey)} onClick={() => props.onCategoryIconChange(option.id)}><option.Icon size={20} /></button>)}</div>
        </form>
      </div>
      <div className="manage-card">
        <h2>{t('newExercise')}</h2>
        <form className="create-form stacked" onSubmit={props.onSubmitExercise}>
          <input value={exerciseName} onChange={event => props.onExerciseNameChange(event.target.value)} placeholder={t('exercisePlaceholder')} />
          <select value={categoryId} onChange={event => props.onCategoryIdChange(event.target.value)}>{categories.map(category => <option value={category.id} key={category.id}>{category.name}</option>)}</select>
          <button><Plus size={18} /> {t('addExerciseButton')}</button>
        </form>
      </div>
      <div className="library-groups">
        {categories.map(category => (
          <article className="library-group" key={category.id}>
            <div className="library-title">
              <div className="library-category-main"><div className="library-category-icon"><CategoryIcon name={category.icon} size={21} /></div><div>
                <span>{exercises.filter(exercise => exercise.categoryId === category.id).length} {t('exercises').toUpperCase()}</span>
                {editingId === category.id ? <div className="rename-row"><input autoFocus value={editedName} onChange={event => props.onEditedNameChange(event.target.value)} onKeyDown={event => event.key === 'Enter' && props.onSaveRename()} /><button onClick={props.onSaveRename}><Check size={17} /></button></div> : <button className="editable-title" onClick={() => props.onBeginRename(category)}><h2>{category.name}</h2></button>}
              </div></div>
              <button onClick={() => props.onRemoveCategory(category.id)}><Trash2 size={17} /></button>
            </div>
            <div className="category-icon-picker">{categoryIconOptions.map(option => <button className={(category.icon || 'bench') === option.id ? 'selected' : ''} key={option.id} aria-label={t(option.labelKey)} title={t(option.labelKey)} onClick={() => props.onIconChange({ id: category.id, icon: option.id })}><option.Icon size={18} /></button>)}</div>
            {exercises.filter(exercise => exercise.categoryId === category.id).map(exercise => <div className="library-exercise" key={exercise.id}><Dumbbell size={16} /><span>{exercise.name}</span><button onClick={() => props.onRemoveExercise(exercise.id)}><X size={16} /></button></div>)}
          </article>
        ))}
      </div>
    </section>
  )
}
