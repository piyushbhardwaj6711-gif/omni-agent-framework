import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  quickReplies?: string[];
}

export default function ChatInput({
  onSend,
  disabled = false,
  quickReplies = [],
}: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-bronze-faint pb-1">
      {/* Quick replies */}
      {quickReplies.length > 0 && (
        <div className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-hide">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => {
                if (!disabled) onSend(reply);
              }}
              disabled={disabled}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-bronze text-peach-300 bg-canvas-raised hover:border-brand-500/50 hover:text-peach-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-center gap-2 px-4 py-3">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Apna sawaal puchiye... (Ask your question)"
          className="flex-1 px-4 py-2.5 rounded-xl border border-bronze bg-canvas-raised text-sm text-ivory placeholder-ivory-faint focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          aria-label="Send message"
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-500 text-canvas-deep flex items-center justify-center hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
