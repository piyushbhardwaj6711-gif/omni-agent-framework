"""Endpoints for querying real estate properties and projects."""

from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query

from application.property_service import property_service
from core.types import ProjectId, PropertyId

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("", summary="Search and list properties")
@router.get("/search", summary="Alias: Search and list properties")
def list_properties(
    location: Optional[str] = Query(None, description="Location/Area filter"),
    bhk: Optional[int] = Query(None, description="BHK count"),
    budget_min: Optional[float] = Query(None, description="Min budget in Lakhs"),
    budget_max: Optional[float] = Query(None, description="Max budget in Lakhs"),
    limit: int = Query(10, ge=1, le=50),
) -> list[dict[str, Any]]:
    props = property_service.search_properties(
        location=location,
        bhk=bhk,
        budget_min=budget_min,
        budget_max=budget_max,
        limit=limit,
    )
    return [p.model_dump(mode="json") for p in props]


@router.get("/{property_id}", summary="Get property by ID")
def get_property(property_id: str) -> dict[str, Any]:
    prop = property_service.get_property(PropertyId(property_id))
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop.model_dump(mode="json")


@router.get("/projects/all", summary="List all active residential projects")
def list_projects() -> list[dict[str, Any]]:
    projects = property_service.list_all_projects()
    return [p.model_dump(mode="json") for p in projects]
