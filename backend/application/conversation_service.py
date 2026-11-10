"""Application service orchestrating real-time buyer conversations with AI agents."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from agents.base import AgentContext, agent_registry
from application.lead_service import lead_service
from core.events import event_bus
from core.observability import ActivityLog, activity_logger
from core.types import AgentId, ConversationId, LeadId, TenantId
from domains.real_estate.mock_data import DEMO_TENANT_ID
from domains.real_estate.models import (
    Conversation,
    ConversationStatus,
    Lead,
    Message,
    MessageRole,
)


class ConversationService:
    """Manages conversational sessions between prospective buyers and EstateIQ agents."""

    def __init__(self) -> None:
        self._conversations: dict[ConversationId, Conversation] = {}
        self._context_store: dict[ConversationId, dict[str, Any]] = {}

    def start_conversation(self, tenant_id: TenantId = DEMO_TENANT_ID) -> Conversation:
        """Initialize a new conversation with a welcome prompt."""
        cid = ConversationId(f"conv-{uuid.uuid4().hex[:8]}")

        welcome_text = (
            "Namaste! 🙏 Main EstateIQ ka AI Sales Assistant hoon.\n\n"
            "Aap Pune mein dream home search kar rahe hain? "
            "Bataiye kya requirement hai — **Location, Budget, BHK, ya Loan guidance** — "
            "aur main aapko RERA-verified options dikhata hoon!"
        )

        first_msg = Message(
            id=f"msg-{uuid.uuid4().hex[:6]}",
            role=MessageRole.AGENT,
            content=welcome_text,
            timestamp=datetime.now(timezone.utc),
            metadata={
                "initial_greeting": True,
                "suggestions": [
                    "Baner mein 3BHK chahiye, budget 90 lakh tak hai, loan lagega",
                    "Hinjewadi mein 2BHK options dikhao",
                    "Kharadi mein ready possession flats",
                ],
            },
        )

        conv = Conversation(
            id=cid,
            tenant_id=tenant_id,
            messages=[first_msg],
            status=ConversationStatus.ACTIVE,
        )

        self._conversations[cid] = conv
        self._context_store[cid] = {
            "customer_profile": {
                "name": "Gaurav Kulkarni",
                "phone": "+91-9823012345",
            },
            "matched_properties": [],
        }

        activity_logger.log(
            ActivityLog(
                id=f"act-{uuid.uuid4().hex[:6]}",
                tenant_id=tenant_id,
                actor="System",
                action="CONVERSATION_STARTED",
                details={"conversation_id": str(cid)},
            )
        )
        event_bus.publish("CONVERSATION_STARTED", {"conversation_id": str(cid)})

        return conv

    def get_conversation(self, conversation_id: ConversationId) -> Optional[Conversation]:
        return self._conversations.get(conversation_id)

    def process_message(
        self,
        conversation_id: ConversationId,
        message_text: str,
    ) -> dict[str, Any]:
        """Process incoming user prompt, invoke SalesAgent, update CRM lead and audit log."""
        conv = self._conversations.get(conversation_id)
        if not conv:
            conv = self.start_conversation()
            conversation_id = conv.id

        # Record User message
        user_msg = Message(
            id=f"msg-{uuid.uuid4().hex[:6]}",
            role=MessageRole.USER,
            content=message_text,
            timestamp=datetime.now(timezone.utc),
        )
        conv.messages.append(user_msg)

        ctx_data = self._context_store.setdefault(conversation_id, {})
        history = [
            {"role": m.role.value, "content": m.content}
            for m in conv.messages[-6:]
        ]

        agent_ctx = AgentContext(
            tenant_id=conv.tenant_id,
            conversation_id=conversation_id,
            customer_profile=ctx_data.get("customer_profile", {}),
            conversation_history=history,
            business_context={
                "last_matched_properties": ctx_data.get("matched_properties", []),
            },
        )

        # Invoke Agent
        agent = agent_registry.get(AgentId("agent-sales-001"))
        start_time = datetime.now(timezone.utc)
        response = agent.process_message(message_text, agent_ctx)
        elapsed_ms = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000

        # Cache matched properties in context
        if response.properties:
            ctx_data["matched_properties"] = response.properties

        # Handle CRM Lead creation or update
        associated_lead: Optional[Lead] = None
        if response.lead_update:
            if not conv.lead_id:
                # Create lead
                lead_data = dict(response.lead_update)
                new_lead = lead_service.create_lead(conv.tenant_id, lead_data)
                conv.lead_id = new_lead.id
                associated_lead = new_lead
                ctx_data["customer_profile"]["lead_id"] = str(new_lead.id)
            else:
                associated_lead = lead_service.update_lead(conv.lead_id, response.lead_update)

        # Record Agent response message
        agent_msg = Message(
            id=f"msg-{uuid.uuid4().hex[:6]}",
            role=MessageRole.AGENT,
            content=response.message,
            timestamp=datetime.now(timezone.utc),
            metadata={
                "properties": response.properties,
                "suggestions": response.suggestions,
                "actions_taken": response.actions_taken,
                "metadata": response.metadata,
                "lead_id": str(conv.lead_id) if conv.lead_id else None,
            },
        )
        conv.messages.append(agent_msg)

        # Log activity
        activity_logger.log(
            ActivityLog(
                id=f"act-{uuid.uuid4().hex[:6]}",
                tenant_id=conv.tenant_id,
                actor="SalesAgent",
                action="MESSAGE_PROCESSED",
                details={
                    "conversation_id": str(conversation_id),
                    "actions": response.actions_taken,
                    "lead_id": str(conv.lead_id) if conv.lead_id else None,
                },
                duration_ms=round(elapsed_ms, 1),
            )
        )

        return {
            "conversation_id": str(conversation_id),
            "agent_response": {
                "message": response.message,
                "properties": response.properties,
                "actions_taken": response.actions_taken,
                "suggestions": response.suggestions,
                "lead_update": response.lead_update,
                "metadata": response.metadata,
            },
            "lead": associated_lead.model_dump(mode="json") if associated_lead else None,
            "conversation": conv.model_dump(mode="json"),
        }


# Singleton instance
conversation_service = ConversationService()
