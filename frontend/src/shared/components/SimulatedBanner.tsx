import { Zap } from 'lucide-react';

/**
 * Demo-mode disclosure pill. Rendered inline (top bar, page headers) rather
 * than as a full-width strip, keeping the interface quiet while preserving
 * the simulated-data notice.
 */
export default function SimulatedBanner() {
  return (
    <span className="inline-flex items-center gap-1.5 bg-warning-100 border border-warning-200 px-2.5 py-1 text-[11px] font-medium text-warning-400 rounded-full">
      <Zap className="h-3 w-3 fill-warning-500 text-warning-500" />
      <span>Demo data</span>
    </span>
  );
}
