export const formatDate = (value, locale = 'sk-SK') => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(value))
export const toDateInputValue = value => {
  const date = value ? new Date(value) : new Date()
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export const POUNDS_PER_KILOGRAM = 2.20462

export const weightFromKg = (value, unit = 'kg') => {
  if (value == null || value === '') return value
  const weight = Number(value)
  const displayedWeight = unit === 'lbs' ? weight * POUNDS_PER_KILOGRAM : weight
  return Number(displayedWeight.toFixed(2))
}

export const weightToKg = (value, unit = 'kg') => {
  if (value == null || value === '') return value
  const weight = Number(value)
  return unit === 'lbs' ? Number((weight / POUNDS_PER_KILOGRAM).toFixed(8)) : weight
}
