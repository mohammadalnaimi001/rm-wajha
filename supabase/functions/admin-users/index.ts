// Supabase Edge Function: admin-users
//
// The ONLY place the service_role key is ever used. Deployed to Supabase
// (not the frontend bundle) via:
//   supabase functions deploy admin-users
//
// Called from the app as:
//   supabase.functions.invoke("admin-users", { body: { action: "create", ... } })
// The caller's access token is forwarded automatically and verified below
// against the profiles table to ensure only an active admin can use it.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Missing Authorization header" }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Identify the caller from their JWT and confirm they are an active admin.
  const { data: userRes, error: userErr } = await admin.auth.getUser(
    authHeader.replace("Bearer ", "")
  );
  if (userErr || !userRes?.user) return json({ error: "Invalid session" }, 401);

  const { data: callerProfile, error: profileErr } = await admin
    .from("profiles")
    .select("role, active")
    .eq("auth_user_id", userRes.user.id)
    .single();

  if (profileErr || !callerProfile || callerProfile.role !== "admin" || !callerProfile.active) {
    return json({ error: "Forbidden: admin only" }, 403);
  }

  let payload: { action?: string; email?: string; password?: string; full_name?: string; phone?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  if (payload.action === "create") {
    const { email, password, full_name, phone } = payload;
    if (!email || !password || !full_name) {
      return json({ error: "email, password and full_name are required" }, 400);
    }

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (createErr || !created?.user) {
      return json({ error: createErr?.message ?? "Failed to create auth user" }, 400);
    }

    const { data: profile, error: insertErr } = await admin
      .from("profiles")
      .insert({
        auth_user_id: created.user.id,
        full_name,
        email,
        phone: phone ?? null,
        role: "employee",
        active: true
      })
      .select()
      .single();

    if (insertErr) {
      // Roll back the auth user so we don't leave an orphaned account.
      await admin.auth.admin.deleteUser(created.user.id);
      return json({ error: insertErr.message }, 400);
    }

    return json({ profile });
  }

  return json({ error: "Unknown action" }, 400);
});
