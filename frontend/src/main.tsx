import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import OnboardingPage from "./pages/onboarding/OnboardingPage.tsx";
import DashboardPage from "./pages/dashboard/DashboardPage.tsx";
import AnalyticsChatPage from "./pages/dashboard/AnalyticsChatPage.tsx";
import ChatbotManagementPage from "./pages/dashboard/ChatbotManagementPage.tsx";
import BotBuilderPage from "./pages/dashboard/BotBuilderPage.tsx";
import DataManagementPage from "./pages/dashboard/DataManagementPage.tsx";
import DataUploadPage from "./pages/dashboard/DataUploadPage.tsx";
import SettingsPage from "./pages/dashboard/SettingsPage.tsx";
import PublicChatPage from "./pages/chat/PublicChatPage.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public routes ──────────────── */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/chat/:botId" element={<PublicChatPage />} />

          {/* ── Protected dashboard routes ─── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="analytics" element={<AnalyticsChatPage />} />
              <Route path="chatbot" element={<ChatbotManagementPage />} />
              <Route path="chatbot/new" element={<BotBuilderPage />} />
              <Route path="data" element={<DataManagementPage />} />
              <Route path="data/upload" element={<DataUploadPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
