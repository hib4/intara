"""Pydantic schemas for the public chat endpoint."""

from __future__ import annotations

import uuid

from pydantic import BaseModel, Field


# ── Request ──────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    """Payload sent by the public chat widget."""

    message: str = Field(..., min_length=1, max_length=4000)
    session_id: uuid.UUID | None = None
    customer_identifier: str | None = Field(
        default=None,
        max_length=255,
        description="Optional visitor identifier (e.g. anonymous cookie ID).",
    )


# ── Response ─────────────────────────────────────────────────────────────
class ChatResponse(BaseModel):
    """Returned after the LLM generates an answer."""

    answer: str
    session_id: uuid.UUID
