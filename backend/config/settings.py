"""Application settings using Pydantic BaseSettings for configuration management."""

from __future__ import annotations

from pydantic_settings import BaseSettings


class AppSettings(BaseSettings):
    """Central configuration for the EstateIQ application.

    Values can be overridden via environment variables prefixed with ``ESTATEIQ_``.
    Defaults are tuned for local / demo mode.
    """

    app_name: str = "EstateIQ"
    version: str = "0.1.0"
    debug: bool = True
    default_tenant_id: str = "demo-tenant-001"
    cors_origins: list[str] = ["*"]
    api_prefix: str = "/api"

    model_config = {"env_prefix": "ESTATEIQ_"}


# Singleton instance used across the application
settings = AppSettings()
