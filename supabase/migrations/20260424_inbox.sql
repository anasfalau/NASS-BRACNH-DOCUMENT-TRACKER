-- ================================================================
--  Inbox System
--  nass_officer_mappings: maps officer names → user accounts
--  nass_inbox_seen: tracks when each user last viewed their inbox
-- ================================================================

-- Officer name → user mapping (admin managed)
CREATE TABLE IF NOT EXISTS nass_officer_mappings (
  officer_name  text        PRIMARY KEY,
  user_id       uuid        NOT NULL,
  user_email    text        NOT NULL,
  mapped_by     uuid,
  mapped_at     timestamptz DEFAULT now()
);

ALTER TABLE nass_officer_mappings ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read mappings (needed to show own inbox)
CREATE POLICY "inbox_map_read" ON nass_officer_mappings
  FOR SELECT TO authenticated USING (true);

-- Only superusers/admins can write
CREATE POLICY "inbox_map_write" ON nass_officer_mappings
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nass_profiles
      WHERE user_id = auth.uid() AND role IN ('admin','superuser')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM nass_profiles
      WHERE user_id = auth.uid() AND role IN ('admin','superuser')
    )
  );

-- Per-user inbox last-seen timestamp (unread = records updated after this)
CREATE TABLE IF NOT EXISTS nass_inbox_seen (
  user_id       uuid        PRIMARY KEY,
  last_seen_at  timestamptz NOT NULL DEFAULT '1970-01-01'
);

ALTER TABLE nass_inbox_seen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inbox_seen_own" ON nass_inbox_seen
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
