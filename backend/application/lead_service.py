"""Application service for lead management and tracking."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from core.events import event_bus
from core.types import LeadId, LeadStatus, LeadTemperature, TenantId
from domains.real_estate.mock_data import DEMO_TENANT_ID
from domains.real_estate.models import Lead, NextBestAction
from domains.real_estate.services import NextBestActionService


class LeadService:
    """Manages lead lifecycle, scoring, and next-best-action generation."""

    def __init__(self) -> None:
        self._leads: dict[LeadId, Lead] = {}
        self._nba_service = NextBestActionService()
        self._seed_initial_leads()

    def _seed_initial_leads(self) -> None:
        """Seed realistic Pune buyer leads for dashboard intelligence."""
        seed_data = [
            {
                "id": "lead-001",
                "customer_name": "Gaurav Kulkarni",
                "phone": "+91-9823012345",
                "email": "gaurav.k@example.com",
                "source": "WhatsApp",
                "status": LeadStatus.QUALIFIED,
                "temperature": LeadTemperature.HOT,
                "score": 87,
                "conversion_probability": 0.83,
                "preferred_locations": ["Baner", "Mahalunge"],
                "bhk_preference": 3,
                "budget_min": 80.0,
                "budget_max": 95.0,
                "financing_needed": True,
                "assigned_to": "Rahul Sharma",
                "notes": ["Wants 3BHK near Baner", "Loan required (~80%)", "Saturday visit requested"],
            },
            {
                "id": "lead-002",
                "customer_name": "Priya Deshmukh",
                "phone": "+91-9823098765",
                "email": "priya.d@example.com",
                "source": "99acres",
                "status": LeadStatus.CONTACTED,
                "temperature": LeadTemperature.WARM,
                "score": 68,
                "conversion_probability": 0.62,
                "preferred_locations": ["Kharadi", "Keshav Nagar"],
                "bhk_preference": 2,
                "budget_min": 65.0,
                "budget_max": 75.0,
                "financing_needed": True,
                "assigned_to": "Rahul Sharma",
                "notes": ["Looking for 2BHK near EON IT Park Kharadi", "Budget strictly under 75L"],
            },
            {
                "id": "lead-003",
                "customer_name": "Amitabh Sen",
                "phone": "+91-9811223344",
                "email": "amitabh.sen@example.com",
                "source": "Meta Ads",
                "status": LeadStatus.NEW,
                "temperature": LeadTemperature.COLD,
                "score": 38,
                "conversion_probability": 0.32,
                "preferred_locations": ["Hinjewadi"],
                "bhk_preference": 2,
                "budget_min": 45.0,
                "budget_max": 55.0,
                "financing_needed": False,
                "assigned_to": "Rahul Sharma",
                "notes": ["Early stage exploratory inquiry for Hinjewadi"],
            },
            {
                "id": "lead-004",
                "customer_name": "Rajesh & Ananya Singhania",
                "phone": "+91-9988776655",
                "email": "rajesh.s@example.com",
                "source": "Direct Walk-in",
                "status": LeadStatus.NEGOTIATION,
                "temperature": LeadTemperature.HOT,
                "score": 92,
                "conversion_probability": 0.88,
                "preferred_locations": ["Kondhwa", "Viman Nagar"],
                "bhk_preference": 4,
                "budget_min": 140.0,
                "budget_max": 160.0,
                "financing_needed": False,
                "assigned_to": "Rahul Sharma",
                "notes": ["Interested in Shapoorji BKC 9 Sky Villa", "Ready down payment"],
            },
        ]

        for item in seed_data:
            lead = Lead(
                id=LeadId(item["id"]),
                tenant_id=DEMO_TENANT_ID,
                customer_name=item["customer_name"],
                phone=item["phone"],
                email=item.get("email"),
                source=item["source"],
                status=item["status"],
                temperature=item["temperature"],
                score=item["score"],
                conversion_probability=item["conversion_probability"],
                preferred_locations=item["preferred_locations"],
                bhk_preference=item["bhk_preference"],
                budget_min=item["budget_min"],
                budget_max=item["budget_max"],
                financing_needed=item["financing_needed"],
                assigned_to=item["assigned_to"],
                notes=item["notes"],
            )
            self._leads[lead.id] = lead

    def create_lead(self, tenant_id: TenantId, customer_data: dict[str, Any]) -> Lead:
        """Create and register a new lead."""
        lead_id = LeadId(f"lead-{uuid.uuid4().hex[:8]}")
        score = customer_data.get("score", 50)
        temp = (
            LeadTemperature.HOT
            if score >= 75
            else LeadTemperature.WARM
            if score >= 45
            else LeadTemperature.COLD
        )

        lead = Lead(
            id=lead_id,
            tenant_id=tenant_id,
            customer_name=customer_data.get("customer_name", "Anonymous Lead"),
            phone=customer_data.get("phone", ""),
            email=customer_data.get("email"),
            source=customer_data.get("source", "chat"),
            status=customer_data.get("status", LeadStatus.QUALIFIED),
            temperature=customer_data.get("temperature", temp),
            score=score,
            conversion_probability=customer_data.get("conversion_probability", score / 100 * 0.95),
            preferred_locations=customer_data.get("preferred_locations", []),
            bhk_preference=customer_data.get("bhk_preference"),
            budget_min=customer_data.get("budget_min"),
            budget_max=customer_data.get("budget_max"),
            financing_needed=customer_data.get("financing_needed", False),
            assigned_to=customer_data.get("assigned_to", "Rahul Sharma"),
            notes=customer_data.get("notes", []),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )

        self._leads[lead_id] = lead
        event_bus.publish("LEAD_CREATED", {"lead_id": str(lead_id), "name": lead.customer_name})
        return lead

    def get_lead(self, lead_id: LeadId) -> Optional[Lead]:
        return self._leads.get(lead_id)

    def update_lead(self, lead_id: LeadId, updates: dict[str, Any]) -> Optional[Lead]:
        lead = self._leads.get(lead_id)
        if not lead:
            return None

        # Apply field updates
        for k, v in updates.items():
            if k == "notes_append" and isinstance(v, str):
                lead.notes.append(v)
            elif hasattr(lead, k) and v is not None:
                setattr(lead, k, v)

        lead.updated_at = datetime.now(timezone.utc)
        self._leads[lead_id] = lead
        event_bus.publish("LEAD_UPDATED", {"lead_id": str(lead_id)})
        return lead

    def list_leads(self, tenant_id: TenantId) -> list[Lead]:
        return [l for l in self._leads.values() if l.tenant_id == tenant_id]

    def get_next_best_actions(self, lead: Lead, context: dict[str, Any] | None = None) -> list[NextBestAction]:
        return self._nba_service.recommend(lead, context)


# Singleton instance
lead_service = LeadService()
