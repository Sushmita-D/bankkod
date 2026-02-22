import React, { useState, useEffect } from "react";
import { Landing } from "./components/Landing";
import { Login, Register, ForgotPassword, ResetPassword } from "./components/Auth";
import { Dashboard } from "./components/Dashboard";
import { ChatAssistant } from "./components/ChatAssistant";

type View = "landing" | "login" | "register" | "dashboard" | "forgot-password" | "reset-password";

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token && window.location.pathname === "/reset-password") {
      setView("reset-password");
    } else {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setIsAuthenticated(true);
        setView("dashboard");
      }
    }
  }, []);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setView("landing");
  };

  const handleRegisterSuccess = () => {
    setView("login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 relative overflow-hidden">
      {/* Immersive Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-600/10 blur-[100px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: "-4s" }} />
      </div>

      <div className="relative z-10">
        {view === "landing" && <Landing onGetStarted={() => setView("login")} />}
        {view === "login" && (
          <Login 
            onToggle={() => setView("register")} 
            onSuccess={handleLoginSuccess} 
            onForgotPassword={() => setView("forgot-password")}
          />
        )}
        {view === "register" && (
          <Register 
            onToggle={() => setView("login")} 
            onSuccess={handleRegisterSuccess} 
          />
        )}
        {view === "forgot-password" && (
          <ForgotPassword onBackToLogin={() => setView("login")} />
        )}
        {view === "reset-password" && (
          <ResetPassword 
            onSuccess={() => setView("login")} 
            onBackToLogin={() => setView("login")} 
          />
        )}
        {view === "dashboard" && isAuthenticated && (
          <Dashboard onLogout={handleLogout} onAssistantClick={() => setIsChatOpen(true)} />
        )}
        <ChatAssistant isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      </div>
    </div>
  );
}
