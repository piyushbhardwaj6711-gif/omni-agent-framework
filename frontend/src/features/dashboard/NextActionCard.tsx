import { motion } from 'framer-motion';
import { ArrowRight, Clock, AlertCircle } from 'lucide-react';
import Badge from '../../shared/components/Badge';

interface NextActionItem {
  lead_id?: string;
  customer_name?: string;
  action: string;
  priority: string;
  reason: string;
  deadline?: string | null;
}

interface NextActionCardProps {
  actionItem: NextActionItem;
  onExecute?: (action: string) => void;
}

export default function NextActionCard({ actionItem, onExecute }: NextActionCardProps) {
  const isHigh = actionItem.priority.toUpperCase() === 'HIGH';
  const isMed = actionItem.priority.toUpperCase() === 'MEDIUM';

  const variant = isHigh ? 'danger' : isMed ? 'warning' : 'info';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-canvas-raised rounded-xl p-4 border border-bronze shadow-pill flex flex-col justify-between hover:border-bronze-light transition-all"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant={variant} size="sm">
            {actionItem.priority.toUpperCase()} PRIORITY
          </Badge>
          {actionItem.deadline && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-danger-400 bg-danger-100 px-2 py-0.5 rounded">
              <Clock className="w-3 h-3" />
              {actionItem.deadline}
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold text-ivory leading-snug">
          {actionItem.action}
        </h4>

        {actionItem.customer_name && (
          <div className="text-xs font-semibold text-brand-300 mt-1">
            Lead: {actionItem.customer_name}
          </div>
        )}

        <div className="flex items-start gap-1.5 mt-2 text-xs text-ivory-muted">
          <AlertCircle className="w-3.5 h-3.5 text-ivory-faint shrink-0 mt-0.5" />
          <p className="line-clamp-2">{actionItem.reason}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-bronze-faint flex items-center justify-end">
        <button
          onClick={() => onExecute && onExecute(actionItem.action)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-300 hover:text-brand-200 transition-colors"
        >
          Take Action
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
