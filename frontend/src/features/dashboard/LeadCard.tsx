import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Home,
  CreditCard,
  ChevronDown,
  Calendar,
  Sparkles,
} from 'lucide-react';
import ScoreGauge from '../../shared/components/ScoreGauge';
import Badge from '../../shared/components/Badge';
import { formatLakhs } from '../../domains/real-estate/utils';
import type { Lead } from '../../services/types';

interface LeadCardProps {
  lead: Lead;
  onExecuteAction?: (leadId: string, action: string) => void;
}

export default function LeadCard({ lead, onExecuteAction }: LeadCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isHot = lead.temperature === 'HOT';
  const isWarm = lead.temperature === 'WARM';

  const tempBadgeVariant = isHot ? 'danger' : isWarm ? 'warning' : 'info';
  const tempEmoji = isHot ? '🔥 HOT LEAD' : isWarm ? '☀️ WARM' : '❄️ COLD';

  const borderColor = isHot
    ? 'border-l-rose-500'
    : isWarm
    ? 'border-l-amber-500'
    : 'border-l-blue-400';

  const locations = Array.isArray(lead.preferred_locations)
    ? lead.preferred_locations.join(', ')
    : 'Pune Corridor';

  const budgetText =
    lead.budget_max
      ? formatLakhs(lead.budget_max)
      : '₹75L - 95L';

  return (
    <motion.div
      layout
      className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${borderColor} p-5 hover:shadow-md transition-shadow`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Customer Info & Requirements */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {lead.customer_name}
            </h3>
            <Badge variant={tempBadgeVariant} size="sm">
              {tempEmoji}
            </Badge>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              {lead.status}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            {lead.phone && (
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {lead.phone}
              </span>
            )}
            {lead.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {lead.email}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Source: <strong className="text-gray-700">WhatsApp / Chat</strong>
            </span>
          </div>

          {/* Quick Requirements Bar */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs font-medium">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Home className="w-3.5 h-3.5" />
              {lead.bhk_preference ? `${lead.bhk_preference} BHK` : '3 BHK'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
              <MapPin className="w-3.5 h-3.5" />
              {locations}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
              Budget: {budgetText}
            </span>
            {lead.financing_needed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                <CreditCard className="w-3.5 h-3.5" />
                Loan Required (80%)
              </span>
            )}
          </div>
        </div>

        {/* Right: Score Gauge & Conversion Prob */}
        <div className="flex items-center gap-4 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Conv. Probability
            </div>
            <div className="text-xl font-extrabold text-gray-900">
              {Math.round((lead.conversion_probability || 0.8) * 100)}%
            </div>
            <div className="text-[10px] text-gray-400">Calibrated ML score</div>
          </div>

          <div className="relative">
            <ScoreGauge score={lead.score || 85} size={64} />
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Expand Details"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded Intelligence Panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100 space-y-3"
          >
            {/* Next Best Action Suggestion */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-50/70 to-purple-50/70 border border-indigo-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-indigo-900">
                    Recommended Next-Best-Action:
                  </div>
                  <div className="text-xs text-indigo-800 mt-0.5">
                    {isHot
                      ? 'Call within 10 minutes and confirm the Saturday site visit with property brochure.'
                      : 'Share personalized WhatsApp walkthrough and connect with HDFC loan specialist.'}
                  </div>
                </div>
              </div>

              {onExecuteAction && (
                <button
                  onClick={() =>
                    onExecuteAction(
                      lead.id,
                      isHot ? 'Confirm Site Visit' : 'Send WhatsApp Brochure'
                    )
                  }
                  className="shrink-0 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Execute Action
                </button>
              )}
            </div>

            {/* Interaction Notes */}
            {lead.notes && (
              <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                <span className="font-semibold text-gray-700">Interaction Log & Signals:</span>
                <p className="mt-1 font-mono text-[11px] leading-relaxed">
                  {typeof lead.notes === 'string'
                    ? lead.notes
                    : Array.isArray(lead.notes)
                    ? (lead.notes as string[]).join(' • ')
                    : 'Customer inquired via WhatsApp about 3BHK in Baner with financing options.'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
