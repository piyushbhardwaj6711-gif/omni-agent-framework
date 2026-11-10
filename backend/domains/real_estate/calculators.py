"""Financial calculators for the Indian real-estate domain."""

from __future__ import annotations

import math


def calculate_emi(
    principal_lakhs: float,
    annual_rate: float = 8.5,
    tenure_years: int = 20,
) -> dict[str, float | int | str]:
    """Calculate EMI using standard formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1).

    All monetary return values are in **rupees** (not lakhs).
    """
    principal = principal_lakhs * 1_00_000  # convert to rupees
    monthly_rate = annual_rate / (12 * 100)
    num_months = tenure_years * 12

    if monthly_rate == 0:
        emi = principal / num_months
    else:
        factor = math.pow(1 + monthly_rate, num_months)
        emi = principal * monthly_rate * factor / (factor - 1)

    total_payment = emi * num_months
    total_interest = total_payment - principal

    return {
        "emi_monthly": round(emi, 2),
        "total_payment": round(total_payment, 2),
        "total_interest": round(total_interest, 2),
        "principal": round(principal, 2),
        "annual_rate": annual_rate,
        "tenure_years": tenure_years,
        "tenure_months": num_months,
    }


def calculate_stamp_duty(
    price_lakhs: float,
    is_female_buyer: bool = False,
) -> dict[str, float | str]:
    """Calculate Maharashtra stamp duty, registration, and metro cess.

    * Stamp duty: 5 % (male) / 4 % (female)
    * Metro cess: 1 %
    * Registration: 1 % (capped at ₹30,000 — simplified here as 1 %)
    """
    price = price_lakhs * 1_00_000

    stamp_rate = 0.04 if is_female_buyer else 0.05
    stamp_duty = price * stamp_rate
    metro_cess = price * 0.01
    registration = price * 0.01

    total = stamp_duty + metro_cess + registration

    return {
        "stamp_duty": round(stamp_duty, 2),
        "stamp_duty_rate": f"{stamp_rate * 100:.0f}%",
        "metro_cess": round(metro_cess, 2),
        "registration": round(registration, 2),
        "total_charges": round(total, 2),
        "property_price": round(price, 2),
        "is_female_buyer": is_female_buyer,
    }


def calculate_affordability(
    monthly_income: float,
    existing_emi: float = 0,
) -> dict[str, float]:
    """Estimate max affordable property value based on income.

    * Max EMI = 50 % of (monthly_income - existing_emi)
    * Max loan derived from max EMI at 8.5 % / 20 years
    * Max property = loan + 20 % down payment contribution
    """
    disposable = monthly_income - existing_emi
    max_emi = disposable * 0.50

    annual_rate = 8.5
    monthly_rate = annual_rate / (12 * 100)
    num_months = 20 * 12

    if monthly_rate == 0:
        max_loan = max_emi * num_months
    else:
        factor = math.pow(1 + monthly_rate, num_months)
        max_loan = max_emi * (factor - 1) / (monthly_rate * factor)

    # buyer can additionally contribute 20 % as down payment
    max_property_value = max_loan / 0.80

    return {
        "monthly_income": round(monthly_income, 2),
        "existing_emi": round(existing_emi, 2),
        "max_emi": round(max_emi, 2),
        "max_loan_amount": round(max_loan, 2),
        "max_property_value": round(max_property_value, 2),
    }


# ---------------------------------------------------------------------------
# Indian number formatting
# ---------------------------------------------------------------------------

def format_inr(amount: float) -> str:
    """Format *amount* (rupees) in the Indian numbering system: ₹XX,XX,XXX."""
    if amount < 0:
        return f"-{format_inr(-amount)}"

    amount = round(amount, 2)
    integer_part = int(amount)
    decimal_part = round(amount - integer_part, 2)

    s = str(integer_part)
    if len(s) <= 3:
        formatted = s
    else:
        last_three = s[-3:]
        remaining = s[:-3]
        # group remaining digits in pairs from right
        groups: list[str] = []
        while remaining:
            groups.append(remaining[-2:])
            remaining = remaining[:-2]
        groups.reverse()
        formatted = ",".join(groups) + "," + last_three

    if decimal_part:
        decimal_str = f"{decimal_part:.2f}"[1:]  # e.g. ".50"
        return f"₹{formatted}{decimal_str}"
    return f"₹{formatted}"


def format_lakhs(amount_lakhs: float) -> str:
    """Format a value expressed in Lakhs into a human-readable string.

    Values ≥ 100 Lakhs are displayed in Crores.
    """
    if amount_lakhs >= 100:
        crores = amount_lakhs / 100
        if crores == int(crores):
            return f"₹{int(crores)} Cr"
        return f"₹{crores:.2f} Cr"
    if amount_lakhs == int(amount_lakhs):
        return f"₹{int(amount_lakhs)} Lakhs"
    return f"₹{amount_lakhs:.1f} Lakhs"
