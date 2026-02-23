import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export const ChatAssistant = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}) => {
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
      const response = await fetch(
        "https://bankkod.onrender.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are Kodo, the elite AI financial assistant for KodBank. Keep responses concise, professional, energetic, and helpful. 🚀💰",
              },
              ...messages.concat(userMessage).map((m) => ({
                role: m.role === "model" ? "assistant" : "user",
                content: m.text,
              })),
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend chat failed");
      }

      const data = await response.json();

      const aiText =
        data?.choices?.[0]?.message?.content ||
        "⚠️ Kodo couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: aiText,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "⚠️ Kodo is temporarily unavailable. Please try again shortly.",
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
              width: "380px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glass-card mb-4 flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(249,115,22,0.3)] border-orange-500/30"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-orange-500/20 to-pink-500/10 backdrop-blur-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Kodo Assistant</h3>
                  <span className="text-[10px] text-green-400">
                    Online
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-white/40 hover:text-white"
                >
                  {isMinimized ? (
                    <Maximize2 size={16} />
                  ) : (
                    <Minimize2 size={16} />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/40 hover:text-white"
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
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0F0F0F]/50"
                >
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        msg.role === "user"
                          ? "ml-auto flex-row-reverse"
                          : ""
                      )}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-500/20 text-orange-500">
                        {msg.role === "user" ? (
                          <User size={14} />
                        ) : (
                          <Bot size={14} />
                        )}
                      </div>
                      <div className="p-3 rounded-2xl text-sm bg-white/5 border border-white/10">
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3">
                      <Bot size={14} />
                      <div className="text-sm text-orange-400">
                        Kodo is thinking...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-[#1A1A1A]">
                  <div className="flex items-center gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSend()
                      }
                      placeholder="Ask Kodo anything..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-2 bg-orange-500 text-white rounded-xl disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <p className="text-[10px] text-white/30 text-center mt-2">
                    <Sparkles size={10} className="inline" /> Powered by
                    Kodo Intelligence
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-2xl"
        >
          <MessageSquare size={28} />
        </motion.button>
      )}
    </div>
  );
};