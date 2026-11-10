"""Realistic Pune, India mock property data for the V0 demo."""

from __future__ import annotations

from datetime import date

from core.types import ProjectId, PropertyId, TenantId, UserId
from domains.real_estate.models import Address, Project, Property, PropertyStatus

# ---------------------------------------------------------------------------
# Demo tenant & user
# ---------------------------------------------------------------------------

DEMO_TENANT_ID: TenantId = TenantId("demo-tenant-001")

DEMO_SALESPERSON: dict[str, str] = {
    "id": "user-rahul-001",
    "name": "Rahul Sharma",
    "role": "Senior Sales Executive",
    "phone": "+91-9876543210",
    "email": "rahul.sharma@estateiq.in",
}


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------

_PROJECTS: list[Project] = [
    Project(
        id=ProjectId("proj-kumar-mega"),
        name="Kumar Megapolis",
        developer="Kumar Properties",
        address=Address(area="Hinjewadi Phase 3", pincode="411057"),
        total_units=450,
        available_units=82,
        price_range_min=55.0,
        price_range_max=95.0,
        amenities=[
            "Clubhouse", "Swimming Pool", "Gym", "Children's Play Area",
            "24x7 Security", "Power Backup", "Covered Parking",
            "Landscaped Gardens", "Jogging Track", "Indoor Games",
        ],
        rera_id="P52100028745",
    ),
    Project(
        id=ProjectId("proj-godrej-inf"),
        name="Godrej Infinity",
        developer="Godrej Properties",
        address=Address(area="Keshav Nagar", pincode="411014"),
        total_units=320,
        available_units=45,
        price_range_min=70.0,
        price_range_max=115.0,
        amenities=[
            "Clubhouse", "Swimming Pool", "Gym", "Children's Play Area",
            "24x7 Security", "Power Backup", "Covered Parking",
            "Landscaped Gardens", "Jogging Track", "Indoor Games",
        ],
        rera_id="P52100025012",
    ),
    Project(
        id=ProjectId("proj-vtp-blue"),
        name="VTP Blue Waters",
        developer="VTP Realty",
        address=Address(area="Baner-Mahalunge Corridor", pincode="411045"),
        total_units=280,
        available_units=64,
        price_range_min=60.0,
        price_range_max=98.0,
        amenities=[
            "Clubhouse", "Swimming Pool", "Gym", "Children's Play Area",
            "24x7 Security", "Power Backup", "Covered Parking",
            "Landscaped Gardens", "Jogging Track", "Indoor Games",
        ],
        rera_id="P52100031890",
    ),
    Project(
        id=ProjectId("proj-kolte-life"),
        name="Kolte Patil Life Republic",
        developer="Kolte Patil Developers",
        address=Address(area="Hinjewadi", pincode="411057"),
        total_units=600,
        available_units=135,
        price_range_min=48.0,
        price_range_max=88.0,
        amenities=[
            "Clubhouse", "Swimming Pool", "Gym", "Children's Play Area",
            "24x7 Security", "Power Backup", "Covered Parking",
            "Landscaped Gardens", "Jogging Track", "Indoor Games",
        ],
        rera_id="P52100019834",
    ),
    Project(
        id=ProjectId("proj-shapoorji-bkc"),
        name="Shapoorji BKC 9",
        developer="Shapoorji Pallonji",
        address=Address(area="Kondhwa", pincode="411048"),
        total_units=200,
        available_units=38,
        price_range_min=88.0,
        price_range_max=160.0,
        amenities=[
            "Clubhouse", "Swimming Pool", "Gym", "Children's Play Area",
            "24x7 Security", "Power Backup", "Covered Parking",
            "Landscaped Gardens", "Jogging Track", "Indoor Games",
            "Multipurpose Hall", "Senior Citizen Area",
        ],
        rera_id="P52100042156",
    ),
]


# ---------------------------------------------------------------------------
# Properties
# ---------------------------------------------------------------------------

_PROPERTIES: list[Property] = [
    # ── Kumar Megapolis — Hinjewadi Phase 3 ──────────────────────────────
    Property(
        id=PropertyId("prop-km-2bhk-a"),
        project_id=ProjectId("proj-kumar-mega"),
        name="Kumar Megapolis - 2BHK Type A",
        developer="Kumar Properties",
        address=Address(area="Hinjewadi Phase 3", pincode="411057"),
        bhk=2, area_sqft=850, price_lakhs=55.0, price_per_sqft=6471,
        floor=5, total_floors=22,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking"],
        rera_id="P52100028745",
        description="Compact 2BHK in Hinjewadi Phase 3 with excellent IT corridor connectivity. East-facing with cross ventilation.",
        possession_date=date(2026, 6, 30),
    ),
    Property(
        id=PropertyId("prop-km-2bhk-b"),
        project_id=ProjectId("proj-kumar-mega"),
        name="Kumar Megapolis - 2BHK Type B",
        developer="Kumar Properties",
        address=Address(area="Hinjewadi Phase 3", pincode="411057"),
        bhk=2, area_sqft=950, price_lakhs=65.0, price_per_sqft=6842,
        floor=12, total_floors=22,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Landscaped Gardens"],
        rera_id="P52100028745",
        description="Spacious 2BHK with large balcony overlooking landscaped gardens. High floor with panoramic views.",
        possession_date=date(2026, 6, 30),
    ),
    Property(
        id=PropertyId("prop-km-3bhk-a"),
        project_id=ProjectId("proj-kumar-mega"),
        name="Kumar Megapolis - 3BHK Premium",
        developer="Kumar Properties",
        address=Address(area="Hinjewadi Phase 3", pincode="411057"),
        bhk=3, area_sqft=1250, price_lakhs=82.0, price_per_sqft=6560,
        floor=8, total_floors=22,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Jogging Track"],
        rera_id="P52100028745",
        description="Premium 3BHK with modular kitchen and Italian marble flooring. Close to Rajiv Gandhi Infotech Park.",
        possession_date=date(2026, 12, 31),
    ),
    Property(
        id=PropertyId("prop-km-3bhk-b"),
        project_id=ProjectId("proj-kumar-mega"),
        name="Kumar Megapolis - 3BHK Luxe",
        developer="Kumar Properties",
        address=Address(area="Hinjewadi Phase 3", pincode="411057"),
        bhk=3, area_sqft=1400, price_lakhs=95.0, price_per_sqft=6786,
        floor=18, total_floors=22,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Indoor Games", "Jogging Track"],
        rera_id="P52100028745",
        description="Luxurious 3BHK penthouse floor with wraparound balcony. Premium fittings from Kohler and Havells.",
        possession_date=date(2026, 12, 31),
    ),

    # ── Godrej Infinity — Keshav Nagar / Kharadi ────────────────────────
    Property(
        id=PropertyId("prop-gi-2bhk-a"),
        project_id=ProjectId("proj-godrej-inf"),
        name="Godrej Infinity - 2BHK Classic",
        developer="Godrej Properties",
        address=Address(area="Keshav Nagar", pincode="411014"),
        bhk=2, area_sqft=960, price_lakhs=72.0, price_per_sqft=7500,
        floor=7, total_floors=25,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking"],
        rera_id="P52100025012",
        description="Godrej quality 2BHK near Kharadi IT Park. Vastu-compliant layout with servant quarter.",
        possession_date=date(2026, 9, 30),
    ),
    Property(
        id=PropertyId("prop-gi-2bhk-b"),
        project_id=ProjectId("proj-godrej-inf"),
        name="Godrej Infinity - 2BHK Premium",
        developer="Godrej Properties",
        address=Address(area="Keshav Nagar", pincode="411014"),
        bhk=2, area_sqft=1050, price_lakhs=80.0, price_per_sqft=7619,
        floor=15, total_floors=25,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Landscaped Gardens"],
        rera_id="P52100025012",
        description="Premium 2BHK with dry balcony and utility area. North-east facing for maximum natural light.",
        possession_date=date(2026, 9, 30),
    ),
    Property(
        id=PropertyId("prop-gi-3bhk-a"),
        project_id=ProjectId("proj-godrej-inf"),
        name="Godrej Infinity - 3BHK Grand",
        developer="Godrej Properties",
        address=Address(area="Keshav Nagar", pincode="411014"),
        bhk=3, area_sqft=1400, price_lakhs=100.0, price_per_sqft=7143,
        floor=10, total_floors=25,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Jogging Track", "Indoor Games"],
        rera_id="P52100025012",
        description="Grand 3BHK with separate puja room and large living area. Walking distance to EON IT Park.",
        possession_date=date(2027, 3, 31),
    ),

    # ── VTP Blue Waters — Mahalunge / Baner ──────────────────────────────
    Property(
        id=PropertyId("prop-vtp-2bhk-a"),
        project_id=ProjectId("proj-vtp-blue"),
        name="VTP Blue Waters - 2BHK Riverview",
        developer="VTP Realty",
        address=Address(area="Baner-Mahalunge Corridor", pincode="411045"),
        bhk=2, area_sqft=920, price_lakhs=62.0, price_per_sqft=6739,
        floor=4, total_floors=20,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking"],
        rera_id="P52100031890",
        description="Riverside 2BHK near Baner with scenic Mula river views. 10 minutes from Balewadi High Street.",
        possession_date=date(2027, 6, 30),
    ),
    Property(
        id=PropertyId("prop-vtp-2bhk-b"),
        project_id=ProjectId("proj-vtp-blue"),
        name="VTP Blue Waters - 2BHK Garden",
        developer="VTP Realty",
        address=Address(area="Baner-Mahalunge Corridor", pincode="411045"),
        bhk=2, area_sqft=980, price_lakhs=70.0, price_per_sqft=7143,
        floor=9, total_floors=20,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Landscaped Gardens"],
        rera_id="P52100031890",
        description="Garden-facing 2BHK with French windows and premium vitrified flooring. Close to Baner commercial hub.",
        possession_date=date(2027, 6, 30),
    ),
    Property(
        id=PropertyId("prop-vtp-3bhk-a"),
        project_id=ProjectId("proj-vtp-blue"),
        name="VTP Blue Waters - 3BHK Elite",
        developer="VTP Realty",
        address=Address(area="Baner-Mahalunge Corridor", pincode="411045"),
        bhk=3, area_sqft=1300, price_lakhs=88.0, price_per_sqft=6769,
        floor=14, total_floors=20,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Jogging Track"],
        rera_id="P52100031890",
        description="Elite 3BHK with master bedroom having walk-in closet. Premium location between Baner and Hinjewadi.",
        possession_date=date(2027, 12, 31),
    ),

    # ── Kolte Patil Life Republic — Hinjewadi ────────────────────────────
    Property(
        id=PropertyId("prop-kp-2bhk-a"),
        project_id=ProjectId("proj-kolte-life"),
        name="Life Republic - 2BHK Starter",
        developer="Kolte Patil Developers",
        address=Address(area="Hinjewadi", pincode="411057"),
        bhk=2, area_sqft=810, price_lakhs=48.0, price_per_sqft=5926,
        floor=3, total_floors=18,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking"],
        rera_id="P52100019834",
        description="Affordable 2BHK in Life Republic township. Self-sufficient township with school and hospital nearby.",
        possession_date=date(2026, 3, 31),
        status=PropertyStatus.AVAILABLE,
    ),
    Property(
        id=PropertyId("prop-kp-3bhk-a"),
        project_id=ProjectId("proj-kolte-life"),
        name="Life Republic - 3BHK Family",
        developer="Kolte Patil Developers",
        address=Address(area="Hinjewadi", pincode="411057"),
        bhk=3, area_sqft=1200, price_lakhs=75.0, price_per_sqft=6250,
        floor=6, total_floors=18,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Children's Play Area", "Jogging Track"],
        rera_id="P52100019834",
        description="Family-friendly 3BHK in integrated township. 5 min from Infosys and Wipro campuses.",
        possession_date=date(2026, 9, 30),
    ),

    # ── Shapoorji BKC 9 — Kondhwa ───────────────────────────────────────
    Property(
        id=PropertyId("prop-sp-3bhk-a"),
        project_id=ProjectId("proj-shapoorji-bkc"),
        name="BKC 9 - 3BHK Premium",
        developer="Shapoorji Pallonji",
        address=Address(area="Kondhwa", pincode="411048"),
        bhk=3, area_sqft=1350, price_lakhs=92.0, price_per_sqft=6815,
        floor=11, total_floors=30,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Landscaped Gardens", "Multipurpose Hall"],
        rera_id="P52100042156",
        description="Premium 3BHK by Shapoorji Pallonji with world-class construction quality. Near Magarpatta City.",
        possession_date=date(2027, 12, 31),
    ),
    Property(
        id=PropertyId("prop-sp-3bhk-b"),
        project_id=ProjectId("proj-shapoorji-bkc"),
        name="BKC 9 - 3BHK Grand",
        developer="Shapoorji Pallonji",
        address=Address(area="Kondhwa", pincode="411048"),
        bhk=3, area_sqft=1500, price_lakhs=105.0, price_per_sqft=7000,
        floor=20, total_floors=30,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Landscaped Gardens", "Senior Citizen Area"],
        rera_id="P52100042156",
        description="Grand 3BHK on high floor with city skyline views. Double-height entrance lobby with concierge service.",
        possession_date=date(2028, 3, 31),
    ),
    Property(
        id=PropertyId("prop-sp-4bhk-a"),
        project_id=ProjectId("proj-shapoorji-bkc"),
        name="BKC 9 - 4BHK Ultra Luxury",
        developer="Shapoorji Pallonji",
        address=Address(area="Kondhwa", pincode="411048"),
        bhk=4, area_sqft=1900, price_lakhs=135.0, price_per_sqft=7105,
        floor=25, total_floors=30,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Landscaped Gardens", "Indoor Games", "Multipurpose Hall"],
        rera_id="P52100042156",
        description="Ultra-luxury 4BHK with private terrace and smart home automation. Imported marble and VRV air conditioning.",
        possession_date=date(2028, 6, 30),
    ),
    Property(
        id=PropertyId("prop-sp-4bhk-b"),
        project_id=ProjectId("proj-shapoorji-bkc"),
        name="BKC 9 - 4BHK Sky Villa",
        developer="Shapoorji Pallonji",
        address=Address(area="Kondhwa", pincode="411048"),
        bhk=4, area_sqft=2100, price_lakhs=158.0, price_per_sqft=7524,
        floor=28, total_floors=30,
        amenities=["Clubhouse", "Swimming Pool", "Gym", "24x7 Security", "Covered Parking", "Landscaped Gardens", "Indoor Games", "Multipurpose Hall", "Senior Citizen Area"],
        rera_id="P52100042156",
        description="Sky Villa on the 28th floor with 270-degree panoramic views. Duplex layout with private elevator access.",
        possession_date=date(2028, 6, 30),
    ),
]


# ---------------------------------------------------------------------------
# Public accessors
# ---------------------------------------------------------------------------

def get_all_properties() -> list[Property]:
    """Return a copy of the full property catalogue."""
    return list(_PROPERTIES)


def get_all_projects() -> list[Project]:
    """Return a copy of all projects."""
    return list(_PROJECTS)
