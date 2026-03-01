# 🌐 Intara Web Client

### _Empowering Indonesian MSMEs with Intelligent, No-Code AI_

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](../LICENSE)

---

## 📖 Overview

The **Intara Web Client** is the primary user-facing interface of the Intara SaaS platform — a modern, responsive single-page application built with React 19 and Vite. It provides Indonesian business owners with an intuitive dashboard to build, configure, and deploy AI-powered customer service chatbots without writing a single line of code, as well as a suite of tools for querying financial data through natural language.

The UI is architected around a clean component model using **shadcn/ui** over Radix UI primitives, ensuring accessibility compliance and visual consistency across the entire product. All server state is managed with **TanStack Query** for optimistic updates and intelligent caching, while **Zustand** handles lightweight client-side state.

---

## ✨ Key Features

| Feature                            | Description                                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 🤖 **No-Code RAG Chatbot Builder** | Create and configure AI chatbots trained on your own PDF or TXT product catalogs via a guided wizard interface |
| 📂 **RAG Document Hub**            | Upload, manage, and monitor the processing status of knowledge-base documents with drag-and-drop support       |
| 💬 **Live Chat Preview**           | Real-time embedded chat widget preview to test chatbot responses before going live                             |
| 📊 **Financial Insight Dashboard** | Interactive analytics dashboard with charts (Recharts) for querying CSV financial data using natural language  |
| 🔐 **Secure Authentication**       | JWT-based login and registration with protected routes and persistent sessions                                 |
| 💳 **PayLabs Payment Integration** | Subscription and billing management UI integrated with the PayLabs payment gateway                             |
| ⚙️ **Settings & Onboarding**       | Step-by-step onboarding flow and a comprehensive settings page for managing account and chatbot preferences    |

---

## 🛠️ Tech Stack

| Category               | Technology                 |
| ---------------------- | -------------------------- |
| **Framework**          | React 19 + Vite 7          |
| **Language**           | TypeScript 5.9             |
| **Styling**            | Tailwind CSS 4             |
| **Component Library**  | shadcn/ui (Radix UI + CVA) |
| **HTTP Client**        | Axios 1.x                  |
| **Server State**       | TanStack React Query 5     |
| **Client State**       | Zustand 5                  |
| **Routing**            | React Router DOM 7         |
| **Forms & Validation** | React Hook Form 7 + Zod 4  |
| **Charts**             | Recharts 3                 |
| **File Upload**        | React Dropzone 15          |
| **Icons**              | Lucide React               |
| **Deployment**         | Alibaba Cloud OSS + CDN    |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Bun** `>= 1.x` — [Install](https://bun.sh/)

Verify your installation:

```bash
bun --version
```

---

## 🔑 Environment Variables

The application is configured via a `.env` file in the root of the `frontend/` directory. Copy the example file and populate the values:

```bash
cp .env.example .env
```

| Variable                  | Required | Description                                          | Example                 |
| ------------------------- | -------- | ---------------------------------------------------- | ----------------------- |
| `VITE_API_BASE_URL`       | ✅ Yes   | The base URL of the Intara Core API backend          | `http://localhost:8000` |
| `VITE_APP_NAME`           | No       | Display name of the application                      | `Intara`                |
| `VITE_PAYLABS_PUBLIC_KEY` | No       | PayLabs public key for client-side payment flows     | `pk_live_xxxxxxxxxxxx`  |
| `VITE_OSS_CDN_URL`        | No       | Alibaba Cloud CDN base URL for serving static assets | `https://cdn.intara.id` |

> **Important:** All Vite client-side environment variables **must** be prefixed with `VITE_`. Variables without this prefix are not exposed to the browser bundle.

**`.env.example`**

```env
# ── API ──────────────────────────────────────────────────────
VITE_API_BASE_URL=http://localhost:8000

# ── Application ──────────────────────────────────────────────
VITE_APP_NAME=Intara

# ── Payments (PayLabs) ───────────────────────────────────────
VITE_PAYLABS_PUBLIC_KEY=

# ── CDN (Production Only) ────────────────────────────────────
VITE_OSS_CDN_URL=
```

---

## 🚀 Local Development Setup

Follow these steps to get the development server running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/intara.git
cd intara/frontend
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your running backend URL
# e.g., VITE_API_BASE_URL=http://localhost:8000
```

### 4. Start the Development Server

```bash
bun dev
```

The application will be available at **[http://localhost:5173](http://localhost:5173)**.

### Available Scripts

| Command           | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| `bun dev`         | Starts the Vite HMR development server                            |
| `bun run build`   | Type-checks and produces an optimized production build in `dist/` |
| `bun run preview` | Serves the production build locally for final validation          |
| `bun lint`        | Runs ESLint across the entire codebase                            |

---

## 🏗️ Project Structure

```
frontend/
├── public/                  # Static assets (favicon, site.webmanifest)
├── src/
│   ├── assets/              # Images, SVGs, and other bundled assets
│   ├── components/
│   │   ├── auth/            # AuthLayout, ProtectedRoute wrappers
│   │   ├── dashboard/       # DashboardLayout shell
│   │   └── ui/              # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── context/
│   │   └── AuthContext.tsx  # Global authentication state
│   ├── lib/
│   │   ├── axios.ts         # Pre-configured Axios instance with interceptors
│   │   └── utils.ts         # Shared utility functions (cn, formatters)
│   ├── pages/
│   │   ├── auth/            # LoginPage, RegisterPage
│   │   ├── chat/            # PublicChatPage (embeddable widget)
│   │   ├── dashboard/       # Core app pages (Builder, Management, Analytics)
│   │   └── onboarding/      # OnboardingPage wizard
│   ├── services/
│   │   └── auth.service.ts  # Authentication API service layer
│   ├── App.tsx              # Root component and route definitions
│   └── main.tsx             # Application entry point
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ☁️ Deployment

The Intara frontend is deployed as a fully static site to **Alibaba Cloud Object Storage Service (OSS)**, served globally via the **Alibaba Cloud CDN** for low-latency access across the Indonesian archipelago.

### CI/CD Pipeline

A CI/CD pipeline automates the following on every push to the `main` branch:

1. **Install** — `bun install --frozen-lockfile`
2. **Lint** — `bun lint`
3. **Build** — `bun run build` (outputs to `dist/`)
4. **Upload** — Static assets in `dist/` are synced to the designated OSS bucket using the Alibaba Cloud CLI (`aliyun ossutil`)
5. **Invalidate CDN** — The CDN cache is invalidated to ensure users receive the latest version immediately

### Manual Deployment

For a one-off manual deployment, ensure the Alibaba Cloud CLI (`aliyun`) is configured with the appropriate RAM credentials, then:

```bash
bun run build
aliyun ossutil sync ./dist/ oss://your-bucket-name/ --delete
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

---

## 📄 License

Copyright (c) 2026 **Intara (Intelligence Nusantara) / Hiba**. All Rights Reserved.

This software is proprietary and confidential. Unauthorised use, copying, modification, distribution, or sublicensing of this software, in whole or in part, is strictly prohibited without the express written permission of the copyright owner. See the [LICENSE](../LICENSE) file for the full terms.

---

<p align="center">
  Built with ❤️ for Indonesian MSMEs &nbsp;|&nbsp; <strong>Intara – Intelligence Nusantara</strong>
</p>
