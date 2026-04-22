-- ================================================================
--  NASS Branch Tracker — Group Chat messages table
--  Persisted realtime chat for all authenticated users.
--  @AI messages: client inserts AI reply with is_ai_response=true
--                using their own user_id (RLS compliant).
-- ================================================================

create table if not exists public.nass_messages (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  user_email     text        not null,
  content        text        not null check(char_length(content) >= 1 and char_length(content) <= 2000),
  is_ai_response boolean     not null default false,
  created_at     timestamptz not null default now()
);

-- Index for chronological loading
create index if not exists nass_messages_created_at_idx
  on public.nass_messages(created_at desc);

-- RLS
alter table public.nass_messages enable row level security;

drop policy if exists "chat_read"  on public.nass_messages;
drop policy if exists "chat_write" on public.nass_messages;

-- All authenticated users can read all messages
create policy "chat_read"
  on public.nass_messages
  for select to authenticated
  using (true);

-- Users can only insert under their own user_id
-- (AI responses are inserted by the triggering user with is_ai_response=true)
create policy "chat_write"
  on public.nass_messages
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Enable realtime so clients receive live INSERTs
alter publication supabase_realtime add table public.nass_messages;
