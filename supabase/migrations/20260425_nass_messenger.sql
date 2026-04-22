-- ================================================================
--  NASS Branch Tracker — Messenger (DMs + Group Chats)
--
--  Replaces the simple single-room nass_messages table with a
--  full WhatsApp-style conversation system:
--    nass_conversations  — one row per DM or group chat
--    nass_conv_members   — who belongs to each conversation
--    nass_messages       — messages (now scoped to a conversation)
--
--  NOTE: If you previously ran 20260425_nass_messages.sql (the
--  simple group-chat schema without conversation_id), run this
--  migration INSTEAD — it drops and recreates nass_messages.
-- ================================================================

-- ── Drop old simple group-chat table (no conversation_id) ────────
drop table  if exists public.nass_messages cascade;

-- ── Conversations ────────────────────────────────────────────────
create table if not exists public.nass_conversations (
  id          uuid  primary key default gen_random_uuid(),
  type        text  not null check(type in ('direct','group')),
  name        text,                                         -- group name only
  created_by  uuid  references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  last_msg_at timestamptz not null default now()           -- for sorting
);

-- ── Members ──────────────────────────────────────────────────────
create table if not exists public.nass_conv_members (
  conversation_id uuid not null references public.nass_conversations(id) on delete cascade,
  user_id         uuid not null references auth.users(id)  on delete cascade,
  user_email      text not null,
  last_read_at    timestamptz default now(),                -- unread tracking
  primary key (conversation_id, user_id)
);

-- ── Messages ─────────────────────────────────────────────────────
create table if not exists public.nass_messages (
  id              uuid  primary key default gen_random_uuid(),
  conversation_id uuid  not null references public.nass_conversations(id) on delete cascade,
  user_id         uuid  not null references auth.users(id)  on delete cascade,
  user_email      text  not null,
  content         text  not null check(char_length(content) between 1 and 2000),
  is_ai_response  boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────────
create index if not exists nass_conv_members_user_idx
  on public.nass_conv_members(user_id);
create index if not exists nass_messages_conv_idx
  on public.nass_messages(conversation_id, created_at);
create index if not exists nass_conv_last_msg_idx
  on public.nass_conversations(last_msg_at desc);

-- ── Trigger: update last_msg_at when a message is inserted ───────
create or replace function public.fn_update_conv_last_msg()
returns trigger language plpgsql security definer as $$
begin
  update public.nass_conversations
  set    last_msg_at = new.created_at
  where  id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists trg_update_conv_last_msg on public.nass_messages;
create trigger trg_update_conv_last_msg
  after insert on public.nass_messages
  for each row execute function public.fn_update_conv_last_msg();

-- ── Security-definer helper (avoids RLS recursion) ───────────────
-- This function runs with owner privileges (bypasses RLS on
-- nass_conv_members), breaking the infinite-recursion loop that
-- would occur if the members_select policy queried itself.
create or replace function public.fn_is_conv_member(conv_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.nass_conv_members
    where conversation_id = conv_id
      and user_id = auth.uid()
  );
$$;

-- ── RLS: Conversations ───────────────────────────────────────────
alter table public.nass_conversations enable row level security;

drop policy if exists "conv_select" on public.nass_conversations;
create policy "conv_select" on public.nass_conversations
  for select to authenticated using (
    public.fn_is_conv_member(id)
  );

-- Trigger auto-sets created_by = auth.uid() so client never needs to send it.
-- The insert policy is simply "any authenticated user may create a conversation."
create or replace function public.fn_set_conv_created_by()
returns trigger language plpgsql security definer as $$
begin
  new.created_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists trg_set_conv_created_by on public.nass_conversations;
create trigger trg_set_conv_created_by
  before insert on public.nass_conversations
  for each row execute function public.fn_set_conv_created_by();

drop policy if exists "conv_insert" on public.nass_conversations;
create policy "conv_insert" on public.nass_conversations
  for insert to authenticated with check (true);

drop policy if exists "conv_update" on public.nass_conversations;
create policy "conv_update" on public.nass_conversations
  for update to authenticated
  using (public.fn_is_conv_member(id));

-- ── RLS: Members ─────────────────────────────────────────────────
alter table public.nass_conv_members enable row level security;

-- Uses fn_is_conv_member (security definer) — no recursion
drop policy if exists "members_select" on public.nass_conv_members;
create policy "members_select" on public.nass_conv_members
  for select to authenticated using (
    public.fn_is_conv_member(conversation_id)
  );

drop policy if exists "members_insert" on public.nass_conv_members;
create policy "members_insert" on public.nass_conv_members
  for insert to authenticated with check (
    -- Creator can add any member; a user can always insert themselves
    exists (
      select 1 from public.nass_conversations
      where id = conversation_id and created_by = auth.uid()
    )
    or user_id = auth.uid()
  );

drop policy if exists "members_update" on public.nass_conv_members;
create policy "members_update" on public.nass_conv_members
  for update to authenticated
  using (user_id = auth.uid());

-- ── RLS: Messages ────────────────────────────────────────────────
alter table public.nass_messages enable row level security;

drop policy if exists "messages_select" on public.nass_messages;
create policy "messages_select" on public.nass_messages
  for select to authenticated using (
    public.fn_is_conv_member(conversation_id)
  );

drop policy if exists "messages_insert" on public.nass_messages;
create policy "messages_insert" on public.nass_messages
  for insert to authenticated with check (
    auth.uid() = user_id and
    public.fn_is_conv_member(conversation_id)
  );

-- ── Realtime ─────────────────────────────────────────────────────
alter publication supabase_realtime add table public.nass_messages;
alter publication supabase_realtime add table public.nass_conversations;
