import React, { useEffect, useState } from 'react'
import { useTranslation } from '../../../i18n'
import { SettingsView } from './SettingsView'

export const SettingsContainer = ({ profile, theme, onSave, onThemeChange }) => {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)
  useEffect(() => setDraft(profile), [profile])
  const submit = event => {
    event.preventDefault()
    if (!draft.name.trim()) return
    onSave({ name: draft.name.trim(), surname: draft.surname.trim(), email: draft.email.trim(), photo: draft.photo })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }
  const selectPhoto = file => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setDraft(current => ({ ...current, photo: String(reader.result) }))
    reader.readAsDataURL(file)
  }
  const updateField = (field, value) => setDraft(current => ({ ...current, [field]: value }))
  return <SettingsView draft={draft} onFieldChange={updateField} onPhotoSelect={selectPhoto} onSubmit={submit} onThemeChange={onThemeChange} saved={saved} t={t} theme={theme} />
}

export { SettingsContainer as SettingsView }
