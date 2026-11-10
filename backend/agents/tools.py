"""Agent tools — composable capabilities that agents can invoke."""

from __future__ import annotations

import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Optional, Protocol, runtime_checkable

from domains.real_estate.calculators import calculate_emi
from domains.real_estate.mock_data import get_all_properties
from domains.real_estate.models import SiteVisit, SiteVisitStatus
from domains.real_estate.services import LeadScoringService, PropertyMatchingService


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class ToolResult:
    success: bool
    data: dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None


# ---------------------------------------------------------------------------
# Protocol
# ---------------------------------------------------------------------------

@runtime_checkable
class Tool(Protocol):
    @property
    def name(self) -> str: ...

    @property
    def description(self) -> str: ...

    def execute(self, parameters: dict[str, Any], context: dict[str, Any]) -> ToolResult: ...


# ---------------------------------------------------------------------------
# Concrete tools
# ---------------------------------------------------------------------------

class PropertySearchTool:
    """Searches mock property data by location, BHK, and budget."""

    @property
    def name(self) -> str:
        return "property_search"

    @property
    def description(self) -> str:
        return "Search properties by location, BHK type, and budget range"

    def __init__(self) -> None:
        self._service = PropertyMatchingService()

    def execute(self, parameters: dict[str, Any], context: dict[str, Any]) -> ToolResult:
        location = parameters.get("location")
        bhk = parameters.get("bhk")
        budget_min = parameters.get("budget_min")
        budget_max = parameters.get("budget_max")

        # If only a single budget figure, apply ±15 %
        if budget_min and not budget_max:
            budget_max = budget_min * 1.15
            budget_min = budget_min * 0.85
        elif budget_max and not budget_min:
            budget_min = budget_max * 0.85

        results = self._service.search(
            location=location,
            bhk=bhk,
            budget_min=budget_min,
            budget_max=budget_max,
            limit=parameters.get("limit", 5),
        )

        return ToolResult(
            success=True,
            data={
                "properties": [p.model_dump(mode="json") for p in results],
                "count": len(results),
            },
        )


class EMICalculatorTool:
    """Calculates EMI for a given property price."""

    @property
    def name(self) -> str:
        return "emi_calculator"

    @property
    def description(self) -> str:
        return "Calculate monthly EMI for a property purchase"

    def execute(self, parameters: dict[str, Any], context: dict[str, Any]) -> ToolResult:
        principal_lakhs = parameters.get("principal_lakhs", 0)
        annual_rate = parameters.get("annual_rate", 8.5)
        tenure_years = parameters.get("tenure_years", 20)

        if principal_lakhs <= 0:
            return ToolResult(success=False, error="principal_lakhs must be > 0")

        result = calculate_emi(
            principal_lakhs=principal_lakhs,
            annual_rate=annual_rate,
            tenure_years=tenure_years,
        )
        return ToolResult(success=True, data=result)


class LeadScorerTool:
    """Scores a lead based on customer profile and interaction data."""

    @property
    def name(self) -> str:
        return "lead_scorer"

    @property
    def description(self) -> str:
        return "Score a sales lead based on engagement and intent signals"

    def __init__(self) -> None:
        self._service = LeadScoringService()

    def execute(self, parameters: dict[str, Any], context: dict[str, Any]) -> ToolResult:
        customer_profile = parameters.get("customer_profile", {})
        interaction_data = parameters.get("interaction_data", {})

        breakdown = self._service.score_lead(customer_profile, interaction_data)
        temperature = self._service.temperature_from_score(breakdown.overall)
        probability = self._service.conversion_probability(breakdown.overall)

        return ToolResult(
            success=True,
            data={
                "score_breakdown": breakdown.model_dump(),
                "temperature": temperature.value,
                "conversion_probability": probability,
            },
        )


class SiteVisitBookerTool:
    """Books a site visit for a lead at a specific property."""

    @property
    def name(self) -> str:
        return "site_visit_booker"

    @property
    def description(self) -> str:
        return "Schedule a site visit for a customer at a property"

    def execute(self, parameters: dict[str, Any], context: dict[str, Any]) -> ToolResult:
        lead_id = parameters.get("lead_id", "")
        property_id = parameters.get("property_id", "")
        preferred_date = parameters.get("date", "")
        preferred_time = parameters.get("time", "11:00 AM")

        if not property_id:
            # Pick the first matching property if available in context
            properties = context.get("matched_properties", [])
            if properties:
                property_id = properties[0].get("id", "")

        # Determine a date — default to upcoming Saturday
        if not preferred_date:
            from datetime import timedelta

            today = datetime.now(timezone.utc).date()
            days_until_saturday = (5 - today.weekday()) % 7
            if days_until_saturday == 0:
                days_until_saturday = 7
            preferred_date = (today + timedelta(days=days_until_saturday)).isoformat()

        visit = SiteVisit(
            id=f"sv-{uuid.uuid4().hex[:8]}",
            lead_id=lead_id,
            property_id=property_id,
            scheduled_date=preferred_date,
            scheduled_time=preferred_time,
            status=SiteVisitStatus.SCHEDULED,
            notes=parameters.get("notes", ""),
        )

        return ToolResult(
            success=True,
            data={
                "site_visit": visit.model_dump(mode="json"),
                "confirmation": f"Site visit booked for {preferred_date} at {preferred_time}",
            },
        )


# ---------------------------------------------------------------------------
# Registry
# ---------------------------------------------------------------------------

class ToolRegistry:
    """Central registry for agent tools."""

    def __init__(self) -> None:
        self._tools: dict[str, Tool] = {}

    def register(self, tool: Tool) -> None:
        self._tools[tool.name] = tool

    def get(self, name: str) -> Tool:
        if name not in self._tools:
            raise KeyError(f"Tool '{name}' not registered")
        return self._tools[name]

    def list_all(self) -> list[str]:
        return list(self._tools.keys())


# Singleton registry with all tools pre-registered
tool_registry = ToolRegistry()
tool_registry.register(PropertySearchTool())
tool_registry.register(EMICalculatorTool())
tool_registry.register(LeadScorerTool())
tool_registry.register(SiteVisitBookerTool())
