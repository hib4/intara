"""
Public chat endpoint – RAG inference pipeline.

This router is **unauthenticated**.  The target chatbot is identified by its
unique ``public_link_slug``.

Flow
----
1. Resolve chatbot via slug (404 if missing / inactive).
2. Get-or-create a chat session.
3. Save the user message.
4. Retrieve relevant context via vector similarity search.
5. Generate an LLM answer grounded in that context.
6. Save the AI message.
7. Return the answer + session_id to the caller.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud.crud_chat import get_or_create_session, save_message
from app.db.database import get_db
from app.db.models import Chatbot
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service_qwen import generate_answer
from app.services.vector_search_qwen import search_similar_chunks

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/public/chat", tags=["Public Chat"])


@router.post(
    "/{public_link_slug}",
    response_model=ChatResponse,
    summary="Send a message to a public chatbot",
)
def public_chat(
    public_link_slug: str,
    body: ChatRequest,
    db: Session = Depends(get_db),
):
    """Full RAG inference pipeline for an end-user message."""

    # ── 1. Resolve chatbot ───────────────────────────────────────────
    chatbot = (
        db.query(Chatbot)
        .filter(
            Chatbot.public_link_slug == public_link_slug,
            Chatbot.is_active.is_(True),
        )
        .first()
    )
    if chatbot is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found or inactive",
        )

    # ── 2. Session management ────────────────────────────────────────
    session = get_or_create_session(
        db,
        chatbot_id=chatbot.id,
        customer_identifier=body.customer_identifier,
        session_id=body.session_id,
    )

    # ── 3. Save user message ─────────────────────────────────────────
    save_message(db, session_id=session.id, sender_type="USER", content=body.message)

    # ── 4. Vector search (retrieve context) ──────────────────────────
    try:
        context = search_similar_chunks(
            db,
            chatbot_id=chatbot.id,
            user_query=body.message,
        )
    except Exception:
        logger.exception("Vector search failed for chatbot %s", chatbot.id)
        context = ""

    # ── 5. LLM generation ────────────────────────────────────────────
    try:
        answer = generate_answer(
            user_query=body.message,
            context=context,
            role_prompt=chatbot.role_prompt,
        )
    except Exception:
        logger.exception("LLM generation failed for chatbot %s", chatbot.id)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI service is temporarily unavailable. Please try again.",
        )

    # ── 6. Save AI message ───────────────────────────────────────────
    save_message(db, session_id=session.id, sender_type="AI", content=answer)

    # ── 7. Commit the whole transaction ──────────────────────────────
    db.commit()

    return ChatResponse(answer=answer, session_id=session.id)
