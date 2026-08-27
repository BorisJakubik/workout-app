# FitTrack

React 18/Vite workout tracker with Redux UI state, Supabase PostgreSQL persistence and email/password authentication.

## Features

- Create workouts with exercises, sets, reps, weights, notes and optional body metrics.
- Track a workout with start, pause, resume and finish states. The measured time is automatically copied to **Workout time** when the workout timer ends.
- Restart a finished workout timer after confirmation.
- Use an adjustable rest timer between sets. It defaults to one minute and opens a dedicated countdown screen with a 60-dot progress ring; confirmation is required after the countdown ends.
- Import exercises and sets from a previous workout in Additional details.
- Switch between Slovak and English, and between light and dark themes.

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
2. Run [`supabase/migrations/20260825_initial_schema.sql`](supabase/migrations/20260825_initial_schema.sql) in SQL Editor. It creates profiles, categories, exercises, workouts, workout exercises and sets, with RLS policies.
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
