"""Core type aliases, tenant context, and domain enums."""

from __future__ import annotations

import enum
from dataclasses import dataclass, field
from typing import NewType, Optional


# ---------------------------------------------------------------------------
# NewType aliases — give semantic meaning to raw str IDs
# ---------------------------------------------------------------------------

TenantId = NewType("TenantId", str)
UserId = NewType("UserId", str)
LeadId = NewType("LeadId", str)
PropertyId = NewType("PropertyId", str)
ConversationId = NewType("ConversationId", str)
AgentId = NewType("AgentId", str)
ProjectId = NewType("ProjectId", str)


# ---------------------------------------------------------------------------
# Tenant context — attached to every request
# ---------------------------------------------------------------------------

@dataclass
class TenantContext:
    """Encapsulates the multi-tenant context for the current request."""

    tenant_id: TenantId
    user_id: Optional[UserId] = None
    roles: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Domain enums
# ---------------------------------------------------------------------------

class LeadStatus(str, enum.Enum):
    """Lifecycle stage of a sales lead."""

    NEW = "NEW"
    CONTACTED = "CONTACTED"
    QUALIFIED = "QUALIFIED"
    NEGOTIATION = "NEGOTIATION"
    WON = "WON"
    LOST = "LOST"


class LeadTemperature(str, enum.Enum):
    """Qualitative temperature / urgency of a lead."""

    HOT = "HOT"
    WARM = "WARM"
    COLD = "COLD"


class ActionApproval(str, enum.Enum):
    """Policy engine decision for an agent action."""

    AUTO = "AUTO"
    REQUIRES_APPROVAL = "REQUIRES_APPROVAL"
    DENIED = "DENIED"
