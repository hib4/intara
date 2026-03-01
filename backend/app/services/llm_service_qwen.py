"""
LLM generation service – **Qwen / DashScope version**.

Drop-in replacement for ``llm_service.py`` that uses Alibaba Cloud's
Qwen model via the ``langchain-qwq`` package instead of Google Gemini.
"""

from __future__ import annotations

import logging

from langchain_qwq import ChatQwen
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

# Reusable LLM client – Alibaba Cloud Qwen via DashScope
# ChatQwen reads the API key from the ALIBABA_API_KEY environment variable.
_llm = ChatQwen(
    model="qwen-plus-latest",
    api_key=settings.ALIBABA_API_KEY,
    temperature=0.3,
    max_tokens=1024,
)


def generate_answer(
    user_query: str,
    context: str,
    role_prompt: str | None = None,
) -> str:
    """Send a grounded question to Qwen and return the response text.

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

        # ── Future: Qwen3 reasoning models expose chain-of-thought ───
        # reasoning = response.additional_kwargs.get("reasoning_content")
        # if reasoning:
        #     logger.debug("Qwen reasoning trace (%d chars)", len(reasoning))

        logger.info("LLM (Qwen) generated %d-char answer", len(answer))
        return answer
    except Exception:
        logger.exception("Qwen LLM call failed")
        raise
