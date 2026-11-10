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

export default function ChatView() {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }, []);

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
      } catch {
        const welcomeMsg: Message = {
          id: 'welcome',
          role: 'agent',
          content: WELCOME_FALLBACK,
          timestamp: new Date().toISOString(),
        };
        setEntries([{ message: welcomeMsg }]);
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

  const handleBookVisit = (property: Property) => {
    handleSend(`Book a site visit for ${property.name} this Saturday`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 px-4 sm:px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-white font-bold text-lg leading-tight">
              EstateIQ
            </h1>
            <p className="text-white/70 text-xs">AI Sales Assistant</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1">
            <Wifi className="h-3 w-3 text-emerald-300" />
            <span className="text-xs text-emerald-200 font-medium">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-2.5 flex items-center gap-2"
          >
            {notification.includes('Lead') && (
              <UserPlus className="h-4 w-4 text-emerald-500" />
            )}
            {notification.includes('Visit') && (
              <CalendarCheck className="h-4 w-4 text-brand-500" />
            )}
            <span className="text-sm font-medium text-gray-800">
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
