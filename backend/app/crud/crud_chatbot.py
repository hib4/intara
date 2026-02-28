"""
Pure database operations for the Chatbot entity.

No HTTPExceptions here – keep business logic in the router layer.
"""

from __future__ import annotations

import re
import uuid as _uuid

from sqlalchemy.orm import Session

from app.db.models import Chatbot
from app.schemas.chatbot import ChatbotCreate, ChatbotUpdate


# ── Helpers ──────────────────────────────────────────────────────────────

def _slugify(text: str) -> str:
    """Turn *text* into a URL-friendly slug (lowercase, hyphens, no specials)."""
    slug = text.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)   # remove non-word chars
    slug = re.sub(r"[\s_]+", "-", slug)     # spaces / underscores → hyphens
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def _unique_slug(db: Session, base_slug: str) -> str:
    """Ensure *base_slug* is unique in the chatbots table.

    If a collision is found, append a short random hex suffix.
    """
    slug = base_slug
    while db.query(Chatbot).filter(Chatbot.public_link_slug == slug).first():
        suffix = _uuid.uuid4().hex[:6]
        slug = f"{base_slug}-{suffix}"
    return slug


# ── CRUD functions ───────────────────────────────────────────────────────

def create_chatbot(
    db: Session,
    chatbot: ChatbotCreate,
    user_id: _uuid.UUID,
) -> Chatbot:
    """Insert a new chatbot with a unique public_link_slug."""
    slug = _unique_slug(db, _slugify(chatbot.name))

    db_chatbot = Chatbot(
        user_id=user_id,
        name=chatbot.name,
        role_prompt=chatbot.role_prompt,
        is_active=chatbot.is_active,
        public_link_slug=slug,
    )
    db.add(db_chatbot)
    db.commit()
    db.refresh(db_chatbot)
    return db_chatbot


def get_chatbots_by_user(
    db: Session,
    user_id: _uuid.UUID,
) -> list[Chatbot]:
    """Return every chatbot owned by *user_id*."""
    return (
        db.query(Chatbot)
        .filter(Chatbot.user_id == user_id)
        .order_by(Chatbot.created_at.desc())
        .all()
    )


def get_chatbot_by_id_and_user(
    db: Session,
    chatbot_id: _uuid.UUID,
    user_id: _uuid.UUID,
) -> Chatbot | None:
    """Fetch a single chatbot – returns *None* if not found or not owned."""
    return (
        db.query(Chatbot)
        .filter(Chatbot.id == chatbot_id, Chatbot.user_id == user_id)
        .first()
    )


def update_chatbot(
    db: Session,
    db_chatbot: Chatbot,
    chatbot_update: ChatbotUpdate,
) -> Chatbot:
    """Apply partial updates from *chatbot_update* to *db_chatbot*."""
    update_data = chatbot_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_chatbot, field, value)
    db.commit()
    db.refresh(db_chatbot)
    return db_chatbot


def delete_chatbot(db: Session, db_chatbot: Chatbot) -> None:
    """Remove *db_chatbot* from the database."""
    db.delete(db_chatbot)
    db.commit()
