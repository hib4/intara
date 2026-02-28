"""Pydantic schemas for User registration and response."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── Request schemas ──────────────────────────────────────────────────────
class UserCreate(BaseModel):
    """Payload for POST /auth/register."""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    business_name: str = Field(..., min_length=1, max_length=255)
    business_category: str | None = Field(default=None, max_length=100)


# ── Response schemas ─────────────────────────────────────────────────────
class UserResponse(BaseModel):
    """Safe user representation – never exposes password_hash."""

    id: uuid.UUID
    email: str
    business_name: str
    business_category: str | None
    subscription_tier: str
    message_quota: int
    created_at: datetime

    model_config = {"from_attributes": True}
