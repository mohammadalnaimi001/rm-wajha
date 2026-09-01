import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/db";

type AuthCtx = {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

// Filtering by auth_user_id is required even though RLS also scopes this
// query: the "profiles_select" policy grants admins visibility of every
// row (`auth_user_id = auth.uid() OR is_admin()`), so an unfiltered
// `.select("*").single()` call made by an admin matches every profile in
// the table, not just their own, making the row PostgREST returns
// unpredictable. Filtering here guarantees exactly one (the caller's own).
async function loadProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // Both the initial getSession() bootstrap and onAuthStateChange can fire
    // (and resolve their async profile fetch) in either order. Without this
    // guard, a slower fetch for a stale/previous session can resolve after
    // a newer one and overwrite it in state — e.g. an admin sign-in
    // finishing before a lingering earlier session's profile fetch would
    // leave the wrong role's profile applied.
    let requestId = 0;

    async function applySession(newSession: Session | null) {
      const myRequestId = ++requestId;
      setSession(newSession);

      if (!newSession) {
        setProfile(null);
        return;
      }

      const p = await loadProfile(newSession.user.id);
      if (!active || myRequestId !== requestId) return;

      if (p && !p.active) {
        await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
        return;
      }
      setProfile(p);
    }

    async function bootstrap() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      await applySession(data.session);
      if (active) setLoading(false);
    }
    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      applySession(newSession);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn: AuthCtx["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return <Ctx.Provider value={{ session, profile, loading, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
