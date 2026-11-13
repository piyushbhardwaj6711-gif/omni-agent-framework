import { useEffect, useState } from 'react';
import { Flame, Sun, Snowflake, Users, RefreshCw } from 'lucide-react';
import LeadCard from '../dashboard/LeadCard';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import Card from '../../shared/components/Card';
import { api } from '../../services/api';
import type { Lead } from '../../services/types';

/**
 * Leads page — lists every lead for the tenant via the existing
 * GET /api/leads endpoint. Loading, empty and error states are all handled;
 * no simulated data is introduced here.
 */
export default function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    setError(null);
    try {
      const res = await api.getLeads();
      setLeads(Array.isArray(res) ? res : []);
    } catch {
      setError(
        'Could not load leads. Please make sure the backend is running at http://localhost:8000 and try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Loading leads..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 pb-12">
        <LeadsHeader onRefresh={handleRefresh} refreshing={refreshing} />
        <Card className="p-10 text-center">
          <p className="text-sm text-danger-400 font-medium">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500 text-[#171411] text-sm font-semibold hover:bg-brand-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </Card>
      </div>
    );
  }

  const hotCount = leads.filter((l) => l.temperature === 'HOT').length;
  const warmCount = leads.filter((l) => l.temperature === 'WARM').length;
  const coldCount = leads.filter(
    (l) => l.temperature && l.temperature !== 'HOT' && l.temperature !== 'WARM',
  ).length;

  return (
    <div className="space-y-6 pb-12">
      <LeadsHeader onRefresh={handleRefresh} refreshing={refreshing} />

      {/* Temperature summary — computed from the real lead list */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-ivory-muted">
            <span className="text-xs font-bold uppercase tracking-wider">All Leads</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ivory">{leads.length}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between text-ivory-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-danger-400">Hot</span>
            <Flame className="w-4 h-4 text-danger-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-danger-400">{hotCount}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between text-ivory-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-warning-400">Warm</span>
            <Sun className="w-4 h-4 text-warning-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-warning-400">{warmCount}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between text-ivory-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-peach-300">Cold</span>
            <Snowflake className="w-4 h-4 text-peach-300" />
          </div>
          <div className="mt-2 text-2xl font-bold text-peach-300">{coldCount}</div>
        </Card>
      </div>

      {/* Lead list */}
      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
        {leads.length === 0 && (
          <Card className="p-10 text-center">
            <p className="text-sm text-ivory-muted">
              No leads yet. Leads are created automatically when customers
              interact with PONDO AI.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function LeadsHeader({
  onRefresh,
  refreshing,
}: {
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-ivory tracking-tight">Leads</h1>
        <p className="text-xs text-ivory-muted mt-1">
          Every customer lead captured and scored by PONDO AI
        </p>
      </div>
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-bronze text-xs font-semibold text-ivory-muted bg-canvas-raised hover:text-ivory hover:border-bronze-light transition-colors disabled:opacity-60"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
        Refresh
      </button>
    </div>
  );
}
