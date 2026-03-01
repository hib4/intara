"""
Pure database operations for the Document entity.

No HTTPExceptions here – keep business logic in the router layer.
"""

from __future__ import annotations

import uuid as _uuid

from sqlalchemy.orm import Session

from app.db.models import Document


def create_document_record(
    db: Session,
    user_id: _uuid.UUID,
    chatbot_id: _uuid.UUID,
    file_name: str,
    file_type: str,
    file_url: str = "",
) -> Document:
    """Insert a new Document row with status PROCESSING."""
    doc = Document(
        user_id=user_id,
        chatbot_id=chatbot_id,
        file_name=file_name,
        file_type=file_type,
        file_url=file_url,
        status="PROCESSING",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def get_documents_by_chatbot(
    db: Session,
    chatbot_id: _uuid.UUID,
    user_id: _uuid.UUID,
) -> list[Document]:
    """Return all documents for a chatbot owned by *user_id*."""
    return (
        db.query(Document)
        .filter(
            Document.chatbot_id == chatbot_id,
            Document.user_id == user_id,
        )
        .order_by(Document.file_name)
        .all()
    )


def get_document_by_id_and_user(
    db: Session,
    document_id: _uuid.UUID,
    user_id: _uuid.UUID,
) -> Document | None:
    """Fetch a single document with ownership check."""
    return (
        db.query(Document)
        .filter(Document.id == document_id, Document.user_id == user_id)
        .first()
    )
