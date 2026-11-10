"""Verification test suite for EstateIQ V0 Hero Buyer Journey.

Validates:
1. Hinglish NLU intent extraction
2. Property matching & EMI computation
3. Lead qualification, scoring & classification
4. Next-best-action generation
5. Site visit booking
6. Activity / audit logging
7. Multi-tenant dashboard aggregation
"""

import sys
from pathlib import Path

# Add backend root to sys.path
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from ai.provider import ai_provider_registry
import ai.mock_provider  # auto-registers mock provider
import agents.sales_agent  # auto-registers sales agent
from application.conversation_service import conversation_service
from application.lead_service import lead_service
from application.property_service import property_service
from core.observability import activity_logger
from core.types import LeadTemperature
from domains.real_estate.calculators import calculate_emi, format_inr, format_lakhs
from domains.real_estate.mock_data import DEMO_TENANT_ID


def test_nlu_extraction():
    print("\n--- Test 1: NLU Intent Extraction (Hinglish) ---")
    mock_ai = ai_provider_registry.get("mock")
    text = "Baner mein 3BHK chahiye, budget 90 lakh tak hai, loan lagega."
    intent = mock_ai.extract_intent(text, {})

    print(f"Extracted: {intent}")
    assert intent["intent_type"] == "PROPERTY_SEARCH"
    assert intent["location"] == "Baner"
    assert intent["bhk"] == 3
    assert intent["budget_lakhs"] == 90.0
    assert intent["financing"] is True
    print("[PASS] NLU extraction verified successfully!")


def test_property_search_and_emi():
    print("\n--- Test 2: Property Matching & EMI Calculation ---")
    matches = property_service.search_properties(
        location="Baner",
        bhk=3,
        budget_min=75.0,
        budget_max=95.0,
        limit=3,
    )
    print(f"Found {len(matches)} matching properties:")
    for p in matches:
        print(f" - {p.name} ({p.developer}) @ {format_lakhs(p.price_lakhs)} in {p.address.area}")

    assert len(matches) > 0, "Expected at least 1 property match in Baner corridor"

    # Test EMI on top match
    top_prop = matches[0]
    loan_amount = top_prop.price_lakhs * 0.8
    emi = calculate_emi(principal_lakhs=loan_amount, annual_rate=8.5, tenure_years=20)
    print(f"Monthly EMI on {format_lakhs(top_prop.price_lakhs)} (80% loan = {format_lakhs(loan_amount)}): {format_inr(emi['emi_monthly'])}/mo")
    assert emi["emi_monthly"] > 0
    print("[PASS] Property matching and EMI calculations verified!")


def test_end_to_end_conversation_flow():
    print("\n--- Test 3: End-to-End Buyer Journey ---")
    # Step A: Start conversation
    conv = conversation_service.start_conversation(DEMO_TENANT_ID)
    print(f"Started Conversation: {conv.id}")
    assert len(conv.messages) == 1
    assert "Namaste" in conv.messages[0].content

    # Step B: Buyer sends hero query
    hero_msg = "Baner mein 3BHK chahiye, budget 90 lakh tak hai, loan lagega."
    res1 = conversation_service.process_message(conv.id, hero_msg)
    agent_resp1 = res1["agent_response"]
    lead1 = res1["lead"]

    print("\nAgent Response 1:")
    print(agent_resp1["message"])
    print(f"Actions taken: {agent_resp1['actions_taken']}")

    assert len(agent_resp1["properties"]) > 0
    assert lead1 is not None
    assert lead1["temperature"] == LeadTemperature.HOT.value
    assert lead1["score"] >= 75
    print(f"[PASS] Lead Created: {lead1['customer_name']} | Score: {lead1['score']}/100 | Temp: {lead1['temperature']}")

    # Step C: Buyer books site visit
    booking_msg = "Saturday visit book karo"
    res2 = conversation_service.process_message(conv.id, booking_msg)
    agent_resp2 = res2["agent_response"]

    print("\nAgent Response 2 (Booking):")
    print(agent_resp2["message"])
    assert "booked_site_visit" in agent_resp2["actions_taken"]
    assert "Site Visit Confirm" in agent_resp2["message"]
    print("[PASS] Site visit booked and confirmed!")


def test_salesperson_intelligence_dashboard():
    print("\n--- Test 4: Salesperson Intelligence Dashboard ---")
    leads = lead_service.list_leads(DEMO_TENANT_ID)
    print(f"Total Leads for Tenant: {len(leads)}")
    hot_leads = [l for l in leads if l.temperature == LeadTemperature.HOT]
    print(f"Hot Leads Count: {len(hot_leads)}")
    assert len(hot_leads) >= 1

    # Check Next-Best-Action for the top lead
    top_lead = max(leads, key=lambda l: l.score)
    nbas = lead_service.get_next_best_actions(top_lead)
    print(f"\nTop Lead: {top_lead.customer_name} (Score: {top_lead.score})")
    print("Recommended Next-Best-Actions:")
    for a in nbas:
        print(f" - [{a.priority.value}] {a.action} (Reason: {a.reason})")

    assert len(nbas) > 0
    print("[PASS] Lead intelligence and NBA rules verified!")


def test_audit_observability():
    print("\n--- Test 5: Audit & Observability ---")
    recent_logs = activity_logger.get_recent(DEMO_TENANT_ID, limit=10)
    print(f"Recent Audit Logs ({len(recent_logs)}):")
    for log in recent_logs[:5]:
        print(f" - [{log.actor}] {log.action}: {log.details}")

    assert len(recent_logs) >= 3
    print("[PASS] Activity logging verified!")


if __name__ == "__main__":
    print("==================================================")
    print(" RUNNING ESTATEIQ V0 VERIFICATION TEST SUITE")
    print("==================================================")
    test_nlu_extraction()
    test_property_search_and_emi()
    test_end_to_end_conversation_flow()
    test_salesperson_intelligence_dashboard()
    test_audit_observability()
    print("\n==================================================")
    print(" ALL ESTATEIQ V0 TESTS PASSED WITH 100% SUCCESS! ")
    print("==================================================")
