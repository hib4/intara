"""Pydantic schemas for the Document entity."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    """Returned to the client after upload or listing."""

    id: uuid.UUID
    user_id: uuid.UUID
    chatbot_id: uuid.UUID | None
    file_name: str
    file_type: str
    file_url: str
    status: str

    model_config = ConfigDict(from_attributes=True)


class DocumentUploadResponse(BaseModel):
    """Immediate response after a file is accepted for processing."""

    message: str
    document: DocumentResponse
