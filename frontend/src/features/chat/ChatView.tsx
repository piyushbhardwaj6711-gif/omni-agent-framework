import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Wifi, UserPlus, CalendarCheck } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import PropertyCard from './PropertyCard';
import TypingIndicator from './TypingIndicator';
import { api } from '../../services/api';
import type { Message, Property, AgentResponse } from '../../services/types';

const QUICK_REPLIES = [
  '3BHK in Baner under 90L',
  'EMI kitna hoga?',
  'Saturday visit book karo',
  'Kharadi mein 2BHK dikhao',
];

const WELCOME_FALLBACK =
  'Namaste! 🙏 Main EstateIQ AI Sales Assistant hoon. Aap mujhe property se related koi bhi sawaal puch sakte hain — BHK, location, budget, EMI, ya site visit booking. Batayiye, aapko kaisi property chahiye?';

interface ChatEntry {
  message: Message;
  properties?: Property[];
  metadata?: Record<string, unknown>;
}

interface ChatViewProps {
  /**
   * Optional prompt handed off from the Home composer. Sent automatically
   * once the conversation is initialised. Existing behaviour is unchanged
   * when this prop is not provided.
   */
  initialPrompt?: string;
}

export default function ChatView({ initialPrompt }: ChatViewProps) {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const initialPromptRef = useRef<string | null>(initialPrompt ?? null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }, []);

  const handleSendRef = useRef<(text: string) => Promise<void>>(async () => {});

  // Initialize conversation
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        const res = await api.startConversation();
        setConversationId(res.conversation_id);
        const welcomeMsg: Message = {
          id: 'welcome',
          role: 'agent',
          content: res.welcome_message || WELCOME_FALLBACK,
          timestamp: new Date().toISOString(),
        };
        setEntries([{ message: welcomeMsg }]);

        // Hand-off from the Home composer: send the prompt through the
        // existing pipeline once the conversation is ready.
        if (initialPromptRef.current) {
          const prompt = initialPromptRef.current;
          initialPromptRef.current = null;
          handleSendRef.current(prompt);
        }
      } catch {
        const welcomeMsg: Message = {
          id: 'welcome',
          role: 'agent',
          content: WELCOME_FALLBACK,
          timestamp: new Date().toISOString(),
        };
        setEntries([{ message: welcomeMsg }]);

        if (initialPromptRef.current) {
          const prompt = initialPromptRef.current;
          initialPromptRef.current = null;
          handleSendRef.current(prompt);
        }
      }
    })();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [entries, isTyping, scrollToBottom]);

  // Show temporary notification
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setEntries((prev) => [...prev, { message: userMsg }]);
    setIsTyping(true);

    try {
      const response: AgentResponse = conversationId
        ? await api.sendMessage(conversationId, text)
        : await api.sendMessage('demo', text);

      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: response.message,
        timestamp: new Date().toISOString(),
        metadata: response.metadata,
      };

      setEntries((prev) => [
        ...prev,
        {
          message: agentMsg,
          properties: response.properties,
          metadata: response.metadata as Record<string, unknown> | undefined,
        },
      ]);

      // Detect lead creation or site visit booking
      if (response.actions_taken) {
        for (const action of response.actions_taken) {
          if (action.toLowerCase().includes('lead')) {
            showNotification('✅ Lead Created Successfully');
          }
          if (action.toLowerCase().includes('visit') || action.toLowerCase().includes('schedule')) {
            showNotification('📅 Site Visit Booked!');
          }
        }
      }
      if (response.lead_update) {
        showNotification('✅ Lead Updated');
      }
    } catch {
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: 'agent',
        content:
          'Sorry, I encountered an error connecting to the server. Please make sure the backend is running at http://localhost:8000 and try again.',
        timestamp: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, { message: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Keep the ref in sync so the init effect can trigger the first send.
  useEffect(() => {
    handleSendRef.current = handleSend;
  });

  const handleBookVisit = (property: Property) => {
    handleSend(`Book a site visit for ${property.name} this Saturday`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-1 py-4 border-b border-bronze-faint">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
          <Bot className="h-5 w-5 text-canvas-deep" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-ivory text-lg leading-tight">
            PONDO AI
          </h1>
          <p className="text-ivory-faint text-xs">Business Assistant</p>
        </div>
        <div className="flex items-center gap-1.5 bg-success-100 border border-success-200 rounded-full px-3 py-1">
          <Wifi className="h-3 w-3 text-success-400" />
          <span className="text-xs text-success-400 font-medium">Online</span>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-canvas-raised border border-bronze shadow-card rounded-xl px-4 py-2.5 flex items-center gap-2"
          >
            {notification.includes('Lead') && (
              <UserPlus className="h-4 w-4 text-success-500" />
            )}
            {notification.includes('Visit') && (
              <CalendarCheck className="h-4 w-4 text-brand-400" />
            )}
            <span className="text-sm font-medium text-ivory">
              {notification}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 space-y-1"
      >
        {entries.map((entry) => (
          <div key={entry.message.id}>
            <ChatMessage message={entry.message}>
              {/* Inline property cards */}
              {entry.properties && entry.properties.length > 0 && (
                <div className="grid grid-cols-1 gap-2.5 mt-1">
                  {entry.properties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      matchScore={
                        entry.metadata?.match_scores
                          ? (entry.metadata.match_scores as Record<string, number>)[prop.id]
                          : undefined
                      }
                      emiEstimate={
                        entry.metadata?.emi_estimates
                          ? (entry.metadata.emi_estimates as Record<string, string>)[prop.id]
                          : undefined
                      }
                      onBookVisit={handleBookVisit}
                    />
                  ))}
                </div>
              )}
            </ChatMessage>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isTyping}
        quickReplies={QUICK_REPLIES}
      />
    </div>
  );
}
