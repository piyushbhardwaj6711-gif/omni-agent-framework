import {
  Home,
  BarChart3,
  Users,
  Sparkles,
  Zap,
  LayoutGrid,
  Settings,
  ChevronRight,
  X,
} from 'lucide-react';
import PondoMark from './PondoMark';
import { CURRENT_USER } from '../constants';

export type View =
  | 'home'
  | 'chat'
  | 'analytics'
  | 'leads'
  | 'agents'
  | 'automations'
  | 'templates'
  | 'settings'
  | 'vision';

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  /** Rendered as an overlay drawer on small screens when true. */
  mobile?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS: Array<{
  view: View;
  label: string;
  icon: typeof Home;
}> = [
  { view: 'home', label: 'Home', icon: Home },
  { view: 'analytics', label: 'Analytics', icon: BarChart3 },
  { view: 'leads', label: 'Leads', icon: Users },
  { view: 'agents', label: 'AI Agents', icon: Sparkles },
  { view: 'automations', label: 'Automations', icon: Zap },
  { view: 'templates', label: 'Templates', icon: LayoutGrid },
  { view: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({
  activeView,
  onNavigate,
  mobile = false,
  onClose,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-canvas-soft border-r border-bronze-faint w-[248px] shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
        <PondoMark size="sm" />
        <span className="text-xl font-bold tracking-tight text-ivory lowercase">
          pondo
        </span>
        {mobile && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto p-1.5 rounded-lg text-ivory-muted hover:text-ivory hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto" aria-label="Primary">
        {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
          const isActive = activeView === view || (view === 'home' && activeView === 'chat');
          return (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-500/15 text-ivory'
                  : 'text-ivory-muted hover:bg-white/[0.04] hover:text-ivory'
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 ${
                  isActive ? 'text-brand-400' : 'text-ivory-faint'
                }`}
              />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Divider + user block */}
      <div className="px-3 pb-5 pt-3">
        <div className="border-t border-bronze-faint pt-3">
          <button
            onClick={() => onNavigate('settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors text-left"
          >
            <span className="w-9 h-9 rounded-full bg-peach-300 text-[#171411] flex items-center justify-center text-xs font-bold shrink-0">
              {CURRENT_USER.initials}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-ivory truncate">
                {CURRENT_USER.name}
              </span>
              <span className="block text-xs text-ivory-faint truncate">
                {CURRENT_USER.role}
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-ivory-faint shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
