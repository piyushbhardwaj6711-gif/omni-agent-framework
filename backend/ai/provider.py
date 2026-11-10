"""Abstract AI provider protocol and registry."""

from __future__ import annotations

from typing import Any, Protocol, runtime_checkable


@runtime_checkable
class AIProvider(Protocol):
    """Contract every AI provider must satisfy.

    The V0 ships with a mock; future versions will plug in OpenAI / Gemini /
    local models via the same interface.
    """

    def extract_intent(self, text: str, context: dict[str, Any]) -> dict[str, Any]:
        """Return a structured intent dict parsed from *text*."""
        ...

    def generate_response(self, prompt: str, context: dict[str, Any]) -> str:
        """Generate a natural-language response for *prompt*."""
        ...

    def embed_text(self, text: str) -> list[float]:
        """Return a vector embedding for *text* (for future semantic search)."""
        ...


class AIProviderRegistry:
    """Registry for named AI provider implementations."""

    def __init__(self) -> None:
        self._providers: dict[str, AIProvider] = {}

    def register(self, name: str, provider: AIProvider) -> None:
        self._providers[name] = provider

    def get(self, name: str) -> AIProvider:
        if name not in self._providers:
            raise KeyError(f"AI provider '{name}' is not registered")
        return self._providers[name]

    def list_all(self) -> list[str]:
        return list(self._providers.keys())


# Singleton registry
ai_provider_registry = AIProviderRegistry()
