"""
CRUD helpers for chat sessions and messages.
"""

from __future__ import annotations

import uuid as _uuid
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models import ChatMessage, ChatSession


# ── Session management ───────────────────────────────────────────────────

def get_or_create_session(
    db: Session,
    chatbot_id: UUID,
    customer_identifier: str | None = None,
    session_id: UUID | None = None,
) -> ChatSession:
    """Return an existing session or create a new one.

    Lookup priority:
    1. *session_id* – exact session (must belong to *chatbot_id*).
    2. *customer_identifier* – most recent session for this visitor.
    3. Neither – create a brand-new session.
    """
    if session_id is not None:
        session = (
            db.query(ChatSession)
            .filter(
                ChatSession.id == session_id,
                ChatSession.chatbot_id == chatbot_id,
            )
            .first()
        )
        if session is not None:
            return session
        # If the supplied session_id doesn't match, fall through and
        # create a new session rather than raising an error.

    if customer_identifier:
        session = (
            db.query(ChatSession)
            .filter(
                ChatSession.chatbot_id == chatbot_id,
                ChatSession.customer_identifier == customer_identifier,
            )
            .order_by(ChatSession.started_at.desc())
            .first()
        )
        if session is not None:
            return session

    # Create a new session
    new_session = ChatSession(
        id=_uuid.uuid4(),
        chatbot_id=chatbot_id,
        customer_identifier=customer_identifier,
    )
    db.add(new_session)
    db.flush()  # populate PK so caller can use new_session.id immediately
    return new_session


# ── Message persistence ──────────────────────────────────────────────────

def save_message(
    db: Session,
    session_id: UUID,
    sender_type: str,
    content: str,
) -> ChatMessage:
    """Persist a single chat message (USER or AI).

    Parameters
    ----------
    sender_type:
        ``"USER"`` or ``"AI"``.
    """
    message = ChatMessage(
        session_id=session_id,
        sender_type=sender_type,
        content=content,
    )
    db.add(message)
    db.flush()
    return message
