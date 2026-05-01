-- ── Internal Mail ──────────────────────────────────────────────────────────
-- Provides the nass_mail and nass_mail_recipients tables used by the unified
-- Inbox view for sending/receiving internal messages between NASS users.

-- 1. Mail messages
CREATE TABLE IF NOT EXISTS public.nass_mail (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject     TEXT        NOT NULL DEFAULT '',
  body        TEXT        NOT NULL DEFAULT '',
  is_draft    BOOLEAN     NOT NULL DEFAULT false,
  parent_id   UUID        REFERENCES public.nass_mail(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.nass_mail ENABLE ROW LEVEL SECURITY;

-- Sender sees their own messages (inbox query also joins via recipients)
CREATE POLICY "nass_mail_select" ON public.nass_mail FOR SELECT
  USING (sender_id = auth.uid());

CREATE POLICY "nass_mail_insert" ON public.nass_mail FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "nass_mail_update" ON public.nass_mail FOR UPDATE
  USING (sender_id = auth.uid());

CREATE POLICY "nass_mail_delete" ON public.nass_mail FOR DELETE
  USING (sender_id = auth.uid());

-- 2. Recipients (tracks TO/CC, read state, soft-delete/trash)
CREATE TABLE IF NOT EXISTS public.nass_mail_recipients (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  mail_id       UUID        NOT NULL REFERENCES public.nass_mail(id) ON DELETE CASCADE,
  recipient_id  UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type          TEXT        NOT NULL CHECK (type IN ('to','cc')),
  read_at       TIMESTAMPTZ,
  deleted_at    TIMESTAMPTZ,
  UNIQUE (mail_id, recipient_id)
);

ALTER TABLE public.nass_mail_recipients ENABLE ROW LEVEL SECURITY;

-- Recipients see their own rows; senders see recipients of their own mail
CREATE POLICY "nass_mail_recip_select" ON public.nass_mail_recipients FOR SELECT
  USING (
    recipient_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.nass_mail m
      WHERE m.id = mail_id AND m.sender_id = auth.uid()
    )
  );

-- Only the sender of the parent mail can add recipient rows
CREATE POLICY "nass_mail_recip_insert" ON public.nass_mail_recipients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.nass_mail m
      WHERE m.id = mail_id AND m.sender_id = auth.uid()
    )
  );

-- Recipients update their own rows (mark read, soft-delete to trash)
CREATE POLICY "nass_mail_recip_update" ON public.nass_mail_recipients FOR UPDATE
  USING (recipient_id = auth.uid());

-- Recipients can hard-delete their own rows (permanent delete from trash)
CREATE POLICY "nass_mail_recip_delete" ON public.nass_mail_recipients FOR DELETE
  USING (recipient_id = auth.uid());

-- Keep updated_at current
CREATE OR REPLACE FUNCTION public.set_nass_mail_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_nass_mail_updated_at ON public.nass_mail;
CREATE TRIGGER trg_nass_mail_updated_at
  BEFORE UPDATE ON public.nass_mail
  FOR EACH ROW EXECUTE FUNCTION public.set_nass_mail_updated_at();
