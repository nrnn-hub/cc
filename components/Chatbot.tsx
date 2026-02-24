import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I am the ShadowMarket AI assistant. How can I help you today?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!chatRef.current) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        chatRef.current = ai.chats.create({
          model: 'gemini-3.1-pro-preview',
          config: {
            systemInstruction: 'You are a helpful assistant for an e-commerce platform called ShadowMarket. You help users find products, answer questions about the marketplace, and provide support.',
          }
        });
      } catch (e) {
        console.error("Failed to initialize Gemini AI", e);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        chatRef.current = ai.chats.create({
          model: 'gemini-3.1-pro-preview',
          config: {
            systemInstruction: 'You are a helpful assistant for an e-commerce platform called ShadowMarket.',
          }
        });
      }

      const response = await chatRef.current.sendMessage({ message: userMessage.text });
      
      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: response.text || 'I am sorry, I could not process that request.', 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: 'Connection error. Please try again later.', 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-[#39FF14] text-black rounded-full shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] hover:bg-[#32E611] transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-[#12121A] border border-[#39FF14]/30 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        {/* Header */}
        <div className="p-4 bg-[#0A0A0F] border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#39FF14]/10 rounded-full flex items-center justify-center border border-[#39FF14]/30">
              <Bot size={18} className="text-[#39FF14]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">ShadowBot AI</h3>
              <p className="text-[10px] text-[#39FF14] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse"></span> Online
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-white/10 text-white' : 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30'}`}>
                {msg.sender === 'user' ? <UserIcon size={14} /> : <Bot size={14} />}
              </div>
              <div 
                className={`p-3 rounded-2xl max-w-[75%] text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-white/10 text-white rounded-tr-none' 
                    : 'bg-[#0A0A0F] border border-white/5 text-slate-300 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="p-3 rounded-2xl bg-[#0A0A0F] border border-white/5 text-slate-300 rounded-tl-none flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#39FF14]" />
                <span className="text-xs">Processing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-[#0A0A0F] border-t border-white/10">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our products..."
              className="flex-1 bg-[#12121A] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#39FF14]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-[#39FF14] text-black rounded-xl flex items-center justify-center hover:bg-[#32E611] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
