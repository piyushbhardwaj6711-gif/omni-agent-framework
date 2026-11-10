/**
 * Format a number in Indian Rupee format with proper grouping.
 * e.g. 9000000 -> "₹90,00,000"
 */
export function formatINR(amount: number): string {
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'INR',
  });
  return formatted;
}

/**
 * Format a price given in lakhs.
 * e.g. 90 -> "₹90 Lakhs", 120 -> "₹1.20 Cr"
 */
export function formatLakhs(lakhs: number): string {
  if (lakhs >= 100) {
    const cr = lakhs / 100;
    return `₹${cr.toFixed(2)} Cr`;
  }
  return `₹${lakhs} Lakhs`;
}

/**
 * Format square footage with comma separators.
 * e.g. 1250 -> "1,250 sq.ft"
 */
export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
}

/**
 * Get Tailwind CSS classes for lead temperature indicators.
 */
export function getTemperatureColor(temp: string): string {
  const upper = temp.toUpperCase();
  switch (upper) {
    case 'HOT':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'WARM':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'COLD':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

/**
 * Get Tailwind CSS classes for lead status badges.
 */
export function getStatusColor(status: string): string {
  const upper = status.toUpperCase();
  switch (upper) {
    case 'NEW':
      return 'bg-blue-100 text-blue-700';
    case 'CONTACTED':
      return 'bg-indigo-100 text-indigo-700';
    case 'QUALIFIED':
      return 'bg-emerald-100 text-emerald-700';
    case 'NEGOTIATING':
      return 'bg-amber-100 text-amber-700';
    case 'CONVERTED':
      return 'bg-green-100 text-green-700';
    case 'LOST':
      return 'bg-gray-100 text-gray-500';
    case 'SITE_VISIT_SCHEDULED':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

/**
 * Get a BHK label string.
 * e.g. 3 -> "3 BHK"
 */
export function getBHKLabel(bhk: number): string {
  return `${bhk} BHK`;
}
