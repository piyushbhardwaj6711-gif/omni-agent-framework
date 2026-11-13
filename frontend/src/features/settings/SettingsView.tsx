import { Route, ShieldCheck, Building2, Sparkles, UserCircle2 } from 'lucide-react';
import Card from '../../shared/components/Card';
import PondoMark from '../../shared/components/PondoMark';
import { CURRENT_USER, TENANT } from '../../shared/constants';
import type { View } from '../../shared/components/Sidebar';

interface SettingsViewProps {
  onNavigate: (view: View) => void;
}

export default function SettingsView({ onNavigate }: SettingsViewProps) {
  return (
    <div className="max-w-3xl space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ivory tracking-tight">Settings</h1>
        <p className="text-sm text-ivory-muted mt-1">
          Workspace and account preferences
        </p>
      </div>

      {/* Account */}
      <Card className="p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-ivory mb-5">
          <UserCircle2 className="w-4 h-4 text-brand-400" />
          Account
        </div>
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-peach-300 text-[#171411] flex items-center justify-center text-base font-bold shrink-0">
            {CURRENT_USER.initials}
          </span>
          <div className="min-w-0">
            <div className="text-base font-semibold text-ivory">
              {CURRENT_USER.name}
            </div>
            <div className="text-sm text-ivory-muted">{CURRENT_USER.role}</div>
            <p className="text-[11px] text-ivory-faint mt-1.5">
              Profile and account management become editable once authentication
              is connected.
            </p>
          </div>
        </div>
      </Card>

      {/* Workspace */}
      <Card className="p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-ivory mb-5">
          <Building2 className="w-4 h-4 text-brand-400" />
          Workspace
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-ivory-faint font-semibold">
              Workspace
            </dt>
            <dd className="text-sm text-ivory mt-1">{TENANT.name}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-ivory-faint font-semibold">
              Tenant ID
            </dt>
            <dd className="text-sm text-ivory mt-1">#{TENANT.id}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-ivory-faint font-semibold">
              Status
            </dt>
            <dd className="text-sm mt-1 flex items-center gap-1.5 text-success-400">
              <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
              {TENANT.status}
            </dd>
          </div>
        </dl>
        <div className="mt-5 pt-4 border-t border-bronze-faint flex items-center gap-2 text-xs text-ivory-faint">
          <ShieldCheck className="w-3.5 h-3.5 text-success-500" />
          Multi-tenant isolation is enforced by the backend middleware.
        </div>
      </Card>

      {/* Product Roadmap */}
      <Card className="p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-ivory mb-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          Product Roadmap
        </div>
        <p className="text-sm text-ivory-muted leading-relaxed">
          Explore the planned evolution of PONDO — from the current vertical
          demo to the full multi-industry AI operating layer.
        </p>
        <button
          onClick={() => onNavigate('vision')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500 text-[#171411] text-sm font-semibold hover:bg-brand-400 transition-colors"
        >
          <Route className="w-4 h-4" />
          View Roadmap
        </button>
      </Card>

      {/* About */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <PondoMark size="sm" />
          <div>
            <div className="text-sm font-semibold text-ivory lowercase">pondo</div>
            <div className="text-xs text-ivory-faint">
              AI Business Operating Platform • V0
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
