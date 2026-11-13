import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, LayoutGrid } from 'lucide-react';
import Sidebar, { type View } from './shared/components/Sidebar';
import TopBar from './shared/components/TopBar';
import HomeView from './features/home/HomeView';
import ChatView from './features/chat/ChatView';
import DashboardView from './features/dashboard/DashboardView';
import LeadsView from './features/leads/LeadsView';
import SettingsView from './features/settings/SettingsView';
import ComingSoonView from './features/placeholder/ComingSoonView';
import VisionView from './features/vision/VisionView';

export default function App() {
  const [activeView, setActiveView] = useState<View>('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  /** Prompt handed from the Home composer into a fresh chat session. */
  const [chatPrompt, setChatPrompt] = useState<string | null>(null);
  /** Bumped on every hand-off so ChatView remounts with a clean session. */
  const [chatKey, setChatKey] = useState(0);

  const navigate = (view: View) => {
    setActiveView(view);
    setMobileNavOpen(false);
  };

  /** Home composer / assistant card → live PONDO AI conversation. */
  const askPondo = (prompt: string) => {
    setChatPrompt(prompt);
    setChatKey((k) => k + 1);
    setActiveView('chat');
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-canvas font-sans">
      {/* Ambient warm background — subtle brand waves across the workspace */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-32 w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,rgba(200,121,80,0.13),transparent_65%)] blur-3xl" />
        <div className="absolute top-1/3 -left-48 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(232,185,154,0.06),transparent_65%)] blur-3xl" />
        <div className="absolute -bottom-64 right-1/4 w-[680px] h-[680px] rounded-full bg-[radial-gradient(circle,rgba(200,121,80,0.07),transparent_65%)] blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block sticky top-0 h-screen z-30">
          <Sidebar activeView={activeView} onNavigate={navigate} />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-label="Close navigation"
                onClick={() => setMobileNavOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 lg:hidden cursor-default"
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                className="fixed inset-y-0 left-0 z-50 lg:hidden"
              >
                <Sidebar
                  activeView={activeView}
                  onNavigate={navigate}
                  mobile
                  onClose={() => setMobileNavOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main column — fixed viewport height; pages scroll inside <main> */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <TopBar
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onNavigate={navigate}
          />

          <main className="flex-1 min-h-0 px-4 sm:px-8 lg:px-12 pb-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView === 'chat' ? `chat-${chatKey}` : activeView}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className={activeView === 'chat' ? 'h-full' : ''}
              >
                {activeView === 'home' && <HomeView onAsk={askPondo} />}

                {activeView === 'chat' && (
                  <ChatView
                    key={chatKey}
                    initialPrompt={chatPrompt ?? undefined}
                  />
                )}

                {activeView === 'analytics' && <DashboardView />}

                {activeView === 'leads' && <LeadsView />}

                {activeView === 'agents' && (
                  <ComingSoonView
                    icon={Sparkles}
                    title="AI Agents"
                    description="Design your own business agents — assistants that understand your business, answer customers and take action on your behalf. This area unlocks once the agent-building backend is connected."
                    onNavigate={navigate}
                  />
                )}

                {activeView === 'automations' && (
                  <ComingSoonView
                    icon={Zap}
                    title="Automations"
                    description="Put repetitive work on autopilot — follow-ups, reminders, reports and workflows that run themselves. This area unlocks once the workflow engine is connected."
                    onNavigate={navigate}
                  />
                )}

                {activeView === 'templates' && (
                  <ComingSoonView
                    icon={LayoutGrid}
                    title="Templates"
                    description="Ready-made playbooks for your industry — lead follow-ups, booking flows, outreach sequences and more. This area unlocks once the template library is connected."
                    onNavigate={navigate}
                  />
                )}

                {activeView === 'settings' && <SettingsView onNavigate={navigate} />}

                {activeView === 'vision' && <VisionView />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
