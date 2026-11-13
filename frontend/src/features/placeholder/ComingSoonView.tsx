import type { LucideIcon } from 'lucide-react';
import EmptyState from '../../shared/components/EmptyState';
import type { View } from '../../shared/components/Sidebar';

interface ComingSoonViewProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onNavigate: (view: View) => void;
}

/**
 * Honest placeholder for areas whose backend capabilities do not exist yet
 * (AI Agents, Automations, Templates). No simulated data is displayed —
 * just a clear explanation of what is needed to unlock the area.
 */
export default function ComingSoonView({
  icon,
  title,
  description,
  onNavigate,
}: ComingSoonViewProps) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-ivory tracking-tight pb-2">
        {title}
      </h1>
      <div className="bg-canvas-overlay border border-bronze rounded-2xl shadow-card">
        <EmptyState
          icon={icon}
          title={`${title} coming soon`}
          description={description}
          action={{
            label: 'Ask PONDO AI instead',
            onClick: () => onNavigate('home'),
          }}
        />
      </div>
    </div>
  );
}
