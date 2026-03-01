/**
 * ProtectedRoute – Wrapper component that guards authenticated routes.
 *
 * - While AuthContext is rehydrating (isLoading), shows a centered spinner
 *   to avoid a premature redirect flash.
 * - If the user is NOT authenticated, redirects to /login.
 * - If the user IS authenticated, renders the child route via <Outlet />.
 */

import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // ── Still checking localStorage / token validity ──
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Not logged in → kick to login ──
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ── Authenticated → render child routes ──
  return <Outlet />;
}
