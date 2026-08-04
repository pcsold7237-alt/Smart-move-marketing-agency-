import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, MessageSquare, User, Loader2, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';

interface AiChatProps {
  onOpenAudit: () => void;
}

export const AiStrategistChat: React.FC<AiChatProps> = ({ onOpenAudit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "👋 Hi! I'm AURA, Smart Move's AI Growth Strategist. Ask me anything about scaling Meta ads, video hooks, web conversion, or our agency services!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "How to scale Meta ads to $10k/day?",
    "What is Smart Move's average ROAS?",
    "How do I improve landing page CVR?",
    "Which package is right for $20k spend?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6)
        })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || data.fallbackText || "I'd love to analyze your marketing strategy! Feel free to book a free 1-on-1 growth audit with our team.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I'm experiencing high server volume. Feel free to claim your free 15-point audit directly using our contact booking form above!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Bubble & WhatsApp */}
      <div className={`fixed right-6 z-40 flex flex-col gap-4 items-end transition-all duration-300 ${isOpen ? 'bottom-[580px]' : 'bottom-6'}`}>
        
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/923202479323"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group cursor-pointer relative"
          title="Chat with us on WhatsApp: +92 320 2479323"
        >
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-gray-900 border border-[#25D366]/40 text-white text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            WhatsApp: +92 320 2479323
          </span>
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>

        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-black font-extrabold text-xs flex items-center gap-2.5 shadow-[0_0_30px_rgba(183,255,0,0.4)] hover:shadow-[0_0_45px_rgba(183,255,0,0.6)] hover:scale-105 transition-all cursor-pointer border border-[#B7FF00]/40"
            aria-label="Open AI Growth Strategist Chatbot"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-black group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-black animate-ping" />
            </div>
            <span className="hidden sm:inline">AI Growth Strategist</span>
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </button>
        )}
      </div>

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[550px] rounded-3xl glass-card border border-[#B7FF00]/40 shadow-2xl flex flex-col overflow-hidden animate-fadeIn backdrop-blur-2xl">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0B0F17] via-gray-950 to-[#0B0F17] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B7FF00] to-[#9BE000] p-[1px] shadow-[0_0_15px_rgba(183,255,0,0.3)]">
                <div className="w-full h-full bg-[#0B0F17] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#B7FF00]" />
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  AURA AI Strategist
                  <span className="px-1.5 py-0.2 rounded bg-[#B7FF00]/20 text-[#B7FF00] text-[9px] font-mono border border-[#B7FF00]/30">
                    Gemini 3.6
                  </span>
                </div>
                <div className="text-[10px] text-[#B7FF00] flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF00] animate-pulse" />
                  Online • Ready to analyze
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                    msg.sender === 'user' ? 'bg-[#B7FF00] text-black font-bold' : 'bg-[#B7FF00]/20 text-[#B7FF00] border border-[#B7FF00]/40'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4 text-black" /> : <Bot className="w-4 h-4 text-[#B7FF00]" />}
                </div>

                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-black font-semibold rounded-tr-none'
                      : 'glass-card border border-white/10 text-gray-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[9px] mt-1 text-right font-mono ${msg.sender === 'user' ? 'text-black/70' : 'text-gray-400'}`}>{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#B7FF00] p-3 rounded-2xl glass-card border border-[#B7FF00]/20 max-w-[70%] font-mono">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AURA is analyzing ad metrics...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pill Container */}
          <div className="px-4 py-2 border-t border-white/5 bg-black/40 overflow-x-auto flex gap-1.5 no-scrollbar">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-gray-300 hover:text-[#B7FF00] hover:border-[#B7FF00]/40 shrink-0 cursor-pointer transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat CTA Banner */}
          <div className="px-4 py-2 bg-gradient-to-r from-gray-950 to-[#0B0F17] border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-gray-300">Want human strategists to review your ad account?</span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAudit();
              }}
              className="px-2.5 py-1 rounded-lg bg-[#B7FF00] text-black text-[10px] font-extrabold flex items-center gap-1 cursor-pointer hover:bg-[#CFFF33]"
            >
              Book Audit <ArrowRight className="w-3 h-3 text-black" />
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-gray-950 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Meta ads, CVR, or pricing..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-[#B7FF00] outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#B7FF00] to-[#9BE000] text-black disabled:opacity-40 cursor-pointer hover:opacity-90 font-bold"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
