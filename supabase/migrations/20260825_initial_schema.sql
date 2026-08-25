create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '', last_name text not null default '', avatar_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.categories (id text primary key, user_id uuid not null default auth.uid() references auth.users(id) on delete cascade, name text not null, icon text not null default 'bench');
create table public.exercises (id text primary key, user_id uuid not null default auth.uid() references auth.users(id) on delete cascade, category_id text, name text not null);
create table public.workouts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category_id text, name text not null, performed_at timestamptz not null,
  duration_minutes integer not null default 0 check (duration_minutes >= 0), completed boolean not null default true,
  notes text not null default '', rating integer not null default 0 check (rating between 0 and 5),
  body_weight numeric, body_fat_percentage numeric, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.workout_exercises (id uuid primary key default gen_random_uuid(), workout_id uuid not null references public.workouts(id) on delete cascade, exercise_id text references public.exercises(id) on delete set null, exercise_name text not null, position integer not null default 0);
create table public.exercise_sets (id uuid primary key default gen_random_uuid(), workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade, reps integer not null check (reps >= 0), weight numeric not null default 0 check (weight >= 0), position integer not null default 0);
alter table public.profiles enable row level security; alter table public.categories enable row level security; alter table public.exercises enable row level security; alter table public.workouts enable row level security; alter table public.workout_exercises enable row level security; alter table public.exercise_sets enable row level security;
create policy "own profile" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own categories" on public.categories for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own exercises" on public.exercises for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own workouts" on public.workouts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own workout exercises" on public.workout_exercises for all using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())) with check (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));
create policy "own exercise sets" on public.exercise_sets for all using (exists (select 1 from public.workout_exercises we join public.workouts w on w.id = we.workout_id where we.id = workout_exercise_id and w.user_id = auth.uid())) with check (exists (select 1 from public.workout_exercises we join public.workouts w on w.id = we.workout_id where we.id = workout_exercise_id and w.user_id = auth.uid()));
create or replace function public.create_profile() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, last_name) values (new.id, coalesce(new.raw_user_meta_data->>'first_name',''), coalesce(new.raw_user_meta_data->>'last_name',''));
  insert into public.categories (id, user_id, name, icon) values (new.id::text || ':push', new.id, 'Push tréning', 'bench'), (new.id::text || ':pull', new.id, 'Pull tréning', 'deadlift'), (new.id::text || ':legs', new.id, 'Nohy', 'squat');
  insert into public.exercises (id, user_id, category_id, name) values (new.id::text || ':bench', new.id, new.id::text || ':push', 'Bench press'), (new.id::text || ':deadlift', new.id, new.id::text || ':pull', 'Mŕtvy ťah'), (new.id::text || ':squat', new.id, new.id::text || ':legs', 'Drep');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_profile();
