import { Zap } from 'lucide-react';

export default function SimulatedBanner() {
  return (
    <div className="flex items-center justify-center gap-1.5 bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs font-medium text-amber-700">
      <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
      <span>SIMULATED DATA — Demo Mode</span>
    </div>
  );
}
