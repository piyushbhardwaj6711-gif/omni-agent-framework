import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import type { Message } from '../../services/types';

interface ChatMessageProps {
  message: Message;
  children?: React.ReactNode;
}

function formatTimestamp(ts: string): string {
  try {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function renderContent(content: string): React.ReactNode {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    let processed: React.ReactNode[] = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        processed.push(line.slice(lastIndex, match.index));
      }
      processed.push(
        <strong key={`b-${i}-${match.index}`} className="font-semibold">
          {match[1]}
        </strong>,
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      processed.push(line.slice(lastIndex));
    }
    if (processed.length === 0) {
      processed.push(line);
    }

    // Bullet points
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      return (
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-brand-400">•</span>
          <span>{processed.slice(0)}</span>
        </div>
      );
    }

    return (
      <React.Fragment key={i}>
        {processed}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function ChatMessage({ message, children }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-center px-4 py-2"
      >
        <span className="text-xs text-ivory-muted bg-canvas-raised border border-bronze-faint rounded-full px-3 py-1">
          {message.content}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-end gap-2 px-4 py-1.5 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-pill">
          <Bot className="h-4 w-4 text-canvas-deep" />
        </div>
      )}

      <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-brand-500 text-[#171411] rounded-2xl rounded-br-sm shadow-pill'
              : 'bg-canvas-overlay border border-bronze text-ivory rounded-2xl rounded-tl-sm shadow-pill'
          }`}
        >
          {isUser ? message.content : renderContent(message.content)}
        </div>

        {children && <div className="mt-2 w-full">{children}</div>}

        <span className="text-[10px] text-ivory-faint mt-1 px-1">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-canvas-raised border border-bronze flex items-center justify-center text-ivory-muted">
          <span className="text-xs font-semibold">You</span>
        </div>
      )}
    </motion.div>
  );
}
