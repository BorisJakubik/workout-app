import React from 'react'
import { Camera, Check, Moon, Sun, Trash2 } from 'lucide-react'

export const SettingsView = ({ draft, onFieldChange, onPhotoSelect, onSubmit, onThemeChange, saved, t, theme }) => (
  <section className="page settings-page">
    <p className="eyebrow">{t('preferences')}</p><h1>{t('settings')}</h1><p className="muted">{t('settingsHint')}</p>
    <div className="settings-card">
      <div className="settings-card-heading"><div><p className="eyebrow">{t('appearance')}</p><h2>{t('colorMode')}</h2></div></div>
      <div className="theme-options">
        <button className={theme === 'dark' ? 'selected' : ''} onClick={() => onThemeChange('dark')}><Moon /><span><strong>{t('darkMode')}</strong><small>{t('darkModeHint')}</small></span></button>
        <button className={theme === 'light' ? 'selected' : ''} onClick={() => onThemeChange('light')}><Sun /><span><strong>{t('lightMode')}</strong><small>{t('lightModeHint')}</small></span></button>
      </div>
    </div>
    <form className="settings-card profile-settings" onSubmit={onSubmit}>
      <div className="settings-card-heading"><div><p className="eyebrow">{t('profile')}</p><h2>{t('personalDetails')}</h2></div></div>
      <div className="profile-photo-setting">
        <div className="profile-photo-preview">{draft.photo ? <img src={draft.photo} alt={t('profilePhoto')} /> : `${draft.name.trim()[0] || ''}${draft.surname.trim()[0] || ''}`.toUpperCase() || 'U'}</div>
        <div className="profile-photo-actions"><strong>{t('profilePhoto')}</strong><small>{t('profilePhotoHint')}</small><div>
          <label className="upload-photo"><Camera size={16} /> {t('choosePhoto')}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => onPhotoSelect(event.target.files?.[0])} /></label>
          {draft.photo && <button type="button" className="remove-photo" onClick={() => onFieldChange('photo', '')}><Trash2 size={15} /> {t('removePhoto')}</button>}
        </div></div>
      </div>
      <label>{t('name')}<input required value={draft.name} onChange={event => onFieldChange('name', event.target.value)} placeholder={t('namePlaceholder')} /></label>
      <label>{t('surname')}<input value={draft.surname} onChange={event => onFieldChange('surname', event.target.value)} placeholder={t('surnamePlaceholder')} /></label>
      <label><span>{t('email')} <small>{t('optional')}</small></span><input type="email" value={draft.email} onChange={event => onFieldChange('email', event.target.value)} placeholder="name@example.com" /></label>
      <button className="save-settings"><Check size={18} /> {saved ? t('saved') : t('saveChanges')}</button>
    </form>
  </section>
)
