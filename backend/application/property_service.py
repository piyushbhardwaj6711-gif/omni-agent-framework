"""Application service for property and project discovery."""

from __future__ import annotations

from typing import Optional

from core.types import ProjectId, PropertyId
from domains.real_estate.mock_data import get_all_projects, get_all_properties
from domains.real_estate.models import Project, Property
from domains.real_estate.services import PropertyMatchingService


class PropertyService:
    """Provides high-level property querying and project retrieval."""

    def __init__(self) -> None:
        self._matching_service = PropertyMatchingService()
        self._properties_cache = {p.id: p for p in get_all_properties()}
        self._projects_cache = {p.id: p for p in get_all_projects()}

    def search_properties(
        self,
        location: Optional[str] = None,
        bhk: Optional[int] = None,
        budget_min: Optional[float] = None,
        budget_max: Optional[float] = None,
        limit: int = 5,
    ) -> list[Property]:
        return self._matching_service.search(
            location=location,
            bhk=bhk,
            budget_min=budget_min,
            budget_max=budget_max,
            limit=limit,
        )

    def get_property(self, property_id: PropertyId) -> Optional[Property]:
        return self._properties_cache.get(property_id)

    def get_project(self, project_id: ProjectId) -> Optional[Project]:
        return self._projects_cache.get(project_id)

    def list_all_properties(self) -> list[Property]:
        return list(self._properties_cache.values())

    def list_all_projects(self) -> list[Project]:
        return list(self._projects_cache.values())


# Singleton instance
property_service = PropertyService()
