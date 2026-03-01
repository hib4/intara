/**
 * Auth Service – talks directly to the Intara FastAPI auth endpoints.
 *
 * POST /auth/register  → JSON body   { email, password, business_name, business_category }
 * POST /auth/login     → form-urlencoded  { username (= email), password }
 */

import api from "@/lib/axios";

// ── Types mirroring backend Pydantic schemas ────────────────────────────

export interface RegisterPayload {
  email: string;
  password: string;
  business_name: string;
  business_category?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  business_name: string;
  business_category: string | null;
  subscription_tier: string;
  message_quota: number;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// ── API calls ───────────────────────────────────────────────────────────

/**
 * Register a new user – sends standard JSON.
 */
export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", payload);
  return data;
}

/**
 * Log in – MUST send as `application/x-www-form-urlencoded` because FastAPI's
 * `OAuth2PasswordRequestForm` expects it. The field is `username` (= email).
 */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const params = new URLSearchParams();
  params.append("username", payload.email);
  params.append("password", payload.password);

  const { data } = await api.post<LoginResponse>("/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}
