import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

if (!isSupabaseConfigured) {
  console.error(
    "Missing Supabase env vars. Copy .env.example to .env.local and fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY."
  );
}

// Fall back to a syntactically-valid placeholder URL when unconfigured so
// createClient() never throws at import time — that import happens at the
// root of the app (via AuthContext), so a throw here would take down the
// public marketing site too, not just the private dashboard.
export const supabase = createClient(url || "https://placeholder.invalid", anonKey || "placeholder-anon-key", {
  auth: { persistSession: true, autoRefreshToken: true }
});
