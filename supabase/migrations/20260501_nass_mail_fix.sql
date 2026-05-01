-- ── Fix: drop all existing policies on nass_mail tables then recreate
-- Resolves "infinite recursion detected in policy for relation 'nass_mail'"
-- caused by nass_mail_recipients SELECT policy querying nass_mail WITH RLS,
-- which can re-enter itself under certain planner paths.
-- Solution: use a SECURITY DEFINER helper that bypasses RLS for the
-- cross-table existence check.

-- 1. Drop existing policies (safe if run again — IF EXISTS guards)
DO $$ BEGIN
  DROP POLICY IF EXISTS "nass_mail_select"          ON public.nass_mail;
  DROP POLICY IF EXISTS "nass_mail_insert"          ON public.nass_mail;
  DROP POLICY IF EXISTS "nass_mail_update"          ON public.nass_mail;
  DROP POLICY IF EXISTS "nass_mail_delete"          ON public.nass_mail;
  DROP POLICY IF EXISTS "nass_mail_recip_select"    ON public.nass_mail_recipients;
  DROP POLICY IF EXISTS "nass_mail_recip_insert"    ON public.nass_mail_recipients;
  DROP POLICY IF EXISTS "nass_mail_recip_update"    ON public.nass_mail_recipients;
  DROP POLICY IF EXISTS "nass_mail_recip_delete"    ON public.nass_mail_recipients;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- 2. SECURITY DEFINER helper: checks sender without triggering RLS loop
CREATE OR REPLACE FUNCTION public.nass_mail_is_sender(p_mail_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.nass_mail
    WHERE id = p_mail_id AND sender_id = auth.uid()
  );
$$;

-- 3. nass_mail policies — simple, no subqueries
ALTER TABLE public.nass_mail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nass_mail_select" ON public.nass_mail FOR SELECT
  USING (sender_id = auth.uid());

CREATE POLICY "nass_mail_insert" ON public.nass_mail FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "nass_mail_update" ON public.nass_mail FOR UPDATE
  USING (sender_id = auth.uid());

CREATE POLICY "nass_mail_delete" ON public.nass_mail FOR DELETE
  USING (sender_id = auth.uid());

-- 4. nass_mail_recipients policies — use SECURITY DEFINER fn for cross-table check
ALTER TABLE public.nass_mail_recipients ENABLE ROW LEVEL SECURITY;

-- Recipient sees their own rows; sender sees all recipient rows for their mail
CREATE POLICY "nass_mail_recip_select" ON public.nass_mail_recipients FOR SELECT
  USING (
    recipient_id = auth.uid()
    OR public.nass_mail_is_sender(mail_id)
  );

-- Only the sender of the parent mail can insert recipient rows
CREATE POLICY "nass_mail_recip_insert" ON public.nass_mail_recipients FOR INSERT
  WITH CHECK (public.nass_mail_is_sender(mail_id));

-- Recipients update their own rows (mark read, soft-delete to trash)
CREATE POLICY "nass_mail_recip_update" ON public.nass_mail_recipients FOR UPDATE
  USING (recipient_id = auth.uid());

-- Recipients can hard-delete their own rows (permanent delete from trash)
CREATE POLICY "nass_mail_recip_delete" ON public.nass_mail_recipients FOR DELETE
  USING (recipient_id = auth.uid());
