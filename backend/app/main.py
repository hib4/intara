"""
Intara – Intelligence Nusantara
FastAPI entry-point: CORS, health check, and auto-migration for dev.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.db.database import engine

# Import models so they are registered on Base.metadata
import app.db.models  # noqa: F401

# ── Routers ──────────────────────────────────────────────────────────────
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.chatbots import router as chatbots_router


# ---------------------------------------------------------------------------
# Lifespan – runs once on startup / shutdown
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Enable pgvector extension (must exist before migrations / queries)
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    # Tables are now managed by Alembic migrations (see alembic/)
    yield


# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Intara API",
    description="No-Code RAG Chatbot Builder & AI Financial Insight for MSMEs",
    version="0.1.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS – allow the Vite/React frontend during development
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
app.include_router(auth_router, prefix="/api")
app.include_router(chatbots_router, prefix="/api")


@app.get("/health", tags=["Health"])
def health_check():
    """Simple liveness probe."""
    return {"status": "healthy", "service": "intara-api"}
