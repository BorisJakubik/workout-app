-- Keep UUID as the internal relational key, but expose a compact sequential
-- number for URLs and user-facing references (for example /workout/42/edit).
begin;

create sequence if not exists public.workouts_workout_number_seq;

alter table public.workouts
  add column if not exists workout_number bigint;

-- Existing rows get deterministic numbers. created_at is the primary ordering;
-- UUID breaks ties so the result remains stable.
with numbered_workouts as (
  select id, row_number() over (order by created_at asc, id asc)::bigint as workout_number
  from public.workouts
)
update public.workouts as workout
set workout_number = numbered_workouts.workout_number
from numbered_workouts
where workout.id = numbered_workouts.id
  and workout.workout_number is null;

alter table public.workouts
  alter column workout_number set default nextval('public.workouts_workout_number_seq'::regclass),
  alter column workout_number set not null;

select setval(
  'public.workouts_workout_number_seq',
  coalesce((select max(workout_number) from public.workouts), 0) + 1,
  false
);

alter sequence public.workouts_workout_number_seq
  owned by public.workouts.workout_number;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'workouts_workout_number_key'
      and conrelid = 'public.workouts'::regclass
  ) then
    alter table public.workouts
      add constraint workouts_workout_number_key unique (workout_number);
  end if;
end $$;

commit;
