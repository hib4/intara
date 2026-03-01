"""
Vector similarity search over DocumentChunk embeddings.

Uses pgvector's cosine distance operator (<=>) to find the most relevant
chunks for a given user query, scoped to a specific chatbot.
"""

from __future__ import annotations

import logging
from uuid import UUID

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.models import Document, DocumentChunk

logger = logging.getLogger(__name__)

# Reusable embeddings client – instantiated once at module level.
_embeddings_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=settings.GOOGLE_API_KEY,
)


def search_similar_chunks(
    db: Session,
    chatbot_id: UUID,
    user_query: str,
    top_k: int = 3,
) -> str:
    """Return concatenated text of the *top_k* most similar chunks.

    Steps
    -----
    1. Embed *user_query* with Gemini.
    2. Query ``document_chunks`` using cosine distance (``<=>``) filtered
       to documents owned by *chatbot_id* with status ``READY``.
    3. Concatenate the top-K chunk texts separated by double newlines.

    Returns an empty string when no relevant chunks are found.
    """
    # 1. Generate query embedding
    query_vector: list[float] = _embeddings_model.embed_query(user_query)

    # 2. Build the similarity query
    #    DocumentChunk → Document (chatbot_id filter + READY status)
    stmt = (
        select(DocumentChunk.content)
        .join(Document, DocumentChunk.document_id == Document.id)
        .where(
            Document.chatbot_id == chatbot_id,
            Document.status == "READY",
            DocumentChunk.embedding.isnot(None),
        )
        .order_by(DocumentChunk.embedding.cosine_distance(query_vector))
        .limit(top_k)
    )

    rows = db.execute(stmt).scalars().all()

    if not rows:
        logger.info("No matching chunks found for chatbot %s", chatbot_id)
        return ""

    context = "\n\n".join(rows)
    logger.info(
        "Retrieved %d chunks (top_k=%d) for chatbot %s",
        len(rows),
        top_k,
        chatbot_id,
    )
    return context
