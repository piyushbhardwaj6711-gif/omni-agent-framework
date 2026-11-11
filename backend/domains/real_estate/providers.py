"""Listing providers — live India-wide data (99acres via Apify) with a mock fallback."""

from __future__ import annotations

import os
import time
from typing import Any, Optional, Protocol

import httpx
from dotenv import load_dotenv

from domains.real_estate.mock_data import get_all_properties
from domains.real_estate.models import Property

# ADJUST: if these names differ in your models.py, change them here.
from domains.real_estate.models import Address, PropertyStatus

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN", "")
APIFY_ACTOR = os.getenv("APIFY_ACTOR", "memo23~99acres-property-scraper")
CACHE_TTL_SECONDS = 60 * 60  # results are paid per row; cache for 1 hour
LAKH = 100_000


class ListingProvider(Protocol):
    def fetch(
        self,
        city: str,
        bhk: Optional[int] = None,
        budget_min: Optional[float] = None,
        budget_max: Optional[float] = None,
        max_results: int = 50,
    ) -> list[Property]: ...


class MockProvider:
    """Offline fallback — only returns what is in mock_data."""

    def fetch(
        self,
        city: str,
        bhk: Optional[int] = None,
        budget_min: Optional[float] = None,
        budget_max: Optional[float] = None,
        max_results: int = 50,
    ) -> list[Property]:
        c = city.strip().lower()
        return [
            p for p in get_all_properties()
            if c in (getattr(p.address, "city", "") or "").lower()
        ][:max_results]


class ApifyProvider:
    """Live 99acres listings for any Indian city via the memo23 Apify actor."""

    def __init__(self) -> None:
        self._cache: dict[str, tuple[float, list[Property]]] = {}

    def fetch(
        self,
        city: str,
        bhk: Optional[int] = None,
        budget_min: Optional[float] = None,
        budget_max: Optional[float] = None,
        max_results: int = 50,
    ) -> list[Property]:
        if not APIFY_TOKEN:
            raise RuntimeError("APIFY_TOKEN is not set")

        key = f"{city.strip().lower()}|{bhk}|{budget_min}|{budget_max}|{max_results}"
        hit = self._cache.get(key)
        if hit and time.time() - hit[0] < CACHE_TTL_SECONDS:
            return hit[1]

        # Input names come from the actor's Input tab.
        payload: dict[str, Any] = {
            "city": city.strip().title(),
            "searchMode": "buy",
            "saleType": "resale",
            "includeProjects": False,
            "scrapeDetails": False,
            "maxItems": max_results,
            "maxItemsPerSearch": max_results,
        }
        if bhk is not None:
            payload["bedrooms"] = [bhk]
        # Our budget is in Lakhs; the actor wants rupees. Widen by the same ±15 %.
        if budget_min is not None:
            payload["minPrice"] = int(budget_min * 0.85 * LAKH)
        if budget_max is not None:
            payload["maxPrice"] = int(budget_max * 1.15 * LAKH)

        url = f"https://api.apify.com/v2/acts/{APIFY_ACTOR}/run-sync-get-dataset-items"
        resp = httpx.post(url, params={"token": APIFY_TOKEN}, json=payload, timeout=300)
        resp.raise_for_status()

        props = [p for item in resp.json() if (p := self._to_property(item, city))]
        self._cache[key] = (time.time(), props)
        return props

    @staticmethod
    def _to_property(item: dict[str, Any], city: str) -> Optional[Property]:
        """Map one raw 99acres row to the Property model.

        Raw keys seen in the actor's sample output: resultType, bhk, price,
        area, areaType, locality, projectName, furnishing, facing, amenities,
        latitude, listedBy, dealerName, images.
        """
        if item.get("resultType") == "project":
            return None

        price = item.get("price")
        if not isinstance(price, (int, float)) or price <= 0:
            return None  # skip rows without a clean numeric price

        locality = item.get("locality") or ""
        project = item.get("projectName") or "Property"
        bhk = int(item.get("bhk") or 0)
        amenities = ", ".join(item.get("amenities") or [])
        description = " | ".join(
            part for part in (
                project,
                locality,
                item.get("furnishing"),
                f"Facing {item['facing']}" if item.get("facing") else None,
                amenities,
            ) if part
        )

        # ADJUST: match these arguments to the real fields in models.py.
        return Property(
            title=f"{bhk} BHK in {project}" if bhk else project,
            bhk=bhk,
            price_lakhs=round(price / LAKH, 2),
            description=description,
            address=Address(area=locality, city=city.strip().title()),
            status=PropertyStatus.AVAILABLE,
        )


def get_provider() -> ListingProvider:
    return ApifyProvider() if APIFY_TOKEN else MockProvider()