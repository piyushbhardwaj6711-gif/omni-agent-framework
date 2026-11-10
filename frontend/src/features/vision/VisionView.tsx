import { motion } from 'framer-motion';
import {
  MessageSquare,
  Database,
  PhoneCall,
  Clock,
  Cpu,
  BrainCircuit,
  Target,
  BarChart3,
  TrendingUp,
  Layers,
  Workflow,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Badge from '../../shared/components/Badge';

interface CapabilityCard {
  title: string;
  description: string;
  icon: any;
  category: string;
  stage: 'Phase 1-3' | 'Phase 4-6' | 'Phase 7-9';
  features: string[];
}

const CAPABILITIES: CapabilityCard[] = [
  {
    title: 'WhatsApp Business Cloud API',
    description: 'Direct Meta Cloud API webhook with 24-hr messaging window, media handling, and automated templates.',
    icon: MessageSquare,
    category: 'Omnichannel',
    stage: 'Phase 1-3',
    features: ['HSM Templates', 'Interactive Buttons', 'DND Compliance', 'Media Broadsheet Sharing'],
  },
  {
    title: 'Bi-Directional CRM Sync',
    description: 'Zero-code adapters for LeadSquared, Sell.Do, Zoho, Salesforce and HubSpot with event deduplication.',
    icon: Database,
    category: 'Integrations',
    stage: 'Phase 1-3',
    features: ['Real-time Webhooks', 'Stage Transitions', 'Activity Logging', 'Task Auto-creation'],
  },
  {
    title: 'Voice AI & Telephony',
    description: 'Autonomous conversational voice agent powered by Whisper + low-latency TTS for instant outbound call qualification.',
    icon: PhoneCall,
    category: 'Omnichannel',
    stage: 'Phase 4-6',
    features: ['Exotel/Twilio Bridge', 'Objection Analysis', 'Talk-to-Listen Ratio', 'Live Agent Transfer'],
  },
  {
    title: 'Multi-Agent LangGraph Core',
    description: 'Supervisor-specialist agent network: Property Search, Knowledge RAG, Negotiation, and Finance specialists.',
    icon: Cpu,
    category: 'Agent System',
    stage: 'Phase 4-6',
    features: ['State Checkpointing', 'Human-in-the-loop Interrupts', 'SSE Streaming', 'Step & Token Budgets'],
  },
  {
    title: 'Calibrated Conversion ML',
    description: 'LightGBM + PyTorch Tabular ensemble with Optuna tuning and isotonic calibration for 30/60/90-day purchase prediction.',
    icon: BrainCircuit,
    category: 'Machine Learning',
    stage: 'Phase 4-6',
    features: ['SHAP Global & Local', 'Brier Score ECE < 0.05', 'Festive Seasonality', 'Fairness Slices'],
  },
  {
    title: 'Causal Uplift & Profit Engine',
    description: 'T-Learner and Contextual Bandits to optimize Expected Profit: EP(i, a) = P(convert|i, a) × NetValue(i) - Cost(a).',
    icon: TrendingUp,
    category: 'Decision Engine',
    stage: 'Phase 7-9',
    features: ['Counterfactual Policy', 'Dynamic Discount Advisor', 'Inventory Cost Balancing', 'OR-Tools Allocation'],
  },
  {
    title: 'Two-Tower Property Matcher',
    description: 'Deep neural retrieval comparing buyer intent embeddings with property inventory vectors in pgvector.',
    icon: Target,
    category: 'Machine Learning',
    stage: 'Phase 4-6',
    features: ['HNSW Indexing', 'Cross-Encoder Rerank', 'Strict Constraint Filtering', 'Cold-Start Fallback'],
  },
  {
    title: 'Event-Driven Drip Nurture',
    description: 'Proactive background nurture via Celery + Redis triggered by price drops, new inventory, or cooling signals.',
    icon: Clock,
    category: 'Automation',
    stage: 'Phase 1-3',
    features: ['Quiet-Hours Respect', 'Frequency Capping', 'Decay Curves', 'Opt-out Engine'],
  },
  {
    title: 'Revenue Simulator & Forecast',
    description: 'Monte Carlo pipeline forecast with what-if sensitivity sliders (response latency, discount elasticity).',
    icon: BarChart3,
    category: 'Intelligence',
    stage: 'Phase 7-9',
    features: ['Confidence Intervals', 'Cohort Decay Analysis', 'Lead Source Attribution', 'CAC Payback Estimation'],
  },
  {
    title: 'Human-in-the-Loop Policy Gate',
    description: 'Zero autonomous commitments: discounts, price modifications, and payment links require manager sign-off.',
    icon: ShieldAlert,
    category: 'Governance',
    stage: 'Phase 1-3',
    features: ['T0-T4 Risk Tiers', 'Maker-Checker Workflows', 'Audit Replay', 'Cryptographic Proof'],
  },
  {
    title: 'Multi-Tenant SaaS Isolation',
    description: 'Postgres Row-Level Security (RLS) ensuring strict isolation across developers, brokerages, and channel partners.',
    icon: Layers,
    category: 'Platform Core',
    stage: 'Phase 1-3',
    features: ['Tenant Namespacing', 'Role-Based Access (RBAC)', 'Per-Tenant Model Tuners', 'DPDP 2023 Compliance'],
  },
  {
    title: 'Multi-Business Operating Layer',
    description: 'The horizontal business operating architecture designed to extend EstateIQ capabilities to adjacent verticals.',
    icon: Building2,
    category: 'Platform Vision',
    stage: 'Phase 7-9',
    features: ['Swappable Domain Packs', 'Generic Action Protocol', 'Universal CRM Connectors', 'Enterprise Orchestrator'],
  },
];

export default function VisionView() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <Badge variant="info" size="sm" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
            EstateIQ Roadmap & Architectural Blueprint
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            From Vertical Real Estate AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-200">
              To Enterprise AI Operating Layer
            </span>
          </h1>

          <p className="text-sm sm:text-base text-indigo-200/90 leading-relaxed font-light">
            EstateIQ V0 demonstrates the fundamental truth: <strong>raw inquiries can be autonomously understood, grounded in real inventory, and converted into prioritized business opportunities</strong>. Below is the planned architecture progression from V0 Demo to the full Enterprise Platform.
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs text-indigo-300">
            <span className="flex items-center gap-1 font-semibold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> V0 Demo Built
            </span>
            <span>→</span>
            <span>V1 Assistant</span>
            <span>→</span>
            <span>V2 Platform</span>
            <span>→</span>
            <span>V3 Multi-Tenant SaaS</span>
            <span>→</span>
            <span>V4 Multi-Agent</span>
            <span>→</span>
            <span>V5 AI OS</span>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Evolution Timeline Graphic */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Planned Evolution Stages</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            How EstateIQ's modular architecture scales cleanly without throwing away early foundations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: 'V0',
              title: 'Interactive Demo',
              desc: 'Grounded Hinglish NLU, Pune mock inventory, calibrated lead scoring, salesperson dashboard.',
              current: true,
            },
            {
              step: 'V1',
              title: 'Sales Assistant',
              desc: 'WhatsApp Cloud API integration, Google Calendar sync, single-broker production deployment.',
              current: false,
            },
            {
              step: 'V2',
              title: 'Real Estate Platform',
              desc: 'Postgres pgvector hybrid RAG, CRM bi-directional sync (LeadSquared, Sell.Do), RERA document ingest.',
              current: false,
            },
            {
              step: 'V3',
              title: 'Multi-Tenant SaaS',
              desc: 'Row-Level Security, custom tenant branding, broker assignment algorithms, automated billing.',
              current: false,
            },
            {
              step: 'V4-V5',
              title: 'Multi-Agent AI OS',
              desc: 'LangGraph multi-agent network, Causal Uplift ML, cross-industry domain packs.',
              current: false,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border relative flex flex-col justify-between ${
                item.current
                  ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black px-2 py-0.5 rounded ${
                    item.current ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.step}
                  </span>
                  {item.current && (
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mt-2">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-200/60 flex items-center text-[10px] font-semibold text-gray-400">
                <span>Phase {idx * 2}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of 12 Future Capabilities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">12 Core Future Capabilities</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Architectural components specified in the EstateIQ Master Build Brief
            </p>
          </div>
          <Badge variant="default" size="sm">
            Architected for V1 - V5
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {cap.stage}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {cap.description}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    {cap.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center gap-1.5 text-xs text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>{cap.category}</span>
                  <span className="text-indigo-600 font-medium flex items-center gap-1">
                    Spec Ready <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
