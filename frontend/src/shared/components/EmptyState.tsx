import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-fade-up">
      <div className="w-14 h-14 rounded-2xl bg-canvas-raised border border-bronze flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-brand-400" />
      </div>
      <h2 className="text-xl font-semibold text-ivory tracking-tight">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ivory-muted">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500 text-[#171411] text-sm font-semibold hover:bg-brand-400 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
