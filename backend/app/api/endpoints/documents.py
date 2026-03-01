"""
Document upload & listing endpoints.

POST /upload  – accepts a file + chatbot_id, kicks off background RAG processing.
GET  /chatbot/{chatbot_id} – lists all documents for a bot.

Mounted under /api/documents by the main app.
"""

from uuid import UUID

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.crud.crud_chatbot import get_chatbot_by_id_and_user
from app.crud.crud_document import create_document_record, get_documents_by_chatbot
from app.db.database import get_db
from app.db.models import User
from app.schemas.document import DocumentResponse, DocumentUploadResponse
from app.services.rag_service import extract_text_from_file, process_and_embed_document

router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_EXTENSIONS = {"pdf", "txt"}


def _get_extension(filename: str) -> str:
    return filename.rsplit(".", maxsplit=1)[-1].lower() if "." in filename else ""


# ── POST /upload ─────────────────────────────────────────────────────────
@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Upload a document for RAG processing",
)
async def upload_document(
    background_tasks: BackgroundTasks,
    chatbot_id: UUID = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Validate chatbot ownership
    chatbot = get_chatbot_by_id_and_user(db, chatbot_id, current_user.id)
    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found",
        )

    # 2. Validate file extension
    ext = _get_extension(file.filename or "")
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '.{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # 3. Read file bytes
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty",
        )

    # 4. Extract text (fast enough to do synchronously; catches corrupt files early)
    try:
        text = extract_text_from_file(file_bytes, file.filename or "")
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract any text from the file",
        )

    # 5. Create DB record
    document = create_document_record(
        db=db,
        user_id=current_user.id,
        chatbot_id=chatbot_id,
        file_name=file.filename or "untitled",
        file_type=ext,
        file_url=f"uploads/{current_user.id}/{file.filename}",
    )

    # 6. Enqueue background embedding job (uses its own DB session)
    background_tasks.add_task(process_and_embed_document, document.id, text)

    return DocumentUploadResponse(
        message="File accepted – processing in background",
        document=DocumentResponse.model_validate(document),
    )


# ── GET /chatbot/{chatbot_id} ───────────────────────────────────────────
@router.get(
    "/chatbot/{chatbot_id}",
    response_model=list[DocumentResponse],
    summary="List all documents for a chatbot",
)
def list_documents(
    chatbot_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify chatbot ownership
    chatbot = get_chatbot_by_id_and_user(db, chatbot_id, current_user.id)
    if not chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chatbot not found",
        )
    return get_documents_by_chatbot(db, chatbot_id, current_user.id)
