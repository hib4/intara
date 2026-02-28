"""
Chatbot CRUD endpoints – all protected by JWT authentication.

Mounted under /api/chatbots by the main app.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.crud.crud_chatbot import (
    create_chatbot as crud_create,
    delete_chatbot as crud_delete,
    get_chatbot_by_id_and_user,
    get_chatbots_by_user,
    update_chatbot as crud_update,
)
from app.db.database import get_db
from app.db.models import User
from app.schemas.chatbot import ChatbotCreate, ChatbotResponse, ChatbotUpdate

router = APIRouter(prefix="/chatbots", tags=["Chatbots"])


# ── POST / ───────────────────────────────────────────────────────────────
@router.post(
    "/",
    response_model=ChatbotResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new chatbot",
)
def create_chatbot(
    payload: ChatbotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud_create(db, payload, current_user.id)


# ── GET / ────────────────────────────────────────────────────────────────
@router.get(
    "/",
    response_model=list[ChatbotResponse],
    summary="List all chatbots for the authenticated user",
)
def list_chatbots(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_chatbots_by_user(db, current_user.id)


# ── GET /{chatbot_id} ───────────────────────────────────────────────────
@router.get(
    "/{chatbot_id}",
    response_model=ChatbotResponse,
    summary="Get a single chatbot by ID",
)
def get_chatbot(
    chatbot_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bot = get_chatbot_by_id_and_user(db, chatbot_id, current_user.id)
    if not bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found",
        )
    return bot


# ── PUT /{chatbot_id} ───────────────────────────────────────────────────
@router.put(
    "/{chatbot_id}",
    response_model=ChatbotResponse,
    summary="Update an existing chatbot",
)
def update_chatbot(
    chatbot_id: UUID,
    payload: ChatbotUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bot = get_chatbot_by_id_and_user(db, chatbot_id, current_user.id)
    if not bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found",
        )
    return crud_update(db, bot, payload)


# ── DELETE /{chatbot_id} ─────────────────────────────────────────────────
@router.delete(
    "/{chatbot_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a chatbot",
)
def delete_chatbot(
    chatbot_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bot = get_chatbot_by_id_and_user(db, chatbot_id, current_user.id)
    if not bot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found",
        )
    crud_delete(db, bot)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
