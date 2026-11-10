"""Policy engine — governs which agent actions require human approval."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Optional, Protocol, runtime_checkable

from core.types import ActionApproval, AgentId, TenantContext


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class Action:
    """Describes an action an agent wants to perform."""

    agent_id: AgentId
    action_type: str
    description: str
    parameters: dict[str, Any] = field(default_factory=dict)
    requires_approval: bool = False


@dataclass
class ApprovalResult:
    """Outcome of a policy evaluation or human review."""

    approved: bool
    reason: str
    approved_by: Optional[str] = None


# ---------------------------------------------------------------------------
# Protocol (interface)
# ---------------------------------------------------------------------------

@runtime_checkable
class PolicyEngine(Protocol):
    """Abstract interface for policy evaluation."""

    def evaluate(self, action: Action, context: TenantContext) -> ActionApproval: ...


# ---------------------------------------------------------------------------
# Mock implementation
# ---------------------------------------------------------------------------

class MockPolicyEngine:
    """Default policy engine for the demo.

    Returns ``AUTO`` for most actions.  Actions whose *action_type* or
    *description* mentions **discount** or **commitment** require manual
    approval.
    """

    def evaluate(self, action: Action, context: TenantContext) -> ActionApproval:
        combined = f"{action.action_type} {action.description}".lower()
        if "discount" in combined or "commitment" in combined:
            return ActionApproval.REQUIRES_APPROVAL
        return ActionApproval.AUTO
