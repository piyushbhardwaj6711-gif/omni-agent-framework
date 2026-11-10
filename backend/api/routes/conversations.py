"""Endpoints for customer-agent conversations (supports /conversations and /chat aliases)."""

from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from api.middleware import get_tenant_context
from application.conversation_service import conversation_service
from core.types import ConversationId, TenantContext

router = APIRouter(tags=["conversations"])


class SendMessageRequest(BaseModel):
    content: Optional[str] = None
    message: Optional[str] = None

    def get_text(self) -> str:
        text = self.content or self.message
        if not text or not text.strip():
            raise ValueError("Message content cannot be empty")
        return text.strip()


def _format_send_response(result: dict[str, Any]) -> dict[str, Any]:
    """Return top-level response compatible with both frontend formats."""
    agent_resp = result.get("agent_response", {})
    return {
        "conversation_id": result.get("conversation_id"),
        "message": agent_resp.get("message", ""),
        "properties": agent_resp.get("properties", []),
        "actions_taken": agent_resp.get("actions_taken", []),
        "suggestions": agent_resp.get("suggestions", []),
        "lead_update": agent_resp.get("lead_update"),
        "metadata": agent_resp.get("metadata", {}),
        "agent_response": agent_resp,
        "lead": result.get("lead"),
        "conversation": result.get("conversation"),
    }


# Standard /conversations routes
@router.post("/conversations", summary="Start a new AI sales conversation")
@router.post("/chat/start", summary="Alias: Start chat conversation")
def start_conversation(
    tenant_ctx: TenantContext = Depends(get_tenant_context),
) -> dict[str, Any]:
    conv = conversation_service.start_conversation(tenant_id=tenant_ctx.tenant_id)
    first_msg = conv.messages[0] if conv.messages else None
    return {
        "conversation_id": str(conv.id),
        "welcome_message": first_msg.content if first_msg else "",
        "suggestions": first_msg.metadata.get("suggestions", []) if first_msg else [],
        "created_at": conv.created_at.isoformat(),
        "status": conv.status.value,
    }


@router.get("/conversations/{conversation_id}", summary="Get conversation history")
@router.get("/chat/{conversation_id}", summary="Alias: Get chat history")
def get_conversation(conversation_id: str) -> dict[str, Any]:
    conv = conversation_service.get_conversation(ConversationId(conversation_id))
    if not conv:
        # Return fallback conversation if demo id
        if conversation_id in ("demo", "new"):
            conv = conversation_service.start_conversation()
        else:
            raise HTTPException(status_code=404, detail="Conversation not found")
    return conv.model_dump(mode="json")


@router.post("/conversations/{conversation_id}/messages", summary="Send message to agent")
@router.post("/chat/{conversation_id}/message", summary="Alias: Send chat message")
def send_message(
    conversation_id: str,
    payload: SendMessageRequest,
) -> dict[str, Any]:
    try:
        text = payload.get_text()
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    cid = ConversationId(conversation_id)
    if conversation_id in ("demo", "new"):
        conv = conversation_service.start_conversation()
        cid = conv.id

    result = conversation_service.process_message(
        conversation_id=cid,
        message_text=text,
    )
    return _format_send_response(result)
