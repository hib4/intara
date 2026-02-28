"""Pydantic schemas for the Chatbot entity."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ── Base / shared fields ─────────────────────────────────────────────────
class ChatbotBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role_prompt: str | None = None
    is_active: bool = True


# ── Create ───────────────────────────────────────────────────────────────
class ChatbotCreate(ChatbotBase):
    """Payload for POST /chatbots."""

    pass


# ── Update (all fields optional) ─────────────────────────────────────────
class ChatbotUpdate(BaseModel):
    """Payload for PUT /chatbots/{id}.  Only supplied fields are updated."""

    name: str | None = Field(default=None, min_length=1, max_length=255)
    role_prompt: str | None = None
    is_active: bool | None = None


# ── Response ─────────────────────────────────────────────────────────────
class ChatbotResponse(ChatbotBase):
    """Returned to the client – includes server-generated fields."""

    id: uuid.UUID
    user_id: uuid.UUID
    public_link_slug: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
