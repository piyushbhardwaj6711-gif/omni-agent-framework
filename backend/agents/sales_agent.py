"""Sales Agent — conversational real-estate sales specialist for EstateIQ V0."""

from __future__ import annotations

from typing import Any, Optional

from agents.base import (
    AgentCapability,
    AgentConfig,
    AgentContext,
    AgentResponse,
    BaseAgent,
    agent_registry,
)
from agents.tools import tool_registry
from ai.provider import ai_provider_registry
from core.types import AgentId, LeadStatus, LeadTemperature
from domains.real_estate.calculators import calculate_emi, format_inr, format_lakhs


class SalesAgent(BaseAgent):
    """Conversational sales agent capable of understanding property requirements,
    searching inventory, estimating EMI, scoring leads, and booking site visits.
    """

    def __init__(self, agent_id: str = "agent-sales-001") -> None:
        self._config = AgentConfig(
            id=AgentId(agent_id),
            name="EstateIQ Sales Agent",
            description="Autonomous sales agent specializing in Indian real estate discovery, qualification, and booking.",
            capabilities=[
                AgentCapability.PROPERTY_SEARCH,
                AgentCapability.LEAD_QUALIFICATION,
                AgentCapability.EMI_CALCULATION,
                AgentCapability.SITE_VISIT_BOOKING,
            ],
            instructions=(
                "You are an expert, courteous Indian real-estate broker assistant. "
                "You understand English, Hindi, and code-mixed Hinglish. "
                "Always ground prices, BHK, and location in actual inventory. Never invent properties."
            ),
        )

    @property
    def config(self) -> AgentConfig:
        return self._config

    def process_message(self, message: str, context: AgentContext) -> AgentResponse:
        """Process incoming user message and generate a grounded, actionable response."""
        ai_provider = ai_provider_registry.get("mock")
        nlu = ai_provider.extract_intent(message, context.customer_profile)

        # Merge NLU with existing context profile if previously discovered
        profile = dict(context.customer_profile)
        if nlu.get("location"):
            profile["preferred_locations"] = [nlu["location"]]
        if nlu.get("bhk"):
            profile["bhk"] = nlu["bhk"]
        if nlu.get("budget_lakhs"):
            profile["budget_max"] = nlu["budget_lakhs"]
            profile["budget_min"] = nlu["budget_lakhs"] * 0.85
        if nlu.get("financing"):
            profile["financing"] = True

        intent_type = nlu.get("intent_type", "GENERAL")
        actions_taken: list[str] = []
        matched_properties: list[dict[str, Any]] = []
        lead_update: Optional[dict[str, Any]] = None
        suggestions: list[str] = []
        metadata: dict[str, Any] = {
            "nlu": nlu,
            "simulated": True,
        }

        # -----------------------------------------------------------------
        # Flow 1: SITE VISIT BOOKING
        # -----------------------------------------------------------------
        if intent_type == "SITE_VISIT":
            booker_tool = tool_registry.get("site_visit_booker")
            tool_ctx = {
                "matched_properties": context.business_context.get("last_matched_properties", []),
            }
            res = booker_tool.execute(
                {
                    "lead_id": context.customer_profile.get("lead_id", "demo-lead-hero"),
                    "date": "2026-11-14",  # upcoming Saturday
                    "time": "11:30 AM",
                    "notes": "Customer requested site visit via conversation.",
                },
                tool_ctx,
            )
            actions_taken.append("booked_site_visit")
            visit_data = res.data.get("site_visit", {})
            metadata["site_visit"] = visit_data

            lead_update = {
                "status": LeadStatus.QUALIFIED,
                "notes_append": "Site visit scheduled for Saturday 11:30 AM.",
                "has_site_visit": True,
            }

            reply = (
                "🎉 **Shandaar! Site Visit Confirm Ho Gayi Hai!**\n\n"
                "Aapki site visit **is Shanivar (Saturday) subah 11:30 AM** ke liye book kar di gayi hai.\n\n"
                "📍 **Location:** VTP Blue Waters / Kumar Megapolis Experience Center\n"
                "👤 **Assigned Executive:** Rahul Sharma (+91-9876543210)\n\n"
                "Hamare executive aapko 1 ghante pehle call karke direction aur gate pass share karenge. "
                "Kya aapko koi specific payment plan ya loan documentation ki details chahiye?"
            )
            suggestions = [
                "EMI calculator details dikhao",
                "Project brochure WhatsApp par bhejo",
                "RERA registration details verify karo",
            ]

        # -----------------------------------------------------------------
        # Flow 2: PROPERTY SEARCH (Hero demo scenario)
        # -----------------------------------------------------------------
        elif intent_type == "PROPERTY_SEARCH":
            search_tool = tool_registry.get("property_search")
            loc = profile.get("preferred_locations", [None])[0]
            bhk = profile.get("bhk")
            b_max = profile.get("budget_max")
            b_min = profile.get("budget_min")

            # Execute search
            search_res = search_tool.execute(
                {
                    "location": loc,
                    "bhk": bhk,
                    "budget_min": b_min,
                    "budget_max": b_max,
                    "limit": 3,
                },
                {},
            )
            matched_properties = search_res.data.get("properties", [])
            actions_taken.append(f"searched_properties_found_{len(matched_properties)}")

            # If no direct match in location, fallback to nearby Pune corridor
            if not matched_properties and loc:
                search_res = search_tool.execute(
                    {"location": None, "bhk": bhk, "budget_max": b_max, "limit": 3},
                    {},
                )
                matched_properties = search_res.data.get("properties", [])

            # Compute EMI for the top match
            top_emi_info = None
            if matched_properties:
                top_prop = matched_properties[0]
                price = top_prop["price_lakhs"]
                # Assume 80% loan
                loan_lakhs = price * 0.80
                emi_res = calculate_emi(principal_lakhs=loan_lakhs, annual_rate=8.5, tenure_years=20)
                top_emi_info = emi_res
                metadata["emi_estimate"] = emi_res
                actions_taken.append("calculated_emi_estimate")

            # Score lead
            scorer_tool = tool_registry.get("lead_scorer")
            score_res = scorer_tool.execute(
                {
                    "customer_profile": {
                        "budget_min": b_min or 70.0,
                        "budget_max": b_max or 95.0,
                        "preferred_locations": profile.get("preferred_locations", ["Baner"]),
                        "financing": profile.get("financing", True),
                        "bhk": bhk or 3,
                        "timeline": "Immediate (Festive Season)",
                    },
                    "interaction_data": {
                        "raw_text": message,
                        "interaction_count": 2,
                    },
                },
                {},
            )
            score_data = score_res.data
            metadata["score_data"] = score_data
            actions_taken.append("evaluated_lead_score")

            # Formulate structured lead update
            lead_update = {
                "customer_name": profile.get("name", "Gaurav Kulkarni"),
                "phone": profile.get("phone", "+91-9823012345"),
                "bhk_preference": bhk or 3,
                "preferred_locations": profile.get("preferred_locations", ["Baner"]),
                "budget_min": b_min or 75.0,
                "budget_max": b_max or 92.0,
                "financing_needed": profile.get("financing", True),
                "score": int(score_data.get("score_breakdown", {}).get("overall", 87)),
                "temperature": score_data.get("temperature", LeadTemperature.HOT.value),
                "conversion_probability": score_data.get("conversion_probability", 0.83),
                "status": LeadStatus.QUALIFIED,
            }

            # Build rich Hinglish response
            loc_label = loc or "Pune"
            bhk_label = f"{bhk} BHK" if bhk else "premium"
            budget_label = format_lakhs(b_max) if b_max else "aapke budget"

            reply_lines = [
                f"Namaste! Maine **{loc_label}** corridor mein aapke liye **{len(matched_properties)} verified {bhk_label} options** shortlist kiye hain (budget: ~{budget_label}):\n",
            ]

            for i, p in enumerate(matched_properties, 1):
                p_emi = calculate_emi(p["price_lakhs"] * 0.8, 8.5, 20)
                monthly_emi_str = format_inr(p_emi["emi_monthly"])
                price_str = format_lakhs(p["price_lakhs"])
                area_str = f"{p['area_sqft']} sq.ft"

                reply_lines.append(
                    f"**{i}. {p['name']}** — {p['developer']}\n"
                    f"• **Location:** {p['address']['area']}, {p['address']['city']}\n"
                    f"• **Price:** {price_str} ({area_str} | ₹{int(p['price_per_sqft']):,}/sq.ft)\n"
                    f"• **Est. EMI:** {monthly_emi_str}/mo *(8.5% interest, 20-yr tenure)*\n"
                    f"• **RERA Verified:** `{p['rera_id']}`\n"
                    f"• **Key Highlights:** {', '.join(p['amenities'][:4])}\n"
                )

            reply_lines.append(
                "💡 **Agent Recommendation:** Yeh saare projects RERA-approved hain aur direct bank tie-ups ke sath aate hain (SBI, HDFC). "
                "Kya main is **Shanivar (Saturday)** ke liye aapka site visit schedule kar doon?"
            )

            reply = "\n".join(reply_lines)
            suggestions = [
                "Saturday 11:30 AM visit book karo",
                "Detailed EMI breakup dikhao",
                "Kharadi ya Wakad mein bhi dikhao",
                "Sales representative se baat karni hai",
            ]

        # -----------------------------------------------------------------
        # Flow 3: EMI INQUIRY
        # -----------------------------------------------------------------
        elif intent_type == "EMI_INQUIRY":
            budget = profile.get("budget_max", 90.0)
            emi_info = calculate_emi(principal_lakhs=budget * 0.8, annual_rate=8.5, tenure_years=20)
            actions_taken.append("calculated_detailed_emi")
            metadata["emi_breakdown"] = emi_info

            emi_str = format_inr(emi_info["emi_monthly"])
            principal_str = format_inr(emi_info["principal"])
            interest_str = format_inr(emi_info["total_interest"])
            total_str = format_inr(emi_info["total_payment"])

            reply = (
                f"📊 **Home Loan & EMI Calculation (₹{budget} Lakh Property):**\n\n"
                f"• **Down Payment (20%):** {format_inr(budget * 20_000)}\n"
                f"• **Loan Amount (80%):** {principal_str}\n"
                f"• **Interest Rate:** 8.5% p.a. (SBI / HDFC benchmark)\n"
                f"• **Tenure:** 20 Years (240 months)\n\n"
                f"💰 **Monthly EMI:** **{emi_str} / month**\n"
                f"• Total Interest: {interest_str}\n"
                f"• Total Repayment: {total_str}\n\n"
                "Hamare banking partners se instant pre-approval mil sakta hai. Kya aap loan eligibility check karwana chahte hain?"
            )
            suggestions = [
                "Saturday site visit book karo",
                "Stamp duty kitni hogi?",
                "3BHK properties dikhao",
            ]

        # -----------------------------------------------------------------
        # Flow 4: GENERAL ASSISTANCE
        # -----------------------------------------------------------------
        else:
            reply = (
                "Namaste! 🙏 Main EstateIQ ka AI Sales Assistant hoon.\n\n"
                "Aap Pune ke prime locations (Baner, Wakad, Hinjewadi, Kharadi, Viman Nagar) mein "
                "apne budget aur requirement ke mutabiq RERA-verified properties search kar sakte hain.\n\n"
                "Bataiye, aap kis area mein property dekh rahe hain aur aapka preferred budget kya hai?"
            )
            suggestions = [
                "Baner mein 3BHK chahiye budget 90 lakh tak",
                "Hinjewadi mein 2BHK options dikhao",
                "Kharadi mein investment properties",
            ]

        return AgentResponse(
            message=reply,
            properties=matched_properties,
            lead_update=lead_update,
            actions_taken=actions_taken,
            suggestions=suggestions,
            metadata=metadata,
        )


# Register sales agent instance
sales_agent = SalesAgent()
agent_registry.register(sales_agent)
