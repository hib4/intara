"""
SQLAlchemy ORM models for the Intara platform.

All tables use UUID primary keys.  Indexes are placed on foreign-key columns
and frequently queried lookup fields (email, public_link_slug, etc.).

pgvector's Vector type is used for the embedding column.  If the pgvector
extension is not yet installed in PostgreSQL, the import gracefully falls back
to a Text column so the rest of the stack still works during early development.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.database import Base

# ---------------------------------------------------------------------------
# pgvector – graceful fallback
# ---------------------------------------------------------------------------
try:
    from pgvector.sqlalchemy import Vector

    VECTOR_TYPE = Vector(1536)  # OpenAI text-embedding-ada-002 dimensions
except ImportError:
    VECTOR_TYPE = Text  # placeholder until pgvector is configured


def _utcnow() -> datetime:
    """Return a timezone-aware UTC timestamp."""
    return datetime.now(timezone.utc)


# ═══════════════════════════════════════════════════════════════════════════
# User
# ═══════════════════════════════════════════════════════════════════════════
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    business_name = Column(String(255), nullable=False)
    business_category = Column(String(100), nullable=True)
    subscription_tier = Column(String(50), nullable=False, default="free")
    message_quota = Column(Integer, nullable=False, default=100)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    # relationships
    chatbots = relationship("Chatbot", back_populates="owner", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="owner", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User {self.email}>"


# ═══════════════════════════════════════════════════════════════════════════
# Chatbot
# ═══════════════════════════════════════════════════════════════════════════
class Chatbot(Base):
    __tablename__ = "chatbots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(255), nullable=False)
    role_prompt = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    public_link_slug = Column(String(100), unique=True, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    # relationships
    owner = relationship("User", back_populates="chatbots")
    documents = relationship("Document", back_populates="chatbot", cascade="all, delete-orphan")
    sessions = relationship("ChatSession", back_populates="chatbot", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Chatbot {self.name}>"


# ═══════════════════════════════════════════════════════════════════════════
# Document
# ═══════════════════════════════════════════════════════════════════════════
class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    chatbot_id = Column(
        UUID(as_uuid=True),
        ForeignKey("chatbots.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_url = Column(String(512), nullable=False)
    status = Column(String(50), nullable=False, default="pending")  # pending | processing | completed | failed

    # relationships
    owner = relationship("User", back_populates="documents")
    chatbot = relationship("Chatbot", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Document {self.file_name}>"


# ═══════════════════════════════════════════════════════════════════════════
# DocumentChunk  (RAG embeddings)
# ═══════════════════════════════════════════════════════════════════════════
class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    content = Column(Text, nullable=False)
    embedding = Column(VECTOR_TYPE, nullable=True)

    # relationships
    document = relationship("Document", back_populates="chunks")

    def __repr__(self) -> str:
        return f"<DocumentChunk doc={self.document_id}>"


# ═══════════════════════════════════════════════════════════════════════════
# Transaction  (Financial data for AI Insight dashboard)
# ═══════════════════════════════════════════════════════════════════════════
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    transaction_date = Column(DateTime(timezone=True), nullable=False, default=_utcnow)
    type = Column(String(20), nullable=False)  # INCOME | EXPENSE
    amount = Column(Numeric(precision=15, scale=2), nullable=False)
    product_name = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)

    # relationships
    owner = relationship("User", back_populates="transactions")

    # composite index: fast lookup by user + date range
    __table_args__ = (
        Index("ix_transactions_user_date", "user_id", "transaction_date"),
    )

    def __repr__(self) -> str:
        return f"<Transaction {self.type} {self.amount}>"


# ═══════════════════════════════════════════════════════════════════════════
# ChatSession
# ═══════════════════════════════════════════════════════════════════════════
class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chatbot_id = Column(
        UUID(as_uuid=True),
        ForeignKey("chatbots.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    customer_identifier = Column(String(255), nullable=True, index=True)
    started_at = Column(DateTime(timezone=True), default=_utcnow)

    # relationships
    chatbot = relationship("Chatbot", back_populates="sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<ChatSession {self.id}>"


# ═══════════════════════════════════════════════════════════════════════════
# ChatMessage
# ═══════════════════════════════════════════════════════════════════════════
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("chat_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    sender_type = Column(String(10), nullable=False)  # USER | AI
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=_utcnow)

    # relationships
    session = relationship("ChatSession", back_populates="messages")

    def __repr__(self) -> str:
        return f"<ChatMessage {self.sender_type}>"
