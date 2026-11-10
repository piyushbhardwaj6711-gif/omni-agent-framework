import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  LayoutDashboard,
  Rocket,
  Building2,
  Sparkles,
  Terminal,
} from 'lucide-react';
import ChatView from './features/chat/ChatView';
import DashboardView from './features/dashboard/DashboardView';
import VisionView from './features/vision/VisionView';
import SimulatedBanner from './shared/components/SimulatedBanner';

type Tab = 'chat' | 'dashboard' | 'vision';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Demo Notification Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-medium text-amber-800">
          <SimulatedBanner />
          <span>
            Operating in Pune Market Demo mode. All property inventory, lead scores & predictions are simulated.
          </span>
        </div>
      </div>

      {/* Main App Navigation Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-gray-900">
                    EstateIQ
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                    V0 DEMO
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 font-medium -mt-0.5">
                  Autonomous AI Real Estate Operating Layer
                </div>
              </div>
            </div>

            {/* Tab Navigation Controls */}
            <nav className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Sales Chat</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Sales Intelligence</span>
              </button>

              <button
                onClick={() => setActiveTab('vision')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'vision'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Rocket className="w-3.5 h-3.5 text-purple-600" />
                <span>Where EstateIQ Goes Next</span>
              </button>
            </nav>

            {/* Right Tenant Status Indicator */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right text-xs">
                <div className="font-semibold text-gray-800">Kohinoor Realtors</div>
                <div className="text-[10px] text-emerald-600 font-medium">Tenant #001 • Online</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                KR
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <ChatView />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <DashboardView />
            </motion.div>
          )}

          {activeTab === 'vision' && (
            <motion.div
              key="vision"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <VisionView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">EstateIQ V0</span>
            <span>•</span>
            <span>Small Product Surface + Future-Proof Core</span>
          </div>
          <div className="text-[11px] text-gray-400">
            Hexagonal Domain Architecture • India-First (Hinglish / RERA / INR Lakhs)
          </div>
        </div>
      </footer>
    </div>
  );
}
