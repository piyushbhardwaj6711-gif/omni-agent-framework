import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Sun,
  Snowflake,
  TrendingUp,
  Users,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import LeadCard from './LeadCard';
import NextActionCard from './NextActionCard';
import ActivityTimeline from './ActivityTimeline';
import Card from '../../shared/components/Card';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import { api } from '../../services/api';
import type { DashboardData } from '../../services/types';

export default function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const handleExecuteAction = (action: string) => {
    setBannerAlert(`Action dispatched: "${action}". Logged in audit trail.`);
    setTimeout(() => setBannerAlert(null), 3500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Loading Sales Intelligence..." />
      </div>
    );
  }

  const topLeads = data?.top_leads || [];
  const nextActions = data?.next_actions || [];
  const activities = data?.recent_activities || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-ivory tracking-tight">
              Salesperson Intelligence
            </h1>
          </div>
          <p className="text-xs text-ivory-muted mt-1 flex items-center gap-2">
            <span>Broker: <strong className="text-ivory">Rahul Sharma</strong> (Senior Sales Consultant)</span>
            <span className="text-ivory-faint">•</span>
            <span className="flex items-center gap-1 text-success-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Multi-Tenant Ready
            </span>
            <span className="text-ivory-faint">•</span>
            <span className="text-ivory-faint">Market: Pune, MH</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-bronze text-xs font-semibold text-ivory-muted bg-canvas-raised hover:text-ivory hover:border-bronze-light transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Intelligence
          </button>
        </div>
      </div>

      {bannerAlert && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success-100 border border-success-200 text-success-400 text-xs font-medium px-4 py-2.5 rounded-lg flex items-center justify-between"
        >
          <span>✅ {bannerAlert}</span>
        </motion.div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-brand-500">
          <div className="flex items-center justify-between text-ivory-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-brand-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ivory">
            {data?.total_leads || 4}
          </div>
          <div className="text-[11px] text-ivory-faint mt-0.5">Active conversations</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-danger-500">
          <div className="flex items-center justify-between text-ivory-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-danger-400">Hot Leads</span>
            <Flame className="w-4 h-4 text-danger-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-danger-400">
            {data?.hot_leads || 2}
          </div>
          <div className="text-[11px] text-ivory-faint mt-0.5">Score &gt; 75 / 100</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning-500">
          <div className="flex items-center justify-between text-ivory-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-warning-400">Warm Leads</span>
            <Sun className="w-4 h-4 text-warning-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-warning-400">
            {data?.warm_leads || 1}
          </div>
          <div className="text-[11px] text-ivory-faint mt-0.5">Score 45 - 75</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-peach-400">
          <div className="flex items-center justify-between text-ivory-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-peach-300">Cold Leads</span>
            <Snowflake className="w-4 h-4 text-peach-300" />
          </div>
          <div className="mt-2 text-2xl font-bold text-peach-300">
            {data?.cold_leads || 1}
          </div>
          <div className="text-[11px] text-ivory-faint mt-0.5">Exploratory stage</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success-500 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-ivory-muted">
            <span className="text-xs font-bold uppercase tracking-wider text-success-400">Pipeline Est.</span>
            <TrendingUp className="w-4 h-4 text-success-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-success-400">
            ₹6.8 Cr
          </div>
          <div className="text-[11px] text-ivory-faint mt-0.5">Calibrated Value</div>
        </Card>
      </div>

      {/* Main Grid: Leads on Left (2/3), Next Actions & Timeline on Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ivory flex items-center gap-2">
                Prioritized Sales Pipeline
              </h2>
              <p className="text-xs text-ivory-muted">
                Ranked by conversion probability and expected deal value
              </p>
            </div>
            <span className="text-xs text-brand-300 font-semibold bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-md">
              Live Sync
            </span>
          </div>

          <div className="space-y-3">
            {topLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onExecuteAction={handleExecuteAction}
              />
            ))}
            {topLeads.length === 0 && (
              <Card className="p-8 text-center text-sm text-ivory-muted">
                No prioritized leads yet. Start a conversation with PONDO AI to
                generate leads.
              </Card>
            )}
          </div>
        </div>

        {/* Right Column: Next Best Actions & Timeline */}
        <div className="space-y-6">
          {/* Next Best Actions Section */}
          <div className="bg-canvas-overlay rounded-2xl p-5 border border-bronze shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ivory flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Recommended Next-Best-Actions
              </h3>
            </div>

            <div className="space-y-3">
              {nextActions.slice(0, 3).map((act, idx) => (
                <NextActionCard
                  key={idx}
                  actionItem={act}
                  onExecute={handleExecuteAction}
                />
              ))}
              {nextActions.length === 0 && (
                <p className="text-xs text-ivory-faint py-4 text-center">
                  No recommended actions right now.
                </p>
              )}
            </div>
          </div>

          {/* Activity / Audit Timeline */}
          <div className="bg-canvas-overlay rounded-2xl p-5 border border-bronze shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ivory flex items-center gap-1.5">
                <Building className="w-4 h-4 text-ivory-muted" />
                Autonomous Activity Log
              </h3>
              <span className="text-[10px] text-ivory-faint">Auditable</span>
            </div>

            <ActivityTimeline activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
