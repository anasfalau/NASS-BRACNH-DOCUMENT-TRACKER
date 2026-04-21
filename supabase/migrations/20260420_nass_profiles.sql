-- ================================================================
--  NASS Branch Tracker — User Profiles & Role Management
-- ================================================================

create table if not exists public.nass_profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade not null unique,
  email        text not null,
  display_name text,
  role         text not null default 'viewer'
                 check (role in ('superuser','editor','viewer')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.nass_profiles enable row level security;

-- Any authenticated user can read all profiles
-- (needed so the app can load the current user's role, and superusers can list all users)
create policy "profiles_select"
  on public.nass_profiles for select
  to authenticated using (true);

-- All writes (insert, update, delete) are performed by the manage-users
-- Edge Function using the service role key, which bypasses RLS.

-- ── Seed the first superuser ─────────────────────────────────────
insert into public.nass_profiles (user_id, email, role)
select id, email, 'superuser'
from auth.users
where email = 'nassbranch01@gmail.com'
on conflict (user_id) do update set role = 'superuser';
