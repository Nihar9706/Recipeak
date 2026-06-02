import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, Clock, ChefHat } from 'lucide-react';
import { useAISearch, useAIHistory } from '../hooks/useData';
import type { AISearchResponse } from '../types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  recipes?: AISearchResponse['recipes'];
  timestamp: Date;
}

export default function AISearchPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const aiSearch = useAISearch();
  const { data: history } = useAIHistory();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (query?: string) => {
    const q = query || input.trim();
    if (!q) return;

    const userMsg: ChatMessage = { role: 'user', content: q, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const result = await aiSearch.mutateAsync(q);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: result.response,
        recipes: result.recipes,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  const suggestedQueries = [
    'High protein breakfast under 400 calories',
    'Pre-match meal for a cricket player',
    'Fat loss dinner that is vegetarian',
    'Recovery meal after swimming training',
    'Carb loading recipe for cyclists',
    'Quick easy meal for weightlifters',
  ];

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
            <Sparkles size={28} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3 text-text">AI Recipe Assistant</h1>
          <p className="text-text-muted text-lg max-w-lg mx-auto">
            Describe what you're looking for and I'll find the perfect recipes from our database.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-bg-card border border-border overflow-hidden flex flex-col"
                 style={{ minHeight: '60vh' }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <ChefHat size={44} className="text-text-dim mx-auto mb-4" />
                    <p className="text-text-muted text-lg mb-6">Try one of these to get started:</p>
                    <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                      {suggestedQueries.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(q)}
                          className="px-4 py-2.5 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-sm text-text-muted
                                   hover:border-primary/30 hover:text-primary transition-colors font-medium"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] ${msg.role === 'user'
                        ? 'bg-primary/10 border border-primary/20 text-text'
                        : 'bg-accent-warm/50 border border-border text-text'
                      } rounded-2xl p-5`}>
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={14} className="text-primary" />
                            <span className="text-xs font-semibold text-primary">Recipeak AI</span>
                          </div>
                        )}
                        <div className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                        {/* Matched recipes */}
                        {msg.recipes && msg.recipes.length > 0 && (
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {msg.recipes.map((r) => (
                              <Link
                                key={r._id}
                                to={`/recipes/${r._id}`}
                                className="flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-border
                                         hover:border-primary/30 transition-colors"
                              >
                                <img
                                  src={r.imageUrl}
                                  alt={r.title}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-text truncate">{r.title}</p>
                                  <p className="text-xs text-text-dim font-mono">
                                    {Math.round(r.nutritionSummary.calories)} cal · {Math.round(r.nutritionSummary.protein_g)}g protein
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {aiSearch.isPending && (
                  <div className="flex items-center gap-2 text-text-muted">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    <span className="text-base typewriter-cursor">Thinking</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-bg">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., High protein lunch for a runner..."
                    disabled={aiSearch.isPending}
                    className="flex-1 px-5 py-3.5 rounded-xl bg-bg-card border border-border text-text text-base
                             placeholder:text-text-dim focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                             transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={aiSearch.isPending || !input.trim()}
                    className="p-3.5 rounded-xl bg-primary text-white hover:bg-primary/90 disabled:opacity-50
                             transition-all duration-200"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-bg-card border border-border p-5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-text">
                <Clock size={15} />
                Recent Searches
              </h3>
              {history && history.length > 0 ? (
                <ul className="space-y-2">
                  {history.slice(0, 10).map((h) => (
                    <li key={h._id}>
                      <button
                        onClick={() => handleSend(h.query)}
                        className="w-full text-left text-sm text-text-muted hover:text-primary p-2.5 rounded-xl
                                 hover:bg-accent-blue/10 transition-colors truncate"
                      >
                        {h.query}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-dim">No searches yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
