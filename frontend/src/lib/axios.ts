/**
 * Preconfigured Axios instance for the Intara API.
 *
 * - Base URL points at the FastAPI backend.
 * - A request interceptor appends the JWT from localStorage to every request.
 * - A response interceptor catches 401 errors, clears the stale token, and
 *   redirects the user to the login page.
 */

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach Bearer token ────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ───────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      // Only redirect if not already on an auth page
      const { pathname } = window.location;
      if (!pathname.startsWith("/login") && !pathname.startsWith("/register")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
