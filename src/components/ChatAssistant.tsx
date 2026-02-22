import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Minimize2, Maximize2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { Button } from "./UI";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export const ChatAssistant = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (o: boolean) => void }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I'm Kodo, your personal financial assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are Kodo, the elite AI financial assistant for KodBank. KodBank is a premium, orange-themed fintech platform known for its bold design and energetic user experience. Your goal is to provide world-class assistance to users. If they are on the landing page, explain our features like AI Insights and Smart Cards. If they are having trouble with login/register, guide them. If they are in the dashboard, help them with transfers, analytics, or card management. Keep responses concise, professional, and energetic. Use the 'Premium Orange' brand voice: confident, modern, and helpful. 🚀💰" },
            ...messages.concat(userMessage).map(m => ({
              role: m.role === "model" ? "assistant" : "user",
              content: m.text
            }))
          ]
        })
      });

      const contentType = response.headers.get("content-type");
      let data;
      let aiText = "";

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        if (response.ok) {
          aiText = data.choices?.[0]?.message?.content || "";
        }
      }

      // Fallback to Gemini if HF fails or no token
      if (!aiText) {
        console.log("Hugging Face failed or no response, falling back to Gemini...");
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: messages.concat(userMessage).map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          config: {
            systemInstruction: "You are Kodo, the elite AI financial assistant for KodBank. KodBank is a premium, orange-themed fintech platform known for its bold design and energetic user experience. Your goal is to provide world-class assistance to users. If they are on the landing page, explain our features like AI Insights and Smart Cards. If they are having trouble with login/register, guide them. If they are in the dashboard, help them with transfers, analytics, or card management. Keep responses concise, professional, and energetic. Use the 'Premium Orange' brand voice: confident, modern, and helpful. 🚀💰",
          }
        });
        aiText = result.text || "I'm sorry, I couldn't get a response. Please check your HF_TOKEN.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: aiText,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I'm having a bit of trouble connecting right now. Please ensure your HF_TOKEN is set in the Secrets panel, or I'll try to use my backup brain! 🧠",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? "80px" : "500px",
              width: "380px"
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card mb-4 flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(249,115,22,0.3)] border-orange-500/30"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-orange-500/20 to-pink-500/10 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center orange-glow">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Kodo Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0F0F0F]/50"
                >
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                        msg.role === "user" ? "bg-white/10" : "bg-orange-500/20 text-orange-500"
                      )}>
                        {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user" 
                          ? "bg-orange-500 text-white rounded-tr-none" 
                          : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                        <Bot size={14} />
                      </div>
                      <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-[#1A1A1A]">
                  <div className="relative flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask Kodo anything..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500/50 transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-2.5 bg-orange-500 text-white rounded-xl orange-glow hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <p className="text-[10px] text-white/20 text-center mt-3 flex items-center justify-center gap-1">
                    <Sparkles size={10} /> Powered by Kodo Intelligence
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isOpen ? 0 : 1, x: 0 }}
        className="absolute right-20 top-1/2 -translate-y-1/2 bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap orange-glow pointer-events-none"
      >
        Chat with Kodo!
        <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rotate-45" />
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className={cn(
          "w-16 h-16 rounded-full orange-gradient-bg flex items-center justify-center text-white shadow-2xl orange-glow transition-all duration-300",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageSquare size={28} />
      </motion.button>
    </div>
  );
};
