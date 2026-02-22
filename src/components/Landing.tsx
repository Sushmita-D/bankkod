import React from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Lock, 
  Smartphone, 
  BarChart3, 
  Globe, 
  ChevronRight,
  Star,
  CheckCircle2,
  CreditCard
} from "lucide-react";
import { Button } from "./UI";
import { cn } from "../lib/utils";

export const Landing = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="min-h-screen bg-transparent text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-8 md:px-20 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <h1 className="text-2xl font-bold orange-gradient-text tracking-tighter">KodBank</h1>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <a href="#features" className="hover:text-orange-500 transition-colors">Features</a>
          <a href="#security" className="hover:text-orange-500 transition-colors">Security</a>
          <a href="#about" className="hover:text-orange-500 transition-colors">About</a>
        </div>
        <Button onClick={onGetStarted} variant="outline" size="sm">Sign In</Button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-8 md:px-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-orange-500/20 blur-[140px] rounded-full animate-float" />
          <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-pink-500/20 blur-[140px] rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 blur-[160px] rounded-full animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
              <Zap size={14} /> The Future of Banking is Here
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
              Smarter Banking with <span className="orange-gradient-text">KodBank</span>
            </h1>
            <p className="text-xl text-white/40 max-w-xl mx-auto lg:mx-0">
              Experience the next generation of fintech. Bold, energetic, and built for the modern world. Manage your wealth with AI-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button size="lg" className="px-10 gap-2" onClick={onGetStarted}>
                Get Started <ArrowRight size={20} />
              </Button>
              <Button variant="ghost" size="lg">Learn More</Button>
            </div>
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F0F0F] bg-orange-500/20 flex items-center justify-center text-[10px] font-bold">
                    U{i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40"><span className="text-white font-bold">10k+</span> users already joined</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[1.58/1] w-full max-w-lg mx-auto relative rounded-3xl overflow-hidden orange-glow shadow-[0_0_50px_rgba(249,115,22,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] via-[#F59E0B] to-[#EC4899]" />
              <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <h4 className="text-2xl font-bold tracking-tighter">KodBank</h4>
                  <div className="w-16 h-10 bg-white/20 rounded-lg backdrop-blur-md" />
                </div>
                <div className="space-y-6">
                  <p className="text-3xl font-mono tracking-[0.2em]">**** **** **** 8842</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase opacity-60 mb-1">Card Holder</p>
                      <p className="text-lg font-medium">PREMIUM USER</p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-orange-500/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 glass-card p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">Payment Success</p>
                <p className="text-[10px] text-white/40">+$1,250.00</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-8 md:px-20 bg-[#1A1A1A]/50">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Powerful Features for <span className="text-orange-500">Modern Banking</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Everything you need to manage your finances in one place. Fast, secure, and beautiful.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CreditCard, title: "Smart Cards", desc: "Virtual and physical cards with instant freezing and limits.", color: "bg-orange-500" },
              { icon: BarChart3, title: "Real-time Analytics", desc: "Track every penny with beautiful charts and categorization.", color: "bg-blue-500" },
              { icon: ShieldCheck, title: "Secure Transactions", desc: "Military-grade encryption for all your financial data.", color: "bg-green-500" },
              { icon: Zap, title: "AI Spending Insights", desc: "Get smart recommendations to save more every month.", color: "bg-purple-500" }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-card p-8 space-y-6 group hover:bg-white/10 transition-all duration-500"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all duration-300", f.color, "shadow-lg shadow-black/20")}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-8 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Loved by <span className="text-orange-500">Thousands</span></h2>
            <p className="text-white/40">See what our users have to say about their experience with KodBank.</p>
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="glass-card p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex-shrink-0" />
                  <div className="space-y-2">
                    <div className="flex gap-1 text-orange-500">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-sm italic text-white/80">"KodBank has completely changed how I manage my money. The AI insights are a game changer!"</p>
                    <p className="text-xs font-bold text-orange-500">— User {i}, Entrepreneur</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="glass-card p-10 space-y-8 text-center bg-gradient-to-br from-orange-500/5 to-pink-500/5">
                <Globe className="mx-auto text-orange-500 animate-spin-slow" size={80} />
                <h3 className="text-3xl font-bold">Global Reach</h3>
                <p className="text-white/40">Send money to over 150 countries instantly with zero hidden fees.</p>
                <Button variant="outline" className="w-full">Explore Global Banking</Button>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 md:px-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold orange-gradient-text tracking-tighter">KodBank</h1>
            <p className="text-sm text-white/40">The next generation of fintech. Bold, energetic, and built for you.</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Product</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Cards</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Company</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Legal</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-xs text-white/20">
          © 2026 KodBank. All rights reserved. Built with passion for the future of finance.
        </div>
      </footer>
    </div>
  );
};
