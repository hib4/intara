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

    # ── CORS ─────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
