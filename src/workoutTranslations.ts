const slovakToEnglish = {
  'Push tréning': 'Push workout',
  'Pull tréning': 'Pull workout',
  Nohy: 'Legs',
  'Full body': 'Full body',
  'Prsia biceps': 'Chest & Biceps',
  'Triceps chrbát': 'Triceps & Back',
  'Nohy ramená': 'Legs & Shoulders',
  Brucho: 'Abs',
}

const englishToSlovak = Object.fromEntries(Object.entries(slovakToEnglish).map(([sk, en]) => [en, sk]))

export const translateWorkoutName = (name, language) => {
  if (!name) return name
  return language === 'en' ? slovakToEnglish[name] || name : englishToSlovak[name] || name
}

export const localizeWorkoutNames = (items = [], language) =>
  items.map(item => ({ ...item, name: translateWorkoutName(item.name, language) }))
