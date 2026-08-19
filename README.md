# FitTrack

Mobilne orientovaná React aplikácia na zapisovanie silových tréningov a sledovanie progresu.

## Spustenie

```bash
npm install
npm run dev
```

Vývojový server načítava dáta zo súboru `data/fitness-data.json`. Zmeny v aplikácii sa automaticky zapisujú späť do tohto súboru.

Produkčný build vytvoríš príkazom `npm run build`.

## Funkcie MVP

- výber typu tréningu,
- vlastné tréningové kategórie a vlastná knižnica cvikov,
- pridávanie a premenovanie cvikov,
- zapisovanie sérií, opakovaní a váhy,
- história tréningov,
- detail tréningu so všetkými sériami, váhami, časom, poznámkami a hodnotením,
- úprava existujúcich tréningov priamo z detailu histórie,
- výber vlastného dátumu tréningu,
- mesačný kalendár s označenými tréningovými dňami,
- prehľad času tréningov a osobného rekordu,
- správa aplikačných dát cez Redux Toolkit,
- automatická persistencia Redux stavu do `localStorage`,
- responzívne mobilné rozhranie.
