"""Mock AI provider — regex / keyword-based intent extraction for V0 demo."""

from __future__ import annotations

import re
from typing import Any

from ai.provider import ai_provider_registry


class MockAIProvider:
    """Extracts structured intent from Hinglish / English real-estate queries
    using pattern matching.  Good enough for a convincing demo without any
    external LLM dependency.
    """

    # --------------------------------------------------------------------- #
    # Location patterns                                                      #
    # --------------------------------------------------------------------- #

    _LOCATIONS: list[str] = [
        "Baner", "Wakad", "Hinjewadi", "Kharadi", "Viman Nagar",
        "Aundh", "Hadapsar", "Magarpatta", "Koregaon Park",
        "Pimple Saudagar", "Mahalunge", "Keshav Nagar", "Kondhwa",
    ]

    _LOCATION_RE = re.compile(
        "|".join(re.escape(loc) for loc in _LOCATIONS),
        re.IGNORECASE,
    )

    # --------------------------------------------------------------------- #
    # BHK patterns — English + Hinglish                                      #
    # --------------------------------------------------------------------- #

    _BHK_MAP: dict[str, int] = {
        "ek": 1, "one": 1, "1": 1,
        "do": 2, "two": 2, "2": 2,
        "teen": 3, "three": 3, "3": 3,
        "chaar": 4, "four": 4, "4": 4,
    }

    _BHK_RE = re.compile(
        r"(?:("
        + "|".join(_BHK_MAP.keys())
        + r")\s*bhk)",
        re.IGNORECASE,
    )

    # --------------------------------------------------------------------- #
    # Budget patterns                                                        #
    # --------------------------------------------------------------------- #

    _BUDGET_RE = re.compile(
        r"(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l\b)",
        re.IGNORECASE,
    )
    _BUDGET_CR_RE = re.compile(
        r"(\d+(?:\.\d+)?)\s*(?:crores?|cr\b)",
        re.IGNORECASE,
    )

    # --------------------------------------------------------------------- #
    # Financing signals                                                      #
    # --------------------------------------------------------------------- #

    _FINANCE_KEYWORDS = re.compile(
        r"\b(loan|emi|finance|home\s*loan|homeloan)\b",
        re.IGNORECASE,
    )

    # --------------------------------------------------------------------- #
    # Intent type signals                                                    #
    # --------------------------------------------------------------------- #

    _SITE_VISIT_KEYWORDS = re.compile(
        r"\b(visit|site\s*visit|dekhna|dekho|book\s*karo|schedule|appointment)\b",
        re.IGNORECASE,
    )

    _EMI_KEYWORDS = re.compile(
        r"\b(emi|loan|finance|afford|home\s*loan|installment|kist)\b",
        re.IGNORECASE,
    )

    _SEARCH_KEYWORDS = re.compile(
        r"\b(property|flat|apartment|ghar|chahiye|chahie|dikhao|khareedna|kharidna|dhundh|search|buy|purchase|dekhna|options|available)\b",
        re.IGNORECASE,
    )

    # ===================================================================== #
    # Public API                                                             #
    # ===================================================================== #

    def extract_intent(self, text: str, context: dict[str, Any]) -> dict[str, Any]:
        """Parse *text* and return a structured intent dictionary."""

        # --- location ---
        loc_match = self._LOCATION_RE.search(text)
        location: str | None = loc_match.group(0).title() if loc_match else None

        # --- BHK ---
        bhk: int | None = None
        bhk_match = self._BHK_RE.search(text)
        if bhk_match:
            raw = bhk_match.group(1).lower()
            bhk = self._BHK_MAP.get(raw)

        # --- budget (lakhs) ---
        budget_lakhs: float | None = None
        cr_match = self._BUDGET_CR_RE.search(text)
        lk_match = self._BUDGET_RE.search(text)
        if cr_match:
            budget_lakhs = float(cr_match.group(1)) * 100
        elif lk_match:
            budget_lakhs = float(lk_match.group(1))

        # --- financing ---
        financing: bool = bool(self._FINANCE_KEYWORDS.search(text))

        # --- intent type ---
        if self._SITE_VISIT_KEYWORDS.search(text) and not self._EMI_KEYWORDS.search(text):
            intent_type = "SITE_VISIT"
        elif self._EMI_KEYWORDS.search(text) and not self._SEARCH_KEYWORDS.search(text):
            intent_type = "EMI_INQUIRY"
        elif self._SEARCH_KEYWORDS.search(text) or location or bhk or budget_lakhs:
            intent_type = "PROPERTY_SEARCH"
        else:
            intent_type = "GENERAL"

        return {
            "intent_type": intent_type,
            "location": location,
            "bhk": bhk,
            "budget_lakhs": budget_lakhs,
            "financing": financing,
            "raw_text": text,
        }

    def generate_response(self, prompt: str, context: dict[str, Any]) -> str:
        """Template-based response generation (not heavily used in V0)."""
        return (
            "Main aapki madad karne ke liye taiyaar hoon! "
            "Kya aap mujhe apni requirements bata sakte hain — location, budget, BHK?"
        )

    def embed_text(self, text: str) -> list[float]:
        """Return a dummy 128-d embedding vector (placeholder for V0)."""
        import hashlib

        digest = hashlib.sha256(text.encode()).digest()
        return [b / 255.0 for b in digest[:128]]  # deterministic, 128 dims


# ---------------------------------------------------------------------------
# Auto-register on import
# ---------------------------------------------------------------------------

_mock_provider = MockAIProvider()
ai_provider_registry.register("mock", _mock_provider)
