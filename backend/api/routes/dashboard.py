"""Endpoints for the Salesperson Intelligence Dashboard."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends

from api.middleware import get_tenant_context
from application.lead_service import lead_service
from core.observability import activity_logger
from core.types import LeadTemperature, TenantContext
from domains.real_estate.mock_data import DEMO_SALESPERSON

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", summary="Get aggregated intelligence for salesperson dashboard")
def get_dashboard(
    tenant_ctx: TenantContext = Depends(get_tenant_context),
) -> dict[str, Any]:
    leads = lead_service.list_leads(tenant_ctx.tenant_id)

    # Segregate temperatures
    hot_leads = [l for l in leads if l.temperature == LeadTemperature.HOT]
    warm_leads = [l for l in leads if l.temperature == LeadTemperature.WARM]
    cold_leads = [l for l in leads if l.temperature == LeadTemperature.COLD]

    # Sort leads by score descending
    sorted_leads = sorted(leads, key=lambda l: l.score, reverse=True)

    # Collect next best actions across top leads
    next_actions: list[dict[str, Any]] = []
    for lead in sorted_leads[:5]:
        nbas = lead_service.get_next_best_actions(lead)
        for nba in nbas:
            next_actions.append(
                {
                    "lead_id": str(lead.id),
                    "customer_name": lead.customer_name,
                    "action": nba.action,
                    "priority": nba.priority.value,
                    "reason": nba.reason,
                    "deadline": nba.deadline,
                }
            )

    # Recent activities from audit logger
    activities = activity_logger.get_recent(tenant_ctx.tenant_id, limit=15)

    # Compute key performance metrics
    avg_score = round(sum(l.score for l in leads) / len(leads), 1) if leads else 0
    avg_conv_prob = (
        round(sum(l.conversion_probability for l in leads) / len(leads) * 100, 1)
        if leads
        else 0
    )

    return {
        "salesperson": DEMO_SALESPERSON,
        "total_leads": len(leads),
        "hot_leads": len(hot_leads),
        "warm_leads": len(warm_leads),
        "cold_leads": len(cold_leads),
        "top_leads": [l.model_dump(mode="json") for l in sorted_leads],
        "next_actions": next_actions[:6],
        "recent_activities": [
            {
                "id": a.id,
                "actor": a.actor,
                "action": a.action,
                "timestamp": a.timestamp.isoformat(),
                "details": a.details,
                "duration_ms": a.duration_ms,
            }
            for a in activities
        ],
        "metrics": {
            "avg_lead_score": avg_score,
            "avg_conversion_probability": f"{avg_conv_prob}%",
            "pipeline_value_cr": "₹6.8 Cr",
            "active_site_visits": 3,
        },
        "mode": "SIMULATED",
    }
