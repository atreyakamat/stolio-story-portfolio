'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiUser, FiMail, FiMessageCircle, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from './ThemeProvider';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function PortfolioAssistant({ portfolioId, name }: { portfolioId: string, name: string }) {
  const { theme, style } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'contact'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi! I'm ${name}'s AI assistant. Ask me anything about their experience or projects!` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sendingContact, setSendingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSendChat() {
    if (!inputValue.trim() || loading) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`/api/portfolio/${portfolioId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          chatHistory: messages.slice(1) // skip the welcome message
        }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I hit a snag. Try again?" }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendContact(e: React.FormEvent) {
    e.preventDefault();
    setSendingContact(true);

    try {
      const res = await fetch(`/api/portfolio/${portfolioId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: contactForm.name,
          senderEmail: contactForm.email,
          message: contactForm.message,
        }),
      });

      if (res.ok) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => {
          setContactSuccess(false);
          setMode('chat');
        }, 3000);
      }
    } catch {
      alert('Failed to send message');
    } finally {
      setSendingContact(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] flex flex-col overflow-hidden border shadow-2xl"
            style={{
              background: theme.colors.background,
              borderColor: theme.colors.border,
              borderRadius: style === 'neobrutalism' ? '0' : '24px',
              height: '500px',
              ...(style === 'glassmorphism' && {
                background: 'rgba(15, 3, 32, 0.9)',
                backdropFilter: 'blur(20px)',
              }),
              ...(style === 'neobrutalism' && {
                boxShadow: `8px 8px 0px ${theme.colors.text}`,
                border: `3px solid ${theme.colors.text}`,
              }),
            }}
          >
            {/* Header */}
            <div 
              className="p-4 flex items-center justify-between border-b"
              style={{ 
                background: `${theme.colors.primary}10`,
                borderColor: theme.colors.border 
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: theme.colors.primary }}
                >
                  {name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: theme.colors.text }}>{name}&apos;s AI Twin</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider opacity-60">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                style={{ color: theme.colors.text }}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: theme.colors.border }}>
              <button
                onClick={() => setMode('chat')}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all ${
                  mode === 'chat' ? 'border-b-2' : 'opacity-40 hover:opacity-100'
                }`}
                style={{ 
                  borderColor: mode === 'chat' ? theme.colors.primary : 'transparent',
                  color: theme.colors.text 
                }}
              >
                Interview
              </button>
              <button
                onClick={() => setMode('contact')}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all ${
                  mode === 'contact' ? 'border-b-2' : 'opacity-40 hover:opacity-100'
                }`}
                style={{ 
                  borderColor: mode === 'contact' ? theme.colors.primary : 'transparent',
                  color: theme.colors.text 
                }}
              >
                Reach Out
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-hidden relative">
              <AnimatePresence mode="wait">
                {mode === 'chat' ? (
                  <motion.div 
                    key="chat"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full flex flex-col p-4"
                  >
                    <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                      {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            className={`max-w-[85%] p-3 text-sm ${
                              msg.role === 'user' 
                                ? 'rounded-2xl rounded-tr-none' 
                                : 'rounded-2xl rounded-tl-none'
                            }`}
                            style={{
                              background: msg.role === 'user' ? theme.colors.primary : theme.colors.surface,
                              color: msg.role === 'user' ? '#fff' : theme.colors.text,
                              border: msg.role === 'assistant' ? `1px solid ${theme.colors.border}` : 'none',
                              ...(style === 'neobrutalism' && { borderRadius: '0' })
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="flex justify-start">
                          <div 
                            className="p-3 rounded-2xl rounded-tl-none border"
                            style={{ background: theme.colors.surface, borderColor: theme.colors.border }}
                          >
                            <FiLoader className="animate-spin" size={16} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <input 
                        type="text"
                        placeholder="Ask me anything..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        className="flex-grow px-4 py-2 text-sm bg-white/5 border rounded-full focus:outline-none focus:ring-1"
                        style={{ 
                          borderColor: theme.colors.border, 
                          color: theme.colors.text,
                          borderRadius: style === 'neobrutalism' ? '0' : '9999px',
                          '--tw-ring-color': theme.colors.primary 
                        } as any}
                      />
                      <button 
                        onClick={handleSendChat}
                        disabled={loading || !inputValue.trim()}
                        className="p-2.5 rounded-full text-white transition-all disabled:opacity-50"
                        style={{ 
                          background: theme.colors.primary,
                          borderRadius: style === 'neobrutalism' ? '0' : '9999px',
                        }}
                      >
                        <FiSend size={16} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="contact"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full p-6 flex flex-col"
                  >
                    {contactSuccess ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <FiCheckCircle size={48} className="text-emerald-500 mb-4" />
                        <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
                        <p className="text-sm opacity-60">I&apos;ll make sure they see this. Thanks for reaching out!</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSendContact} className="space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1.5">Your Name</label>
                          <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                            <input 
                              required
                              value={contactForm.name}
                              onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                              className="w-full pl-10 pr-4 py-2 bg-white/5 border text-sm rounded-xl focus:outline-none"
                              style={{ 
                                borderColor: theme.colors.border, 
                                borderRadius: style === 'neobrutalism' ? '0' : '12px' 
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1.5">Your Email</label>
                          <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                            <input 
                              required
                              type="email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                              className="w-full pl-10 pr-4 py-2 bg-white/5 border text-sm rounded-xl focus:outline-none"
                              style={{ 
                                borderColor: theme.colors.border, 
                                borderRadius: style === 'neobrutalism' ? '0' : '12px' 
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest font-bold opacity-60 mb-1.5">Message</label>
                          <textarea 
                            required
                            rows={4}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                            className="w-full px-4 py-2 bg-white/5 border text-sm rounded-xl focus:outline-none resize-none"
                            style={{ 
                              borderColor: theme.colors.border, 
                              borderRadius: style === 'neobrutalism' ? '0' : '12px' 
                            }}
                          />
                        </div>
                        <button 
                          disabled={sendingContact}
                          className="w-full py-3 text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          style={{ 
                            background: theme.colors.primary,
                            borderRadius: style === 'neobrutalism' ? '0' : '12px' 
                          }}
                        >
                          {sendingContact ? <FiLoader className="animate-spin" /> : "Send Message"}
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 flex items-center justify-center text-white shadow-2xl relative"
        style={{
          background: theme.colors.primary,
          borderRadius: style === 'neobrutalism' ? '0' : '50%',
          ...(style === 'neobrutalism' && {
            border: `3px solid ${theme.colors.text}`,
            boxShadow: `4px 4px 0px ${theme.colors.text}`,
          }),
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FiX size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FiMessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white/10 animate-bounce" />
        )}
      </motion.button>
    </div>
  );
}
