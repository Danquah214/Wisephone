import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, MessageSquare, Loader2, Info } from 'lucide-react';
import { ChatMessage } from '../types';

interface WiseAssistantProps {
  onSendMessage: (history: { role: string; content: string }[]) => Promise<string>;
  onQuickSelectProduct: (productName: string) => void;
}

export default function WiseAssistant({ onSendMessage, onQuickSelectProduct }: WiseAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Akwaaba! I'm the **Wise Tech Assistant** 📱.\n\nI can recommend smartphones, check compatible high-speed chargers, find active accessories, or estimate Ghana delivery charges!\n\nWhat are you shopping for today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts
  const suggestions = [
    "Recommend iPhone",
    "Best seller Galaxy",
    "Earbuds & Chargers",
    "Accra delivery fee"
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Format historical messages for our REST API (role: user/model)
    const formattedHistory = [...messages, userMessage].map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      content: m.text
    }));

    try {
      const gResult = await onSendMessage(formattedHistory);
      
      const assistantMessage: ChatMessage = {
        id: `m-a-${Date.now()}`,
        sender: 'assistant',
        text: gResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `m-err-${Date.now()}`,
        sender: 'assistant',
        text: "I'm having trouble connecting to high-speed communication systems right now. Check your internet connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (sug: string) => {
    handleSend(sug);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-55 font-sans">
      
      {/* FLOATING ACTION TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all text-sm relative group animate-fade-in"
          id="assistant-open-fab"
        >
          <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          <MessageSquare className="h-6 w-6" />
          
          <div className="absolute right-16 bg-gray-900/90 text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm shadow border border-white/5">
            Discuss with Wise AI Assistant
          </div>
        </button>
      )}

      {/* CHAT WINDOW BOX */}
      {isOpen && (
        <div className="w-[350px] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in">
          
          {/* HEADER HEADER */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-none">SECURE SMART BOT</p>
                <h3 className="text-sm font-extrabold mt-0.5 tracking-tight">Wise Shopping AI</h3>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-white/10 p-1 hover:bg-white/20 text-white/80"
              id="assistant-close-btn"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* CHAT BUBBLES CHANNEL */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/40">
            {messages.map(msg => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div key={msg.id} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} space-y-1`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed font-medium shadow-sm border ${
                    isAssistant 
                      ? 'bg-white text-gray-800 border-gray-100 rounded-tl-none' 
                      : 'bg-blue-600 text-white border-blue-500 rounded-tr-none'
                  }`}>
                    {/* Render simple simulation of markdown style bullet points safely */}
                    <div className="whitespace-pre-line">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                          return <div key={lIdx} className="pl-3.5 relative py-0.5"><span className="absolute left-1">•</span>{line.replace(/^[-*]\s+/, '')}</div>;
                        }
                        // Simple check for bold markers
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <span key={lIdx}>
                              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold">{p}</strong> : p)}
                              <br/>
                            </span>
                          );
                        }
                        return <span key={lIdx}>{line}<br/></span>;
                      })}
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-400 font-mono px-1">{msg.timestamp}</span>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex items-center space-x-1.5 text-xs text-gray-400 font-mono pl-1 animate-pulse">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                <span>Wise AI is compiling products list...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* SUGGESTION SHORTCUT PANEL */}
          <div className="p-2 border-t border-gray-100 flex flex-wrap gap-1.5 bg-white">
            {suggestions.map(sug => (
              <button
                key={sug}
                onClick={() => handleSuggestionClick(sug)}
                className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-150 text-[10px] text-gray-500 font-bold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-sans shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* CHAT INPUT DISPATCH FORM */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            className="p-3 border-t border-gray-100 flex items-center space-x-2 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about iPhone 15 specs, deliveries..."
              className="flex-1 rounded-xl bg-gray-50 border border-gray-150 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-gray-900"
              id="assistant-input-box"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-300 text-white p-2.5 transition-all shrink-0 shadow shadow-blue-500/10"
              id="assistant-input-submit"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
