import React from 'react'
import { Check, ChevronDown, Dumbbell, Plus, Trash2, X } from 'lucide-react'
import { CategoryIcon, categoryIconOptions } from '../../atoms/CategoryIcon/CategoryIconView'
import { CategoryDropdown } from '../../molecules/CategoryDropdown/CategoryDropdownContainer'
import { DeleteLibraryItemModalView } from '../../molecules/DeleteLibraryItemModal/DeleteLibraryItemModalView'
import type { LibraryViewProps } from './LibraryView.types'

export const LibraryView = (props: LibraryViewProps) => {
  const { categories, categoryIcon, categoryId, categoryName, editedName, editingId, exerciseName, exercises, t } = props
  const exerciseOptions = [...new Set<string>((exercises as { name: string }[]).map(exercise => exercise.name.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  )
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
        <form className="create-form" onSubmit={props.onSubmitCategory}>
          <input value={categoryName} onChange={event => props.onCategoryNameChange(event.target.value)} placeholder={t('categoryPlaceholder')} />
          <button>
            <Plus size={18} /> {t('add')}
          </button>
          <div className="category-icon-picker new-category-icons">
            {categoryIconOptions.map(option => (
              <button
                className={categoryIcon === option.id ? 'selected' : ''}
                type="button"
                key={option.id}
                aria-label={t(option.labelKey)}
                title={t(option.labelKey)}
                onClick={() => props.onCategoryIconChange(option.id)}
              >
                <option.Icon size={20} />
              </button>
            ))}
          </div>
        </form>
      </div>
      <div className="manage-card">
        <h2>{t('newExercise')}</h2>
        <form className="create-form stacked" onSubmit={props.onSubmitExercise}>
          <input
            list="library-exercise-options"
            value={exerciseName}
            onChange={event => props.onExerciseNameChange(event.target.value)}
            placeholder={t('exercisePlaceholder')}
          />
          <datalist id="library-exercise-options">
            {exerciseOptions.map(name => (
              <option value={name} key={name} />
            ))}
          </datalist>
          <small className="exercise-selection-hint">{t('exerciseSelectionHint')}</small>
          <CategoryDropdown categories={categories} value={categoryId} onChange={props.onCategoryIdChange} />
          <button>
            <Plus size={18} /> {t('addExerciseButton')}
          </button>
        </form>
      </div>
      <div className="library-groups">
        {categories.map(category => {
          const categoryExercises = exercises.filter(exercise => exercise.categoryId === category.id)
          const collapsed = Boolean(props.collapsedCategories[category.id])
          return (
            <article className={`library-group${collapsed ? ' collapsed' : ''}`} key={category.id}>
              <div className="library-title">
                <div className="library-category-main">
                  <button
                    className="library-collapse-button"
                    type="button"
                    aria-label={t(collapsed ? 'expandCategory' : 'collapseCategory')}
                    aria-expanded={!collapsed}
                    onClick={() => props.onToggleCategory(category.id)}
                  >
                    <ChevronDown size={18} />
                  </button>
                  <div className="library-category-icon">
                    <CategoryIcon name={category.icon} size={21} />
                  </div>
                  <div>
                    <span>
                      {categoryExercises.length} {t('exercises').toUpperCase()}
                    </span>
                    {editingId === category.id ? (
                      <div className="rename-row">
                        <input
                          autoFocus
                          value={editedName}
                          onChange={event => props.onEditedNameChange(event.target.value)}
                          onKeyDown={event => event.key === 'Enter' && props.onSaveRename()}
                        />
                        <button onClick={props.onSaveRename}>
                          <Check size={17} />
                        </button>
                      </div>
                    ) : (
                      <button className="editable-title" onClick={() => props.onBeginRename(category)}>
                        <h2>{category.name}</h2>
                      </button>
                    )}
                  </div>
                </div>
                <button aria-label={t('deleteCategory')} onClick={() => props.onRemoveCategory(category)}>
                  <Trash2 size={17} />
                </button>
              </div>
              {!collapsed && (
                <div className="library-group-content">
                  <div className="category-icon-picker">
                    {categoryIconOptions.map(option => (
                      <button
                        className={(category.icon || 'bench') === option.id ? 'selected' : ''}
                        key={option.id}
                        aria-label={t(option.labelKey)}
                        title={t(option.labelKey)}
                        onClick={() => props.onIconChange({ id: category.id, icon: option.id })}
                      >
                        <option.Icon size={18} />
                      </button>
                    ))}
                  </div>
                  {categoryExercises.map(exercise => (
                    <div className="library-exercise" key={exercise.id}>
                      <Dumbbell size={16} />
                      <span>{exercise.name}</span>
                      <button aria-label={t('deleteExercise')} onClick={() => props.onRemoveExercise(exercise)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>
      {props.deleteItem && (
        <DeleteLibraryItemModalView item={props.deleteItem} onCancel={props.onCancelDelete} onDelete={props.onConfirmDelete} t={t} />
      )}
    </section>
  )
}
