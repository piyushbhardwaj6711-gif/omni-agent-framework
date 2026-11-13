import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Bell, ChevronDown, Route } from 'lucide-react';
import SimulatedBanner from './SimulatedBanner';
import { CURRENT_USER, TENANT } from '../constants';
import type { View } from './Sidebar';

interface TopBarProps {
  onOpenMobileNav: () => void;
  onNavigate: (view: View) => void;
}

export default function TopBar({ onOpenMobileNav, onNavigate }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative z-30 flex items-center justify-between h-16 px-4 sm:px-8 lg:px-12">
      {/* Mobile: hamburger */}
      <button
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="lg:hidden p-2 -ml-2 rounded-xl text-ivory-muted hover:text-ivory hover:bg-white/[0.06] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="hidden lg:block" />

      {/* Right cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo-mode disclosure */}
        <span className="hidden md:block">
          <SimulatedBanner />
        </span>

        {/* Notifications — no notification service exists yet; control is
            intentionally disabled rather than faked. */}
        <button
          disabled
          title="Notifications coming soon"
          aria-label="Notifications (unavailable)"
          className="relative p-2.5 rounded-full bg-canvas-raised/60 border border-bronze-faint text-ivory-faint cursor-not-allowed"
        >
          <Bell className="w-[18px] h-[18px]" />
        </button>

        {/* Account menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 p-1.5 sm:pl-2.5 sm:pr-2 rounded-full bg-canvas-raised/60 border border-bronze-faint hover:border-bronze-light transition-colors"
          >
            <span className="hidden sm:block text-sm font-semibold text-ivory">
              {CURRENT_USER.name}
            </span>
            <span className="w-7 h-7 rounded-full bg-peach-300 text-[#171411] flex items-center justify-center text-[11px] font-bold">
              {CURRENT_USER.initials}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-ivory-faint transition-transform ${
                menuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                {/* Click-away layer */}
                <button
                  aria-label="Close menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  role="menu"
                  className="absolute right-0 top-full mt-2 z-50 w-64 bg-canvas-raised border border-bronze rounded-2xl shadow-card overflow-hidden"
                >
                  <div className="px-4 py-3.5 border-b border-bronze-faint">
                    <div className="text-sm font-semibold text-ivory">
                      {CURRENT_USER.name}
                    </div>
                    <div className="text-xs text-ivory-faint mt-0.5">
                      {CURRENT_USER.role}
                    </div>
                  </div>
                  <div className="px-4 py-3 border-b border-bronze-faint">
                    <div className="text-xs text-ivory-faint">Workspace</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-ivory">
                        {TENANT.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-success-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                        {TENANT.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-ivory-faint mt-0.5">
                      Tenant #{TENANT.id}
                    </div>
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate('vision');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-ivory-muted hover:text-ivory hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <Route className="w-4 h-4 text-ivory-faint" />
                    Product Roadmap
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
