"""Observability — activity logging for audit and dashboard."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Optional

from core.types import TenantId


# ---------------------------------------------------------------------------
# Data structure
# ---------------------------------------------------------------------------

@dataclass
class ActivityLog:
    """A single logged activity entry."""

    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    tenant_id: TenantId = TenantId("")
    actor: str = ""  # agent ID or user ID
    action: str = ""
    details: dict[str, Any] = field(default_factory=dict)
    duration_ms: Optional[int] = None


# ---------------------------------------------------------------------------
# Logger
# ---------------------------------------------------------------------------

class ActivityLogger:
    """In-memory activity logger.

    Stores the most recent activities per tenant for dashboard display and
    auditing.
    """

    def __init__(self) -> None:
        self._logs: list[ActivityLog] = []

    def log(self, activity: ActivityLog) -> None:
        """Append *activity* to the log store."""
        self._logs.append(activity)

    def get_recent(self, tenant_id: TenantId, limit: int = 20) -> list[ActivityLog]:
        """Return the *limit* most recent activities for *tenant_id*."""
        tenant_logs = [
            entry
            for entry in self._logs
            if entry.tenant_id == tenant_id
        ]
        return sorted(tenant_logs, key=lambda a: a.timestamp, reverse=True)[:limit]


# Singleton instance
activity_logger = ActivityLogger()
