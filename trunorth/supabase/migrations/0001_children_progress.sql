-- TruNorth — Supabase schema for parent accounts' children + progress (ADR-003).
-- Parents ARE Supabase Auth users (auth.users); no separate parents table.
-- Run: paste into the Supabase dashboard SQL Editor and execute once.
-- (Setup walkthrough: docs/context/server-auth-supabase.md)

create table public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 30),
  age_band text not null default '8-10',
  avatar_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index child_profiles_parent_idx on public.child_profiles (parent_id);

create table public.progress (
  child_id uuid primary key references public.child_profiles (id) on delete cascade,
  game_state_json jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid not null,
  action text not null,
  resource_id text,
  created_at timestamptz not null default now()
);

-- RLS: defense-in-depth. The Hono gateway uses the service-role key (which
-- bypasses RLS) and scopes queries itself; these policies protect the tables
-- from any direct anon/authenticated access (e.g. a leaked anon-key query).
alter table public.child_profiles enable row level security;
alter table public.progress enable row level security;
alter table public.audit_logs enable row level security; -- no policies: service-role only

create policy "parents manage own children"
  on public.child_profiles
  for all
  to authenticated
  using (parent_id = (select auth.uid()))
  with check (parent_id = (select auth.uid()));

create policy "parents manage own children's progress"
  on public.progress
  for all
  to authenticated
  using (
    exists (
      select 1 from public.child_profiles c
      where c.id = progress.child_id and c.parent_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.child_profiles c
      where c.id = progress.child_id and c.parent_id = (select auth.uid())
    )
  );
