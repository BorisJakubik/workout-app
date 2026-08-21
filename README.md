# FitTrack

FitTrack is a mobile-first React application for logging strength workouts and tracking training and body-composition progress.

## Features

- Start workouts from built-in or custom training categories.
- Create, rename, iconize, collapse, and delete workout categories.
- Build a custom exercise library and organize exercises by category.
- Log exercises with editable sets, repetitions, and weight, and remove individual sets when needed.
- Reuse a previous workout by date or automatically begin with the latest workout from the selected category.
- Record workout date, duration, body weight, body-fat percentage, rating, and notes.
- Dictate workout notes using the browser's Speech Recognition API when supported.
- Browse completed workouts in the history and monthly calendar views.
- Open, edit, or delete previously completed workouts.
- Review workout-duration charts, body-weight and body-fat trends, and progress for the powerlifting big three (squat, bench press, and deadlift).
- Track the big-three total, heaviest sets, and personal records.
- Switch between kilograms and pounds; stored values are converted automatically for display and editing.
- Switch the interface between English and Slovak, including built-in workout and exercise names.
- Choose a light or dark theme and manage profile details and a profile photo.
- Use a responsive interface designed primarily for mobile devices.

## Tech Stack

- React 18
- Redux Toolkit and React Redux
- Vite
- Lucide React
- Node.js development server

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm or pnpm

### Installation

```bash
npm install
npm run dev
```

The application is available at [http://127.0.0.1:5173](http://127.0.0.1:5173).

To create a production build, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

## Data Persistence

Application state is managed with Redux Toolkit and cached in `localStorage`. During development, the custom Node.js server also loads data from `data/fitness-data.json` and writes state changes back to that file through the `/api/data` endpoint.

The persisted data includes workouts, the exercise library, categories, language and unit preferences, theme, profile details, and an active workout.

## Available Scripts

- `npm run dev` starts the Vite development middleware and local data API.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` previews the production build.
- `npm run format` formats the project with Prettier.
- `npm run format:check` checks formatting without changing files.

## Browser Notes

Voice dictation depends on the browser's implementation of the Speech Recognition API and requires microphone permission. The notes field remains available for regular text entry when speech recognition is unsupported.
