"""EstateIQ — Autonomous Real Estate Intelligence Platform (V0 API)."""

from __future__ import annotations

import sys
from pathlib import Path

# Ensure backend root is on sys.path for local imports
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Force registration of mock AI provider and sales agent
import agents.sales_agent  # noqa: F401
import ai.mock_provider  # noqa: F401
from api.middleware import TenantMiddleware
from api.routes import conversations, dashboard, leads, properties
from config.settings import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Agentic AI Sales & Operations Platform for Real Estate Businesses (India-First).",
    debug=settings.debug,
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Multi-tenancy context middleware
app.add_middleware(TenantMiddleware)

# Register route modules under /api
app.include_router(conversations.router, prefix=settings.api_prefix)
app.include_router(leads.router, prefix=settings.api_prefix)
app.include_router(properties.router, prefix=settings.api_prefix)
app.include_router(dashboard.router, prefix=settings.api_prefix)


@app.get("/", tags=["system"])
def root() -> dict[str, str]:
    return {
        "name": settings.app_name,
        "version": settings.version,
        "status": "running",
        "mode": "DEMO / SIMULATED",
        "docs_url": "/docs",
    }


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "version": settings.version,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
