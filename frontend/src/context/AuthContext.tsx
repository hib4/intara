/**
 * AuthContext – React Context that manages authentication state.
 *
 * - Persists the JWT in localStorage under the key "access_token".
 * - Exposes `login`, `logout`, `isAuthenticated`, and `isLoading`.
 * - On mount, checks localStorage to rehydrate auth state.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  type LoginPayload,
  type LoginResponse,
} from "@/services/auth.service";

// ── Context shape ───────────────────────────────────────────────────────

interface AuthContextValue {
  /** The raw JWT, or `null` when not logged in. */
  token: string | null;
  /** Convenience boolean derived from `token`. */
  isAuthenticated: boolean;
  /** `true` while we're checking localStorage on first render. */
  isLoading: boolean;
  /** Calls the login endpoint, stores the token, and navigates to /dashboard. */
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  /** Clears the token and navigates to /login. */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Rehydrate token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("access_token");
    if (stored) setToken(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload): Promise<LoginResponse> => {
      const data = await loginUser(payload);
      localStorage.setItem("access_token", data.access_token);
      setToken(data.access_token);
      navigate("/dashboard", { replace: true });
      return data;
    },
    [navigate],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setToken(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
