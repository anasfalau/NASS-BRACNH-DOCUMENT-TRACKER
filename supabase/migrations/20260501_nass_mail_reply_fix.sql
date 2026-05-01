-- ── Fix: reply send error — RLS blocks FK validation on parent_id ──────────
--
-- When a recipient replies, the INSERT into nass_mail sets parent_id = <original
-- mail id>.  Postgres validates that FK by doing SELECT FROM nass_mail WHERE
-- id = parent_id.  The existing SELECT policy only allows the sender to read
-- their own mail, so the recipient can't see the parent row → FK check fails
-- → "new row violates row-level security policy for table nass_mail".
--
-- Two changes:
--   1. Drop the FK constraint on parent_id so the FK check doesn't run.
--      parent_id is kept as a plain UUID (soft reference for threading).
--   2. Add a SECURITY DEFINER helper + SELECT policy so recipients can read
--      mail sent to them — needed for correct detail rendering and future
--      thread loading.

-- 1. Drop the FK constraint (keep the column, just no enforcement)
ALTER TABLE public.nass_mail
  DROP CONSTRAINT IF EXISTS nass_mail_parent_id_fkey;

-- 2. SECURITY DEFINER helper — checks recipient without triggering RLS loop
CREATE OR REPLACE FUNCTION public.nass_mail_is_recipient(p_mail_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.nass_mail_recipients
    WHERE mail_id = p_mail_id AND recipient_id = auth.uid()
  );
$$;

-- 3. Add SELECT policy for recipients (drop first so re-runs are idempotent)
DROP POLICY IF EXISTS "nass_mail_select_recipient" ON public.nass_mail;

CREATE POLICY "nass_mail_select_recipient" ON public.nass_mail FOR SELECT
  USING (public.nass_mail_is_recipient(id));
