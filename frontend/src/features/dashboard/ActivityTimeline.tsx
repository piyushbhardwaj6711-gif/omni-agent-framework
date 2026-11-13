import { motion } from 'framer-motion';
import {
  MessageSquare,
  UserCheck,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { ActivityItem } from '../../services/types';

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

function getActivityIcon(action: string) {
  if (action.includes('MESSAGE')) return <MessageSquare className="w-3.5 h-3.5 text-brand-400" />;
  if (action.includes('VISIT') || action.includes('BOOK')) return <Calendar className="w-3.5 h-3.5 text-success-400" />;
  if (action.includes('LEAD')) return <UserCheck className="w-3.5 h-3.5 text-warning-400" />;
  if (action.includes('SCORE') || action.includes('ACTION')) return <Sparkles className="w-3.5 h-3.5 text-peach-300" />;
  return <Zap className="w-3.5 h-3.5 text-ivory-muted" />;
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-ivory-faint">
        No recent activities recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-bronze-faint">
      {activities.map((act, index) => {
        const timeStr = act.timestamp ? new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';

        return (
          <motion.div
            key={act.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex items-start gap-3"
          >
            {/* Timeline node */}
            <div className="absolute -left-6 mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-canvas-overlay border border-bronze">
              {getActivityIcon(act.action)}
            </div>

            <div className="bg-canvas-raised rounded-lg p-2.5 w-full border border-bronze-faint text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-ivory">{act.action}</span>
                <span className="text-[10px] text-ivory-faint">{timeStr}</span>
              </div>
              <div className="text-ivory-muted mt-0.5 flex items-center gap-1.5">
                <span className="font-medium text-brand-300">{act.actor}:</span>
                <span className="truncate">
                  {typeof act.details === 'string'
                    ? act.details
                    : JSON.stringify(act.details || {})}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
