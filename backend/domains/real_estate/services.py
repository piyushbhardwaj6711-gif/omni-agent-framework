"""Domain services — property matching, lead scoring, and next-best-action."""

from __future__ import annotations

from typing import Any, Optional

from core.types import LeadTemperature
from domains.real_estate.models import (
    ActionPriority,
    Lead,
    LeadScoreBreakdown,
    NextBestAction,
    Property,
)
from domains.real_estate.providers import ListingProvider, get_provider


# ---------------------------------------------------------------------------
# Property matching
# ---------------------------------------------------------------------------

class PropertyMatchingService:
    """Fetches live listings for any Indian city, then filters and ranks them."""

    def __init__(self, provider: ListingProvider | None = None) -> None:
        self._provider = provider or get_provider()

    def search(
        self,
        city: str,
        location: Optional[str] = None,
        bhk: Optional[int] = None,
        budget_min: Optional[float] = None,
        budget_max: Optional[float] = None,
        limit: int = 5,
    ) -> list[Property]:
        """Return up to *limit* properties in *city* matching the filters.

        city     - any city in India, e.g. "Jaipur", "Indore", "Surat".
        location - optional locality inside that city, e.g. "Vaishali Nagar".
        Budget values are in Lakhs, with a ±15 % tolerance.
        """
        properties = self._provider.fetch(
    city, bhk=bhk, budget_min=budget_min, budget_max=budget_max
)
        candidates: list[tuple[float, Property]] = []

        for prop in properties:
            if prop.status.value != "AVAILABLE":
                continue

            score = 0.0

            # --- locality match (optional) ---
            if location:
                loc = location.lower().strip()
                area = (prop.address.area or "").lower()
                desc = prop.description.lower()

                if area and (loc in area or area in loc):
                    score += 40.0  # exact locality match
                elif loc in desc:
                    score += 30.0  # mentioned in description / proximity
                elif any(tok in area for tok in loc.split()):
                    score += 20.0  # partial token match
                else:
                    continue  # locality given but doesn't match

            # --- BHK match ---
            if bhk is not None:
                if prop.bhk == bhk:
                    score += 30.0
                else:
                    continue  # strict BHK filter

            # --- budget match (±15 %) ---
            if budget_min is not None or budget_max is not None:
                effective_min = (budget_min or 0) * 0.85
                effective_max = (budget_max or float("inf")) * 1.15
                if not (effective_min <= prop.price_lakhs <= effective_max):
                    continue
                # score by closeness to budget centre
                if budget_min and budget_max:
                    centre = (budget_min + budget_max) / 2
                else:
                    centre = budget_min or budget_max or prop.price_lakhs
                distance = abs(prop.price_lakhs - centre) / max(centre, 1)  # type: ignore[operator]
                score += max(0, 30 - distance * 50)

            candidates.append((score, prop))

        # Sort descending by match score
        candidates.sort(key=lambda pair: pair[0], reverse=True)
        return [prop for _, prop in candidates[:limit]]


# ---------------------------------------------------------------------------
# Lead scoring
# ---------------------------------------------------------------------------

class LeadScoringService:
    """Scores a lead on a 0-100 scale using weighted factors."""

    _WEIGHTS = {
        "budget_fit": 0.25,
        "location_match": 0.20,
        "urgency": 0.20,
        "engagement": 0.15,
        "financing_readiness": 0.20,
    }

    def score_lead(
        self,
        customer_profile: dict[str, Any],
        interaction_data: dict[str, Any],
    ) -> LeadScoreBreakdown:
        """Evaluate and return a detailed score breakdown."""

        # --- budget fit ---
        budget_fit = 0.0
        if customer_profile.get("budget_min") or customer_profile.get("budget_max"):
            budget_fit = 70.0  # has a budget range
            bmin = customer_profile.get("budget_min", 0)
            bmax = customer_profile.get("budget_max", 0)
            if bmin and bmax and 10 <= bmin <= 5000 and 10 <= bmax <= 5000:
                budget_fit = 90.0  # realistic range for Indian cities

        # --- location match ---
        location_match = 0.0
        preferred = customer_profile.get("preferred_locations", [])
        if preferred:
            # Specific targeted micro-market preference indicates high intent
            location_match = 85.0 if len(preferred) <= 2 else 95.0

        # --- urgency ---
        urgency = 0.0
        raw_text = interaction_data.get("raw_text", "").lower()
        urgency_words = ["jaldi", "urgent", "asap", "turant", "immediately", "this month", "jald", "chahiye", "lagega"]
        if any(w in raw_text for w in urgency_words):
            urgency = 85.0
        elif customer_profile.get("timeline"):
            urgency = 75.0
        else:
            urgency = 40.0

        # --- engagement ---
        interaction_count = interaction_data.get("interaction_count", 1)
        engagement = min(max(interaction_count * 30, 60), 100)

        # --- financing readiness ---
        financing_readiness = 0.0
        if customer_profile.get("financing"):
            financing_readiness = 80.0
        if "pre-approved" in raw_text or "pre approved" in raw_text:
            financing_readiness = 95.0

        # weighted overall
        overall = (
            budget_fit * self._WEIGHTS["budget_fit"]
            + location_match * self._WEIGHTS["location_match"]
            + urgency * self._WEIGHTS["urgency"]
            + engagement * self._WEIGHTS["engagement"]
            + financing_readiness * self._WEIGHTS["financing_readiness"]
        )

        return LeadScoreBreakdown(
            budget_fit=round(budget_fit, 1),
            location_match=round(location_match, 1),
            urgency=round(urgency, 1),
            engagement=round(engagement, 1),
            financing_readiness=round(financing_readiness, 1),
            overall=round(overall, 1),
        )

    @staticmethod
    def temperature_from_score(score: float) -> LeadTemperature:
        if score >= 75:
            return LeadTemperature.HOT
        if score >= 45:
            return LeadTemperature.WARM
        return LeadTemperature.COLD

    @staticmethod
    def conversion_probability(score: float) -> float:
        return min(round(score / 100 * 0.95, 3), 0.95)


# ---------------------------------------------------------------------------
# Next best action
# ---------------------------------------------------------------------------

class NextBestActionService:
    """Rule-based recommendation engine for salesperson actions."""

    def recommend(
        self,
        lead: Lead,
        context: dict[str, Any] | None = None,
    ) -> list[NextBestAction]:
        actions: list[NextBestAction] = []
        ctx = context or {}
        has_site_visit = ctx.get("has_site_visit", False)

        if lead.temperature == LeadTemperature.HOT:
            if not has_site_visit:
                actions.append(
                    NextBestAction(
                        action="Call within 10 minutes and confirm site visit",
                        priority=ActionPriority.HIGH,
                        reason="Hot lead without site visit — highest conversion window.",
                        deadline="10 minutes",
                    )
                )
            else:
                actions.append(
                    NextBestAction(
                        action="Send property brochure and price comparison",
                        priority=ActionPriority.HIGH,
                        reason="Site visit scheduled — reinforce with collateral.",
                    )
                )

        if lead.temperature == LeadTemperature.WARM:
            if lead.financing_needed:
                actions.append(
                    NextBestAction(
                        action="Connect with home loan partner for pre-approval",
                        priority=ActionPriority.MEDIUM,
                        reason="Warm lead needs financing — remove friction.",
                    )
                )
            actions.append(
                NextBestAction(
                    action="Send curated property shortlist via WhatsApp",
                    priority=ActionPriority.MEDIUM,
                    reason="Keep warm lead engaged with personalised options.",
                )
            )

        if lead.temperature == LeadTemperature.COLD:
            actions.append(
                NextBestAction(
                    action="Add to drip marketing campaign",
                    priority=ActionPriority.LOW,
                    reason="Cold lead — nurture over time.",
                )
            )

        # always-on action
        actions.append(
            NextBestAction(
                action="Update CRM with latest interaction notes",
                priority=ActionPriority.MEDIUM,
                reason="Maintain data hygiene for analytics and handoff.",
            )
        )

        return actions