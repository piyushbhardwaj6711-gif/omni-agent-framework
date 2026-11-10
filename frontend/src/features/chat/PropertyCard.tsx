import { motion } from 'framer-motion';
import {
  MapPin,
  Home,
  Ruler,
  IndianRupee,
  Shield,
  Calendar,
  Star,
} from 'lucide-react';
import Badge from '../../shared/components/Badge';
import type { Property } from '../../services/types';
import { formatLakhs, formatArea, getBHKLabel } from '../../domains/real-estate/utils';

interface PropertyCardProps {
  property: Property;
  matchScore?: number;
  emiEstimate?: string;
  onBookVisit?: (property: Property) => void;
}

export default function PropertyCard({
  property,
  matchScore,
  emiEstimate,
  onBookVisit,
}: PropertyCardProps) {
  const displayAmenities = property.amenities?.slice(0, 4) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-500 to-violet-500" />

      <div className="pl-4 pr-4 py-3.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
              {property.name}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">{property.developer}</p>
          </div>
          {matchScore !== undefined && (
            <Badge
              variant={matchScore >= 80 ? 'success' : matchScore >= 50 ? 'warning' : 'default'}
              size="sm"
            >
              <Star className="h-3 w-3 mr-0.5" />
              {matchScore}% Match
            </Badge>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600 mb-2.5">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span>
              {property.address?.area}, {property.address?.city}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Home className="h-3 w-3 text-gray-400" />
            <span>{getBHKLabel(property.bhk)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="h-3 w-3 text-gray-400" />
            <span>{formatArea(property.area_sqft)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="h-3 w-3 text-gray-400" />
            <span className="font-semibold text-gray-900">
              {formatLakhs(property.price_lakhs)}
            </span>
          </div>
        </div>

        {/* Price per sqft */}
        {property.price_per_sqft > 0 && (
          <p className="text-[11px] text-gray-400 mb-2">
            ₹{property.price_per_sqft.toLocaleString('en-IN')}/sq.ft
          </p>
        )}

        {/* EMI Estimate */}
        {emiEstimate && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 rounded-lg px-2.5 py-1.5 mb-2">
            <IndianRupee className="h-3 w-3" />
            <span>EMI: ~{emiEstimate}/month</span>
          </div>
        )}

        {/* Amenities */}
        {displayAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {displayAmenities.map((amenity) => (
              <span
                key={amenity}
                className="text-[10px] bg-gray-100 text-gray-600 rounded-full px-2 py-0.5"
              >
                {amenity}
              </span>
            ))}
            {property.amenities && property.amenities.length > 4 && (
              <span className="text-[10px] text-gray-400">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer: RERA + actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <Shield className="h-3 w-3" />
            <span>RERA: {property.rera_id}</span>
          </div>
          {property.possession_date && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>{property.possession_date}</span>
            </div>
          )}
        </div>

        {/* Book Visit button */}
        {onBookVisit && (
          <button
            onClick={() => onBookVisit(property)}
            className="mt-2.5 w-full py-2 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-medium hover:from-brand-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow"
          >
            📅 Book Site Visit
          </button>
        )}
      </div>
    </motion.div>
  );
}
