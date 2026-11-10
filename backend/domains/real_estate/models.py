"""Pydantic v2 models for the real-estate domain."""

from __future__ import annotations

import enum
from datetime import date, datetime, timezone
from typing import Any, Optional

from pydantic import BaseModel, Field

from core.types import (
    ConversationId,
    LeadId,
    LeadStatus,
    LeadTemperature,
    ProjectId,
    PropertyId,
    TenantId,
)


# ---------------------------------------------------------------------------
# Enums specific to this domain
# ---------------------------------------------------------------------------

class PropertyStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    SOLD = "SOLD"
    RESERVED = "RESERVED"


class SiteVisitStatus(str, enum.Enum):
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"


class MessageRole(str, enum.Enum):
    USER = "USER"
    AGENT = "AGENT"
    SYSTEM = "SYSTEM"


class ConversationStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"
    ARCHIVED = "ARCHIVED"


class ActionPriority(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


# ---------------------------------------------------------------------------
# Value objects / embeddable models
# ---------------------------------------------------------------------------

class Address(BaseModel):
    street: str = ""
    area: str
    city: str = "Pune"
    state: str = "Maharashtra"
    pincode: str = ""


class Message(BaseModel):
    id: str
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata: dict[str, Any] = Field(default_factory=dict)


class LeadScoreBreakdown(BaseModel):
    budget_fit: float = 0.0
    location_match: float = 0.0
    urgency: float = 0.0
    engagement: float = 0.0
    financing_readiness: float = 0.0
    overall: float = 0.0


class NextBestAction(BaseModel):
    action: str
    priority: ActionPriority
    reason: str
    deadline: Optional[str] = None


class CustomerProfile(BaseModel):
    name: str = ""
    phone: str = ""
    email: str = ""
    budget_range: Optional[dict[str, float]] = None
    preferred_locations: list[str] = Field(default_factory=list)
    bhk: Optional[int] = None
    financing: bool = False
    timeline: str = ""
    interaction_count: int = 0


# ---------------------------------------------------------------------------
# Aggregate / root models
# ---------------------------------------------------------------------------

class Property(BaseModel):
    id: PropertyId
    project_id: ProjectId
    name: str
    developer: str
    address: Address
    bhk: int
    area_sqft: int
    price_lakhs: float
    price_per_sqft: float
    floor: int
    total_floors: int
    amenities: list[str] = Field(default_factory=list)
    status: PropertyStatus = PropertyStatus.AVAILABLE
    rera_id: str = ""
    description: str = ""
    image_url: Optional[str] = None
    possession_date: Optional[date] = None


class Project(BaseModel):
    id: ProjectId
    name: str
    developer: str
    address: Address
    total_units: int
    available_units: int
    price_range_min: float
    price_range_max: float
    amenities: list[str] = Field(default_factory=list)
    rera_id: str = ""
    status: str = "Active"


class Lead(BaseModel):
    id: LeadId
    tenant_id: TenantId
    customer_name: str
    phone: str = ""
    email: Optional[str] = None
    source: str = "chat"
    status: LeadStatus = LeadStatus.NEW
    temperature: LeadTemperature = LeadTemperature.COLD
    requirements: dict[str, Any] = Field(default_factory=dict)
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    preferred_locations: list[str] = Field(default_factory=list)
    bhk_preference: Optional[int] = None
    financing_needed: bool = False
    score: int = 0
    conversion_probability: float = 0.0
    assigned_to: Optional[str] = None
    notes: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class SiteVisit(BaseModel):
    id: str
    lead_id: LeadId
    property_id: PropertyId
    scheduled_date: str
    scheduled_time: str = "11:00 AM"
    status: SiteVisitStatus = SiteVisitStatus.SCHEDULED
    notes: str = ""


class Conversation(BaseModel):
    id: ConversationId
    tenant_id: TenantId
    lead_id: Optional[LeadId] = None
    messages: list[Message] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: ConversationStatus = ConversationStatus.ACTIVE
