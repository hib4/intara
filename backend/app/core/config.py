"""
Centralised application settings – loaded from environment / .env file.

Usage:
    from app.core.config import settings
    print(settings.DATABASE_URL)
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Database ─────────────────────────────────────────────
    DATABASE_URL: str = "postgresql://intara:intara_secret@localhost:5432/intara"

    # ── Application ──────────────────────────────────────────
    APP_NAME: str = "Intara API"
    DEBUG: bool = True

    # ── Security / JWT ───────────────────────────────────────
    SECRET_KEY: str = "change-me-to-a-long-random-string-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # ── Google AI (Gemini embeddings) ────────────────────────
    GOOGLE_API_KEY: str = ""

    # ── Alibaba Cloud / DashScope (Qwen alternative) ──────────
    ALIBABA_API_KEY: str = ""

    # ── RAG settings ─────────────────────────────────────────
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200

    # ── CORS ─────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",       
        "http://localhost:3000",       
        "https://intara.biz.id",       
        "https://www.intara.biz.id"
    ]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
