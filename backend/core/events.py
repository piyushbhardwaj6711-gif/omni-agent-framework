"""Simple in-process event bus for decoupled communication between services."""

from __future__ import annotations

from typing import Any, Callable

# ---------------------------------------------------------------------------
# Predefined event type constants
# ---------------------------------------------------------------------------

LEAD_CREATED: str = "lead.created"
LEAD_QUALIFIED: str = "lead.qualified"
PROPERTY_MATCHED: str = "property.matched"
SITE_VISIT_REQUESTED: str = "site_visit.requested"
SITE_VISIT_BOOKED: str = "site_visit.booked"
CONVERSATION_STARTED: str = "conversation.started"
MESSAGE_RECEIVED: str = "message.received"


# ---------------------------------------------------------------------------
# Event bus
# ---------------------------------------------------------------------------

class EventBus:
    """A minimal publish/subscribe event bus running in-process.

    Handlers are invoked synchronously in subscription order.
    """

    def __init__(self) -> None:
        self._subscribers: dict[str, list[Callable[..., Any]]] = {}

    def subscribe(self, event_type: str, handler: Callable[..., Any]) -> None:
        """Register *handler* to be called whenever *event_type* is published."""
        self._subscribers.setdefault(event_type, []).append(handler)

    def publish(self, event_type: str, data: Any = None) -> None:
        """Publish an event, invoking all registered handlers."""
        for handler in self._subscribers.get(event_type, []):
            handler(data)


# Singleton instance shared across the application
event_bus = EventBus()
