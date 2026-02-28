"""
Database configuration and session management for Intara.

Provides:
- engine: SQLAlchemy engine bound to PostgreSQL.
- SessionLocal: Scoped session factory for request-level DB access.
- Base: Declarative base class for all ORM models.
- get_db(): FastAPI dependency that yields a session per request.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,   # verify connections before checkout
    pool_size=10,          # sensible default for dev → prod
    max_overflow=20,
    echo=False,            # flip to True for SQL-level debugging
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    """FastAPI dependency – yields a DB session and ensures it is closed."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
