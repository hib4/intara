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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/analytics" element={<AnalyticsChatPage />} />
        <Route path="/dashboard/chatbot" element={<ChatbotManagementPage />} />
        <Route path="/dashboard/chatbot/new" element={<BotBuilderPage />} />
        <Route path="/dashboard/data" element={<DataManagementPage />} />
        <Route path="/dashboard/data/upload" element={<DataUploadPage />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
