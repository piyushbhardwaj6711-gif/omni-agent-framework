import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowRight, Paperclip, Sparkles } from 'lucide-react';
import PondoMark from '../../shared/components/PondoMark';
import { getGreetingName } from '../../shared/constants';

interface HomeViewProps {
  /** Sends a prompt into the PONDO AI conversation (existing chat pipeline). */
  onAsk: (prompt: string) => void;
}

const SUGGESTED_PROMPT = 'Why did my bookings decrease last week?';

export default function HomeView({ onAsk }: HomeViewProps) {
  const [prompt, setPrompt] = useState('');
  const canSend = prompt.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setPrompt('');
    onAsk(trimmed);
  };

  return (
    <section className="relative max-w-6xl mx-auto w-full">
      {/* Stronger ambient layer for the home hero only */}
      <div aria-hidden className="absolute -top-24 -left-32 -z-10 pointer-events-none">
        <div className="w-[540px] h-[540px] rounded-full bg-[radial-gradient(circle,rgba(200,121,80,0.16),transparent_65%)] blur-3xl" />
      </div>
      <div aria-hidden className="absolute top-64 -right-40 -z-10 pointer-events-none">
        <div className="w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(232,185,154,0.09),transparent_65%)] blur-3xl" />
      </div>

      <div className="pt-8 sm:pt-14 lg:pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <PondoMark size="xl" />

          <h2 className="mt-9 text-2xl sm:text-3xl font-semibold text-brand-400 tracking-tight">
            Hi {getGreetingName()},
          </h2>
          <h1 className="mt-1 text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-ivory tracking-tight leading-[1.08]">
            What would you like to do today?
          </h1>
          <p className="mt-4 text-base sm:text-lg text-ivory-muted">
            Ask anything, get insights, or take action with Pondo AI.
          </p>
        </motion.div>

        {/* Prompt composer + AI Assistant card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
          className="mt-12 flex flex-col xl:flex-row gap-6 items-stretch"
        >
          {/* Composer — wired to the existing PONDO AI chat pipeline */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex items-center gap-2 rounded-full bg-canvas-soft/90 backdrop-blur border border-bronze pl-3 pr-2 py-2 shadow-pill focus-within:border-brand-500/50 transition-colors"
          >
            {/* Attachments are not supported by the backend yet — the control
                stays visible but disabled rather than faking behaviour. */}
            <span
              title="Attachments coming soon"
              className="p-2.5 rounded-full text-ivory-faint"
            >
              <Paperclip className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything about your business..."
              aria-label="Ask PONDO AI"
              className="flex-1 min-w-0 bg-transparent text-[15px] text-ivory placeholder-ivory-faint focus:outline-none px-1"
            />
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send prompt"
              className="shrink-0 w-11 h-11 rounded-full bg-brand-500 text-canvas-deep flex items-center justify-center hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </form>

          {/* PONDO AI Assistant suggestion card */}
          <button
            onClick={() => onAsk(SUGGESTED_PROMPT)}
            className="group w-full xl:w-[340px] shrink-0 text-left rounded-3xl bg-gradient-to-br from-peach-100 via-peach-200 to-peach-400 p-6 relative overflow-hidden hover:brightness-[1.03] active:scale-[0.99] transition-all shadow-card focus-visible:outline-brand-500"
          >
            {/* Soft inner sheen */}
            <div
              aria-hidden
              className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-white/20 blur-2xl pointer-events-none"
            />
            <div className="relative flex items-center gap-2.5">
              <Sparkles className="w-[18px] h-[18px] text-brand-600" />
              <span className="text-sm font-semibold text-[#171411]">
                Pondo AI Assistant
              </span>
            </div>
            <p className="relative mt-4 text-lg font-medium text-[#2E180E] leading-snug">
              &ldquo;{SUGGESTED_PROMPT}&rdquo;
            </p>
            <div className="relative mt-6 flex items-end justify-between gap-4">
              <p className="text-sm text-[#5C4A3B] leading-snug">
                Get insights and actionable steps.
              </p>
              <span className="shrink-0 w-10 h-10 rounded-full bg-[#171411] text-peach-200 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-[18px] h-[18px]" />
              </span>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
