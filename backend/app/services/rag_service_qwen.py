"""
RAG processing pipeline – **Qwen / DashScope version**.

Drop-in replacement for ``rag_service.py`` that uses Alibaba Cloud's
DashScope text-embedding-v3 model instead of Google Gemini embeddings.

This module is designed to run inside a FastAPI BackgroundTask.
It opens its own database session to avoid sharing the request-scoped one.

NOTE: DashScope text-embedding-v3 produces **1024-dim** vectors by default.
      If switching from the Gemini branch (3072-dim) you MUST run an Alembic
      migration to alter the ``document_chunks.embedding`` column:
          Vector(3072)  →  Vector(1024)
"""

from __future__ import annotations

import io
import logging
import uuid as _uuid

import pdfplumber
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import SessionLocal
from app.db.models import Document, DocumentChunk

logger = logging.getLogger(__name__)


# ── Text extraction ──────────────────────────────────────────────────────

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """Extract plain text from a .pdf or .txt upload.

    Raises ValueError for unsupported file types.
    """
    ext = filename.rsplit(".", maxsplit=1)[-1].lower() if "." in filename else ""

    if ext == "txt":
        return file_bytes.decode("utf-8", errors="replace")

    if ext == "pdf":
        text_parts: list[str] = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        return "\n\n".join(text_parts)

    raise ValueError(f"Unsupported file type: .{ext}")


# ── Chunk + Embed + Store ────────────────────────────────────────────────

def process_and_embed_document(document_id: _uuid.UUID, text: str) -> None:
    """Split *text* into chunks, generate DashScope embeddings, and persist.

    **Important:** This function creates its own DB session so it can safely
    run in a background thread outside of the request lifecycle.
    """
    db: Session = SessionLocal()
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if document is None:
            logger.error("Document %s not found – aborting processing", document_id)
            return

        # Mark as processing
        document.status = "PROCESSING"
        db.commit()

        # 1. Chunk
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )
        chunks = splitter.split_text(text)

        if not chunks:
            logger.warning("No chunks produced for document %s", document_id)
            document.status = "READY"
            db.commit()
            return

        # 2. Embed – Alibaba Cloud DashScope text-embedding-v3 (1024 dims)
        #    Uses OpenAI-compatible endpoint (intl) since the native DashScope
        #    SDK does not work with international API keys.
        embeddings_model = OpenAIEmbeddings(
            model="text-embedding-v3",
            openai_api_key=settings.ALIBABA_API_KEY,
            openai_api_base="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
            check_embedding_ctx_length=False,
        )
        vectors = embeddings_model.embed_documents(chunks)

        # 3. Store
        db_chunks = [
            DocumentChunk(
                document_id=document_id,
                content=chunk_text,
                embedding=vector,
            )
            for chunk_text, vector in zip(chunks, vectors)
        ]
        db.bulk_save_objects(db_chunks)

        # 4. Mark ready
        document.status = "READY"
        db.commit()

        logger.info(
            "Document %s processed – %d chunks stored (DashScope embeddings)",
            document_id,
            len(db_chunks),
        )

    except Exception:
        logger.exception("Failed to process document %s", document_id)
        # Attempt to mark as FAILED so the frontend can show status
        try:
            document = db.query(Document).filter(Document.id == document_id).first()
            if document:
                document.status = "FAILED"
                db.commit()
        except Exception:
            logger.exception("Could not mark document %s as FAILED", document_id)
    finally:
        db.close()
