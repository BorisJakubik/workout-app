const slovakToEnglish = {
  'Bench press': 'Bench press',
  'Tlaky s jednoručkami': 'Dumbbell bench press',
  'Tlaky nad hlavu': 'Overhead press',
  Upažovanie: 'Lateral raises',
  'Tricepsové sťahovanie': 'Triceps pushdown',
  'Mŕtvy ťah': 'Deadlift',
  Zhyby: 'Pull-ups',
  'Príťahy v predklone': 'Bent-over rows',
  'Sťahovanie kladky': 'Lat pulldown',
  'Bicepsový zdvih': 'Biceps curl',
  Drep: 'Squat',
  'Leg press': 'Leg press',
  'Rumunský mŕtvy ťah': 'Romanian deadlift',
  Predkopávanie: 'Leg extension',
  'Výpony na lýtka': 'Calf raises',
  Plank: 'Plank',
  'Predkopávanie na stroji': 'Machine leg extension',
  'Bench press na úzko': 'Close-grip bench press',
  'Tlaky na ramená s jednoručkami': 'Dumbbell shoulder press',
  'Zakopávanie na stroji': 'Machine leg curl',
  'Výpony na stroji na lýtka': 'Machine calf raises',
  'L-sit': 'L-sit',
  'Posilňovaci stroj na brucho': 'Abdominal crunch machine',
  'Tlaky s jednoručkami na šikmej lavici': 'Incline dumbbell bench press',
  'Rozpažovanie (strihy) na horných kladkách': 'High cable crossover',
  'Peck Deck butterfly': 'Pec deck fly',
  'Bicepsový zdvih s osou': 'Barbell curl',
  'Striedavý bicepsový zdvih s jednoručkou': 'Alternating dumbbell curl',
  'Bicepsový zdvih scottova lavica': 'Preacher curl',
  'Upažovanie s kladkou v stoji': 'Standing cable lateral raise',
  'Vodorovné príťahy k hrudníku na stroji v sede (na široko)': 'Wide-grip seated machine row',
  'Vodorovné príťahy k hrudníku na stroji v sede (na úzko)': 'Close-grip seated machine row',
  'Dipy na bradlách': 'Parallel bar dips',
  'Príťahy kladky zhora k hrudníku (neutrál)': 'Neutral-grip lat pulldown',
  'Príťahy kladky zhora k hrudníku (na široko)': 'Wide-grip lat pulldown',
  'Príťahy jednoručné činky zospodu': 'Underhand one-arm dumbbell row',
  'Príťahy jednoručnej činky zospodu': 'Underhand one-arm dumbbell row',
  'Upažovanie vzad na stroji Peck-Deck': 'Reverse pec deck fly',
  'Vodorovné príťahy k hrudníku na kladke': 'Seated cable row',
  'Sťahovanie kladky na triceps nad hlavou': 'Overhead cable triceps extension',
  'Sťahovanie kladky na triceps v stoji': 'Standing cable triceps pushdown',
  'Sťahovanie kladky na chrbát v stoji': 'Standing straight-arm pulldown',
  'Upažovanie s jednoručkami': 'Dumbbell lateral raise',
  'Tlaky na ramená na stroji (Smith)': 'Smith machine shoulder press',
  'Predpažovanie s jednoručkami': 'Dumbbell front raise',
  'Bicepsový zdvih na spodnej kladke': 'Low cable biceps curl',
  'Tricepsový tlak s jednoručkou nad hlavou': 'Overhead dumbbell triceps extension',
}

const englishToSlovak = Object.fromEntries(Object.entries(slovakToEnglish).map(([sk, en]) => [en, sk]))

export const translateExerciseName = (name, language) => {
  if (!name) return name
  return language === 'en' ? slovakToEnglish[name] || name : englishToSlovak[name] || name
}

export const localizeExerciseNames = (items = [], language) => items.map(item => ({ ...item, name: translateExerciseName(item.name, language) }))

export const localizeWorkoutExerciseNames = (workouts = [], language) =>
  workouts.map(workout => ({ ...workout, exercises: localizeExerciseNames(workout.exercises, language) }))
