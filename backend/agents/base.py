"""Agent framework — base protocol, config, context, response, and registry."""

from __future__ import annotations

import enum
from dataclasses import dataclass, field
from typing import Any, Optional, Protocol, runtime_checkable

from core.types import AgentId, ConversationId, TenantId


# ---------------------------------------------------------------------------
# Capability enum
# ---------------------------------------------------------------------------

class AgentCapability(str, enum.Enum):
    PROPERTY_SEARCH = "PROPERTY_SEARCH"
    LEAD_QUALIFICATION = "LEAD_QUALIFICATION"
    EMI_CALCULATION = "EMI_CALCULATION"
    SITE_VISIT_BOOKING = "SITE_VISIT_BOOKING"
    FOLLOW_UP = "FOLLOW_UP"
    NEGOTIATION = "NEGOTIATION"


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class AgentConfig:
    id: AgentId
    name: str
    description: str
    capabilities: list[AgentCapability]
    instructions: str = ""
    policies: dict[str, Any] = field(default_factory=dict)


@dataclass
class AgentContext:
    tenant_id: TenantId
    conversation_id: ConversationId
    customer_profile: dict[str, Any] = field(default_factory=dict)
    conversation_history: list[dict[str, Any]] = field(default_factory=list)
    business_context: dict[str, Any] = field(default_factory=dict)


@dataclass
class AgentResponse:
    message: str
    properties: list[dict[str, Any]] = field(default_factory=list)
    lead_update: Optional[dict[str, Any]] = None
    actions_taken: list[str] = field(default_factory=list)
    suggestions: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Protocol
# ---------------------------------------------------------------------------

@runtime_checkable
class BaseAgent(Protocol):
    @property
    def config(self) -> AgentConfig: ...

    def process_message(self, message: str, context: AgentContext) -> AgentResponse: ...


# ---------------------------------------------------------------------------
# Registry
# ---------------------------------------------------------------------------

class AgentRegistry:
    """Registry for agent instances, keyed by agent ID."""

    def __init__(self) -> None:
        self._agents: dict[AgentId, BaseAgent] = {}

    def register(self, agent: BaseAgent) -> None:
        self._agents[agent.config.id] = agent

    def get(self, agent_id: AgentId) -> BaseAgent:
        if agent_id not in self._agents:
            raise KeyError(f"Agent '{agent_id}' not registered")
        return self._agents[agent_id]

    def list_all(self) -> list[AgentConfig]:
        return [a.config for a in self._agents.values()]


# Singleton registry
agent_registry = AgentRegistry()
