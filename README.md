# FitTrack

React 18/Vite workout tracker with React Router navigation, Redux UI state, Supabase PostgreSQL persistence and email/password authentication.

## Features

- Create workouts with exercises, sets, reps, weights, notes and optional body metrics.
- Track a workout with start, pause, resume and finish states. The measured time is automatically copied to **Workout time** when the workout timer ends.
- Restart a finished workout timer after confirmation.
- Use an adjustable rest timer between sets. It defaults to one minute and opens at `/workout/rest` with a 60-dot progress ring; confirmation is required after the countdown ends.
- Preserve an active workout and rest timer across an iPhone/browser reload. The active draft is restored from browser storage for the signed-in user and a running timer is recalculated from its end time.
- Import exercises and sets from a previous workout in Additional details.
- Switch between Slovak and English, and between light and dark themes.

## Routes

| Route | View |
| --- | --- |
| `/` | Dashboard |
| `/history` | Workout history |
| `/progress` | Progress overview |
| `/library` | Exercise library |
| `/settings` | Settings |
| `/workout` | Active workout |
| `/workout/rest` | Rest timer |
| `/workout/:workout_number` | Workout detail |
| `/workout/:workout_number/edit` | Workout editor |

## Local development

```bash
npm install
cp .env.example .env
# fill in the two VITE_SUPABASE values
npm run dev
```

The app is at `http://127.0.0.1:5173`. The browser receives only the public Supabase URL and **anon key**. Never place a `service_role` key in frontend code or Vercel variables.

## Supabase setup

1. Create a [Supabase](https://supabase.com/dashboard) project and enable Email/password in Authentication.
2. Run the SQL migrations in chronological order in Supabase SQL Editor:
   - [`supabase/migrations/20260825_initial_schema.sql`](supabase/migrations/20260825_initial_schema.sql) creates profiles, categories, exercises, workouts, workout exercises and sets, with RLS policies.
   - [`supabase/migrations/20260828_add_workout_number.sql`](supabase/migrations/20260828_add_workout_number.sql) adds a sequential `workout_number` to existing and new workouts. This number is used in workout URLs; UUID stays as the internal relational key.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`, then restart the server.
4. Register an account. If email confirmation is enabled, confirm the email before signing in.

RLS means a signed-in user can access only their own profile, library and workout records. Ownership for sets and workout exercises is inherited from the parent workout.

## JSON import

`data/fitness-data.json` is now only a one-time backup source, never read by the app. Put `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`, then run `IMPORT_EMAIL=... IMPORT_PASSWORD=... npm run import:json`. The importer signs in with the anon key and therefore remains constrained by the same RLS policies; it never needs a service-role key.

## Scripts

```bash
npm test
npm run test:watch
npm run test:coverage
npm run lint
npm run build
```

Tests cover reducer-level workout creation/finish, editing, deletion and the workout shape used during loading. Live Supabase responses, email confirmation and browser navigation are not yet covered.

## Vercel

Import the repository, use `npm run build` and output directory `dist`, then add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables. Add the deployment URL in Supabase Authentication → URL Configuration → Redirect URLs.
