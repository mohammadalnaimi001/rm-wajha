import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import "@/styles/dashboard.css";
import { useAuth } from "./AuthContext";
import type { Role } from "@/types/db";

export default function LoginPage({ role }: { role: Role }) {
  const { session, profile, loading, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session && profile) {
    const home = profile.role === "admin" ? "/admin/dashboard" : "/employee/dashboard";
    if (profile.role === role) {
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
      return <Navigate to={from ?? home} replace />;
    }
    return <Navigate to={home} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
  }

  return (
    <div className="dash-auth">
      <div className="dash-auth-card">
        <div className="dash-auth-brand">
          <img src="/logo.svg" alt="Nexora Agency" />
        </div>
        <h1>{role === "admin" ? "Admin Login" : "Employee Login"}</h1>
        <p>Sign in with your Nexora account.</p>

        {error && <div className="dash-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="dash-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@nexora-agency.tech"
            />
          </div>
          <div className="dash-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
