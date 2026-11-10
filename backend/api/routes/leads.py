"""Endpoints for lead intelligence and pipeline management."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from api.middleware import get_tenant_context
from application.lead_service import lead_service
from core.observability import ActivityLog, activity_logger
from core.types import LeadId, TenantContext
from domains.real_estate.models import Lead

router = APIRouter(prefix="/leads", tags=["leads"])


class ExecuteActionRequest(BaseModel):
    action: str
    notes: str = ""


@router.get("", summary="List all leads for tenant")
def list_leads(tenant_ctx: TenantContext = Depends(get_tenant_context)) -> list[dict[str, Any]]:
    leads = lead_service.list_leads(tenant_ctx.tenant_id)
    # Sort with hottest leads first
    leads.sort(key=lambda x: x.score, reverse=True)
    return [l.model_dump(mode="json") for l in leads]


@router.get("/{lead_id}", summary="Get lead intelligence details")
def get_lead(lead_id: str) -> dict[str, Any]:
    lead = lead_service.get_lead(LeadId(lead_id))
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    nbas = lead_service.get_next_best_actions(lead)
    return {
        "lead": lead.model_dump(mode="json"),
        "next_actions": [nba.model_dump(mode="json") for nba in nbas],
    }


@router.post("/{lead_id}/actions", summary="Execute action on lead")
def execute_lead_action(
    lead_id: str,
    payload: ExecuteActionRequest,
    tenant_ctx: TenantContext = Depends(get_tenant_context),
) -> dict[str, Any]:
    lead = lead_service.get_lead(LeadId(lead_id))
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    updated = lead_service.update_lead(
        LeadId(lead_id),
        {"notes_append": f"Action Executed: {payload.action}. Notes: {payload.notes}"},
    )

    activity_logger.log(
        ActivityLog(
            id=f"act-action-{lead_id[:4]}",
            tenant_id=tenant_ctx.tenant_id,
            actor="Salesperson (Rahul Sharma)",
            action=payload.action,
            details={"lead_id": lead_id, "notes": payload.notes},
        )
    )

    return {
        "success": True,
        "lead": updated.model_dump(mode="json") if updated else None,
        "message": f"Action '{payload.action}' executed successfully.",
    }
