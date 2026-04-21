// ================================================================
//  NASS Branch Tracker — User Management Edge Function
//  All writes to nass_profiles and auth.users require superuser role.
// ================================================================
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL              = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function err(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status, headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function ok(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200, headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// ── Generate a cryptographically random temporary password ───────
// 12 chars: guaranteed at least 1 uppercase, 1 lowercase, 1 digit, 1 symbol.
function generateTempPassword(): string {
  const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower   = 'abcdefghjkmnpqrstuvwxyz';
  const digits  = '23456789';
  const special = '!@#$%&*';
  const all     = upper + lower + digits + special;
  const bytes   = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const pw: string[] = [
    upper  [bytes[0] % upper.length],
    lower  [bytes[1] % lower.length],
    digits [bytes[2] % digits.length],
    special[bytes[3] % special.length],
    ...Array.from(bytes.slice(4), b => all[b % all.length])
  ];
  // Fisher-Yates shuffle for extra randomness
  const sh = new Uint8Array(pw.length);
  crypto.getRandomValues(sh);
  for (let i = pw.length - 1; i > 0; i--) {
    const j = sh[i] % (i + 1);
    [pw[i], pw[j]] = [pw[j], pw[i]];
  }
  return pw.join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  // ── Verify caller is authenticated ───────────────────────────
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return err('Unauthorised', 401);

  // Admin client (service role — bypasses RLS)
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // User client (scoped to the caller's JWT)
  const userClient = createClient(SUPABASE_URL, Deno.env.get('SUPABASE_ANON_KEY')!, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });

  // Resolve calling user
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) return err('Unauthorised', 401);

  // Check the caller is a superuser
  const { data: callerProfile } = await admin
    .from('nass_profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (callerProfile?.role !== 'superuser') return err('Forbidden — superuser only', 403);

  // ── Route ────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await admin
      .from('nass_profiles')
      .select('user_id, email, display_name, role, created_at')
      .order('created_at', { ascending: true });
    if (error) return err(error.message);
    return ok(data);
  }

  if (req.method === 'POST') {
    const body   = await req.json().catch(() => ({}));
    const action: string = body.action || '';

    // ── Create user with auto-confirmed email + temp password ────
    if (action === 'invite') {
      const { email, role } = body;
      if (!email || !role) return err('email and role are required');
      if (!['superuser','editor','viewer'].includes(role)) return err('Invalid role');

      const tempPassword = generateTempPassword();

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password:      tempPassword,
        email_confirm: true,                          // auto-confirm, no email needed
        user_metadata: { must_change_password: true } // flag checked on first login
      });
      if (createErr) return err(createErr.message);

      const { error: profErr } = await admin.from('nass_profiles').upsert({
        user_id:    created.user.id,
        email:      created.user.email!,
        role,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
      if (profErr) return err(profErr.message);

      return ok({
        message:       `Account created for ${email}`,
        user_id:       created.user.id,
        temp_password: tempPassword          // returned to admin only — shown in UI
      });
    }

    // ── Update role ──────────────────────────────────────────
    if (action === 'update-role') {
      const { user_id, role } = body;
      if (!user_id || !role) return err('user_id and role are required');
      if (!['superuser','editor','viewer'].includes(role)) return err('Invalid role');

      const { error: upErr } = await admin
        .from('nass_profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('user_id', user_id);
      if (upErr) return err(upErr.message);

      return ok({ message: 'Role updated' });
    }

    // ── Delete user ──────────────────────────────────────────
    if (action === 'delete') {
      const { user_id } = body;
      if (!user_id) return err('user_id is required');
      if (user_id === user.id) return err('Cannot remove your own account');

      const { error: delErr } = await admin.auth.admin.deleteUser(user_id);
      if (delErr) return err(delErr.message);

      return ok({ message: 'User removed' });
    }

    return err('Unknown action');
  }

  return err('Method not allowed', 405);
});
