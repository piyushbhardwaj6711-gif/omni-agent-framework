"""Multi-tenancy context middleware and dependency injection."""

from __future__ import annotations

from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from core.types import TenantContext, TenantId
from domains.real_estate.mock_data import DEMO_TENANT_ID


class TenantMiddleware(BaseHTTPMiddleware):
    """Inspects headers to bind TenantContext onto each request state."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        raw_tenant = request.headers.get("X-Tenant-ID") or str(DEMO_TENANT_ID)
        tenant_id = TenantId(raw_tenant)

        request.state.tenant_context = TenantContext(
            tenant_id=tenant_id,
            user_id="user-rahul-001",
            roles=["broker", "admin"],
        )

        response = await call_next(request)
        response.headers["X-Tenant-ID"] = str(tenant_id)
        return response


def get_tenant_context(request: Request) -> TenantContext:
    """Dependency helper to inject tenant context into FastAPI endpoints."""
    return getattr(
        request.state,
        "tenant_context",
        TenantContext(tenant_id=DEMO_TENANT_ID, roles=["broker"]),
    )
