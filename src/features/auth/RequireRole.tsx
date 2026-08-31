import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "@/types/db";

export default function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!session || !profile) {
    const loginPath = role === "admin" ? "/admin/login" : "/employee/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (profile.role !== role) {
    const ownArea = profile.role === "admin" ? "/admin/dashboard" : "/employee/dashboard";
    return <Navigate to={ownArea} replace />;
  }

  return <>{children}</>;
}
