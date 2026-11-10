"""Integration framework — contracts and registry for external SaaS connectors."""

from __future__ import annotations

import enum
from dataclasses import dataclass, field
from typing import Any, Protocol, runtime_checkable


class IntegrationType(str, enum.Enum):
    CRM = "CRM"
    MESSAGING = "MESSAGING"
    CALENDAR = "CALENDAR"
    PAYMENT = "PAYMENT"
    ANALYTICS = "ANALYTICS"


@dataclass
class IntegrationManifest:
    name: str
    integration_type: IntegrationType
    version: str = "0.1.0"
    description: str = ""
    capabilities: list[str] = field(default_factory=list)


@runtime_checkable
class Integration(Protocol):
    @property
    def manifest(self) -> IntegrationManifest: ...

    def connect(self) -> bool: ...

    def disconnect(self) -> bool: ...

    def health_check(self) -> bool: ...

    def execute(self, action: str, parameters: dict[str, Any]) -> dict[str, Any]: ...


class IntegrationRegistry:
    """Central registry of installed platform integrations."""

    def __init__(self) -> None:
        self._integrations: dict[str, Integration] = {}

    def register(self, integration: Integration) -> None:
        self._integrations[integration.manifest.name] = integration

    def get(self, name: str) -> Integration:
        if name not in self._integrations:
            raise KeyError(f"Integration '{name}' not found")
        return self._integrations[name]

    def list_all(self) -> list[IntegrationManifest]:
        return [i.manifest for i in self._integrations.values()]


class SimulatedWhatsAppIntegration:
    """Mock integration representing future WhatsApp Cloud API connector."""

    @property
    def manifest(self) -> IntegrationManifest:
        return IntegrationManifest(
            name="whatsapp_cloud_api",
            integration_type=IntegrationType.MESSAGING,
            description="Direct WhatsApp Business Cloud API connector for automated buyer engagement.",
            capabilities=["send_message", "send_template", "receive_webhook"],
        )

    def connect(self) -> bool:
        return True

    def disconnect(self) -> bool:
        return True

    def health_check(self) -> bool:
        return True

    def execute(self, action: str, parameters: dict[str, Any]) -> dict[str, Any]:
        return {"status": "simulated_success", "action": action, "payload": parameters}


class SimulatedCRMIntegration:
    """Mock integration representing LeadSquared / Sell.Do / Zoho connectors."""

    @property
    def manifest(self) -> IntegrationManifest:
        return IntegrationManifest(
            name="leadsquared_adapter",
            integration_type=IntegrationType.CRM,
            description="Bidirectional sync with Indian real-estate CRM systems.",
            capabilities=["upsert_lead", "post_activity", "assign_agent"],
        )

    def connect(self) -> bool:
        return True

    def disconnect(self) -> bool:
        return True

    def health_check(self) -> bool:
        return True

    def execute(self, action: str, parameters: dict[str, Any]) -> dict[str, Any]:
        return {"status": "simulated_success", "action": action, "payload": parameters}


# Registry singleton
integration_registry = IntegrationRegistry()
integration_registry.register(SimulatedWhatsAppIntegration())
integration_registry.register(SimulatedCRMIntegration())
