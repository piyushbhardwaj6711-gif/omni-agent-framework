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
import SimulatedBanner from '../../shared/components/SimulatedBanner';
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
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Salesperson Intelligence Dashboard
            </h1>
            <SimulatedBanner />
          </div>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            <span>Broker: <strong>Rahul Sharma</strong> (Senior Sales Consultant)</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Multi-Tenant Ready
            </span>
            <span>•</span>
            <span className="text-gray-400">Market: Pune, MH</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 shadow-xs transition-colors"
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
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-2.5 rounded-lg flex items-center justify-between shadow-xs"
        >
          <span>✅ {bannerAlert}</span>
        </motion.div>
      )}

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900">
            {data?.total_leads || 4}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Active conversations</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Hot Leads</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600">
            {data?.hot_leads || 2}
          </div>
          <div className="text-[11px] text-rose-400 mt-0.5">Score &gt; 75 / 100</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Warm Leads</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">
            {data?.warm_leads || 1}
          </div>
          <div className="text-[11px] text-amber-500 mt-0.5">Score 45 - 75</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-blue-400">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Cold Leads</span>
            <Snowflake className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-600">
            {data?.cold_leads || 1}
          </div>
          <div className="text-[11px] text-blue-400 mt-0.5">Exploratory stage</div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Pipeline Est.</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">
            ₹6.8 Cr
          </div>
          <div className="text-[11px] text-emerald-500 mt-0.5">Calibrated Value</div>
        </Card>
      </div>

      {/* Main Grid: Leads on Left (2/3), Next Actions & Timeline on Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Prioritized Sales Pipeline
              </h2>
              <p className="text-xs text-gray-500">
                Ranked by conversion probability and expected deal value
              </p>
            </div>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-md">
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
          </div>
        </div>

        {/* Right Column: Next Best Actions & Timeline */}
        <div className="space-y-6">
          {/* Next Best Actions Section */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
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
            </div>
          </div>

          {/* Activity / Audit Timeline */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-gray-700" />
                Autonomous Activity Log
              </h3>
              <span className="text-[10px] text-gray-400">Auditable</span>
            </div>

            <ActivityTimeline activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
