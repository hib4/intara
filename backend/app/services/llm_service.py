"""
LLM generation service – produces chatbot answers using Google Gemini.

The model is instructed to answer STRICTLY from the provided context. If the
answer cannot be found in the context the model politely declines.
"""

from __future__ import annotations

import logging

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

from app.core.config import settings

logger = logging.getLogger(__name__)

# Default system prompt used when the chatbot has no custom role_prompt.
_DEFAULT_ROLE = (
    "Anda adalah asisten AI yang ramah dan membantu. "
    "Jawab pertanyaan pengguna berdasarkan konteks yang diberikan."
)

_INSTRUCTION_TEMPLATE = (
    "{role_prompt}\n\n"
    "### INSTRUKSI ###\n"
    "Jawab pertanyaan pengguna HANYA berdasarkan konteks berikut. "
    "Jika jawabannya tidak terdapat dalam konteks, katakan dengan sopan bahwa "
    "Anda tidak memiliki informasi tersebut. Jangan mengarang jawaban.\n\n"
    "### KONTEKS ###\n"
    "{context}\n"
)

# Reusable LLM client
_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.GOOGLE_API_KEY,
    temperature=0.3,
    max_output_tokens=1024,
)


def generate_answer(
    user_query: str,
    context: str,
    role_prompt: str | None = None,
) -> str:
    """Send a grounded question to Gemini and return the response text.

    Parameters
    ----------
    user_query:
        The end-user's question.
    context:
        Concatenated document chunks retrieved from vector search.
    role_prompt:
        Optional persona / role instruction configured for the chatbot.
        Falls back to a friendly generic assistant prompt.

    Returns
    -------
    str – The generated answer text.
    """
    effective_role = role_prompt or _DEFAULT_ROLE

    # If there is no context at all, tell the model explicitly
    if not context.strip():
        context = "(Tidak ada konteks yang tersedia dari dokumen.)"

    system_text = _INSTRUCTION_TEMPLATE.format(
        role_prompt=effective_role,
        context=context,
    )

    messages = [
        SystemMessage(content=system_text),
        HumanMessage(content=user_query),
    ]

    try:
        response = _llm.invoke(messages)
        answer = response.content.strip()
        logger.info("LLM generated %d-char answer", len(answer))
        return answer
    except Exception:
        logger.exception("LLM call failed")
        raise
