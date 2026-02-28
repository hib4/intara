"""Pydantic schemas for JWT token responses."""

from pydantic import BaseModel


class Token(BaseModel):
    """Returned on successful login."""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Decoded JWT payload – used internally by dependencies."""

    email: str | None = None
