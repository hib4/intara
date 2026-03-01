# 🇮🇩 Intara — Intelligence Nusantara

### _No-Code AI Automation for Indonesian MSMEs (UMKM)_

[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?style=flat-square&logo=react)](./frontend/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_+_Python_3.11-009688?style=flat-square&logo=fastapi)](./backend/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_+_pgvector-4169E1?style=flat-square&logo=postgresql)](./backend/)
[![Alibaba Cloud](https://img.shields.io/badge/Cloud-Alibaba_Cloud-FF6A00?style=flat-square&logo=alibabacloud)](https://www.alibabacloud.com/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](./LICENSE)

---

## 🌟 What is Intara?

**Intara** (Intelligence Nusantara) is a **B2B SaaS platform** purpose-built to bring enterprise-grade AI capabilities to Indonesian micro, small, and medium enterprises (UMKM). It removes the technical barrier to AI adoption — no machine learning expertise required.

The platform delivers two core products through a single, intuitive dashboard:

| Product                               | Description                                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🤖 **No-Code RAG Chatbot Builder**    | Upload PDF/TXT product catalogs or knowledge documents and instantly deploy an AI-powered customer service chatbot — no coding, no model training |
| 📊 **AI Financial Insight Assistant** | Upload CSV financial data and query it in natural language to receive instant summaries, trend analysis, and actionable business insights         |

---

## 🏗️ Monorepo Structure

This repository is a monorepo containing both the frontend client and the backend API:

```
intara/
├── frontend/          # React 19 + Vite + TypeScript web client
│   └── README.md      # Frontend setup & documentation
├── backend/           # FastAPI + PostgreSQL + pgvector API server
│   └── README.md      # Backend setup & documentation
└── README.md          # ← You are here
```

---

## 🛠️ High-Level Tech Stack

### Frontend — [`/frontend`](./frontend/)

| Category        | Technology                                 |
| --------------- | ------------------------------------------ |
| Framework       | React 19 + Vite 7                          |
| Language        | TypeScript 5.9                             |
| Styling         | Tailwind CSS 4 + shadcn/ui                 |
| State & Data    | TanStack Query 5 + Zustand 5               |
| Routing & Forms | React Router DOM 7 + React Hook Form + Zod |
| Charts          | Recharts 3                                 |
| Deployment      | Alibaba Cloud OSS + CDN                    |

### Backend — [`/backend`](./backend/)

| Category         | Technology                           |
| ---------------- | ------------------------------------ |
| Framework        | FastAPI 0.133 (Python 3.11)          |
| Database         | PostgreSQL 16 + pgvector             |
| ORM & Migrations | SQLAlchemy 2.0 + Alembic             |
| AI / RAG Engine  | Qwen / QwQ via LangChain + DashScope |
| Auth             | JWT (PyJWT) + bcrypt (passlib)       |
| Infrastructure   | Docker + Docker Compose              |
| Deployment       | Alibaba Cloud ECS + ApsaraDB RDS     |

---

## 🚀 Quick Start

### Prerequisites

- **Docker** `>= 24.x` + **Docker Compose** `>= 2.x`
- **Node.js** `>= 20.x` + **npm** `>= 10.x`

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/intara.git
cd intara
```

### 2. Start the Backend

```bash
cd backend
cp .env.example .env          # Populate ALIBABA_API_KEY and SECRET_KEY
docker compose up --build -d
docker compose exec api alembic upgrade head
```

The API will be live at **[http://localhost:8000](http://localhost:8000)**, with interactive docs at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

### 3. Start the Frontend

```bash
cd ../frontend
cp .env.example .env          # Set VITE_API_BASE_URL=http://localhost:8000
bun install
bun dev
```

The web client will be live at **[http://localhost:5173](http://localhost:5173)**.

---

## ☁️ Production Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         End Users (Browser)                  │
└────────────────────────────┬─────────────────────────────────┘
                             │ HTTPS
           ┌─────────────────┴────────────────────┐
           │                                      │
┌──────────▼──────────┐             ┌─────────────▼───────────┐
│  Alibaba Cloud OSS  │             │  Alibaba Cloud ECS       │
│  + CDN (Frontend)   │             │  FastAPI + Docker (API)  │
│  Static React SPA   │             │  :8000                   │
└─────────────────────┘             └──────────┬───────────────┘
                                               │
                         ┌─────────────────────┴──────────────────┐
                         │                                        │
              ┌──────────▼──────────┐          ┌─────────────────▼──────────┐
              │  Alibaba ApsaraDB   │          │  Alibaba Cloud Model Studio │
              │  PostgreSQL + RDS   │          │  Qwen / QwQ (DashScope)     │
              │  pgvector extension │          │  LLM + Embeddings           │
              └─────────────────────┘          └────────────────────────────┘
```

---

## 📚 Documentation

For detailed setup instructions, environment variable references, and deployment guides, refer to the sub-project READMEs:

- 🌐 **Frontend** → [frontend/README.md](./frontend/README.md)
- ⚙️ **Backend** → [backend/README.md](./backend/README.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit following [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m 'feat: add your feature'`
4. Push and open a Pull Request against `main`

---

## 📄 License

Copyright (c) 2026 **Intara (Intelligence Nusantara) / Hiba**. All Rights Reserved.

This software is proprietary and confidential. Unauthorised use, copying, modification, distribution, or sublicensing of this software, in whole or in part, is strictly prohibited without the express written permission of the copyright owner. See the [LICENSE](./LICENSE) file for the full terms.

---

<p align="center">
  Built with ❤️ for Indonesian MSMEs &nbsp;|&nbsp; <strong>Intara – Intelligence Nusantara</strong>
</p>
