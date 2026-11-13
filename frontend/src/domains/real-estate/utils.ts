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
      return 'bg-danger-100 text-danger-400 border-danger-200';
    case 'WARM':
      return 'bg-warning-100 text-warning-400 border-warning-200';
    case 'COLD':
      return 'bg-peach-500/10 text-peach-300 border-peach-500/20';
    default:
      return 'bg-white/[0.06] text-ivory-muted border-bronze';
  }
}

/**
 * Get Tailwind CSS classes for lead status badges.
 */
export function getStatusColor(status: string): string {
  const upper = status.toUpperCase();
  switch (upper) {
    case 'NEW':
      return 'bg-peach-500/10 text-peach-300';
    case 'CONTACTED':
      return 'bg-brand-500/10 text-brand-300';
    case 'QUALIFIED':
      return 'bg-success-100 text-success-400';
    case 'NEGOTIATING':
      return 'bg-warning-100 text-warning-400';
    case 'CONVERTED':
      return 'bg-success-200 text-success-400';
    case 'LOST':
      return 'bg-white/[0.06] text-ivory-faint';
    case 'SITE_VISIT_SCHEDULED':
      return 'bg-peach-200 text-peach-700';
    default:
      return 'bg-white/[0.06] text-ivory-muted';
  }
}

/**
 * Get a BHK label string.
 * e.g. 3 -> "3 BHK"
 */
export function getBHKLabel(bhk: number): string {
  return `${bhk} BHK`;
}
