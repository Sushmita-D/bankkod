import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  ArrowLeftRight, 
  PieChart, 
  TrendingUp, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Zap,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Bot,
  Eye,
  EyeOff
} from "lucide-react";
import { Button, Input } from "./UI";
import { cn, formatCurrency } from "../lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";

// --- Types ---
interface Transaction {
  id: number;
  type: 'income' | 'expense';
  merchant: string;
  amount: number;
  status: string;
  date: string;
}

interface UserData {
  username: string;
  email: string;
  phone: string;
  balance: number;
}

// --- Mock Data ---
const chartData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const pieData = [
  { name: 'Food', value: 400, color: '#F97316' },
  { name: 'Shopping', value: 300, color: '#FB923C' },
  { name: 'Rent', value: 300, color: '#FDBA74' },
  { name: 'Other', value: 200, color: '#EC4899' },
];

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, onLogout, onAssistantClick }: { activeTab: string, setActiveTab: (t: string) => void, onLogout: () => void, onAssistantClick: () => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'accounts', icon: Wallet, label: 'Accounts' },
    { id: 'cards', icon: CreditCard, label: 'Cards' },
    { id: 'transfer', icon: ArrowLeftRight, label: 'Transfer' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'loans', icon: TrendingUp, label: 'Loans' },
    { id: 'investments', icon: Zap, label: 'Investments' },
    { id: 'assistant', icon: Bot, label: 'Kodo AI' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white/5 backdrop-blur-2xl border-r border-white/5 flex flex-col h-full">
      <div className="p-8">
        <h1 className="text-2xl font-bold orange-gradient-text tracking-tighter">KodBank</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'assistant') {
                onAssistantClick();
              } else {
                setActiveTab(item.id);
              }
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              activeTab === item.id 
                ? "text-white orange-glow" 
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute inset-0 bg-orange-500 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <item.icon size={20} className={cn(
              "transition-transform duration-300 group-hover:scale-110",
              activeTab === item.id ? "text-white" : "group-hover:text-orange-500"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const Navbar = ({ user, onProfileClick, onLogout }: { user: UserData | null, onProfileClick: () => void, onLogout: () => void }) => (
  <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/5 backdrop-blur-xl sticky top-0 z-40">
    <div>
      <h2 className="text-xl font-semibold">Welcome back, <span className="orange-gradient-text">{user?.username}</span></h2>
      <p className="text-sm text-white/40">Here's what's happening with your accounts today.</p>
    </div>
    <div className="flex items-center gap-6">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search transactions..." 
          className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-orange-500/50 transition-all w-64"
        />
      </div>
      <button className="relative p-2 rounded-full hover:bg-white/5 transition-all">
        <Bell size={20} className="text-white/60" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full orange-glow" />
      </button>
      
      <div className="flex items-center gap-4 pl-6 border-l border-white/10">
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition-all"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium group-hover:text-orange-500 transition-colors">{user?.username}</p>
            <p className="text-xs text-white/40">Profile</p>
          </div>
          <div className="relative group-hover:scale-110 transition-all duration-300">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 orange-glow shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full shadow-lg" />
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="p-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  </header>
);

const StatCard = ({ label, value, trend, icon: Icon, isBalance, isVisible, onToggleVisible, colorClass = "text-orange-500", bgClass = "bg-orange-500/10" }: any) => (
  <div className="glass-card glass-card-hover p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-2.5 rounded-xl", bgClass, colorClass)}>
        <Icon size={22} />
      </div>
      {trend !== undefined && (
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded-full",
          trend > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-sm text-white/40 mb-1">{label}</p>
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-2xl font-bold">
        {isBalance && !isVisible ? "₹ ••••••" : value}
      </h3>
      {isBalance && (
        <button 
          onClick={onToggleVisible}
          className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-orange-500 transition-all"
          title={isVisible ? "Hide Balance" : "Check Balance"}
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  </div>
);

const DashboardHome = ({ user, transactions, isBalanceVisible, toggleBalance }: { user: UserData | null, transactions: Transaction[], isBalanceVisible: boolean, toggleBalance: () => void }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        label="Total Balance" 
        value={formatCurrency(user?.balance || 0)} 
        trend={12.5} 
        icon={Wallet} 
        isBalance={true}
        isVisible={isBalanceVisible}
        onToggleVisible={toggleBalance}
        colorClass="text-orange-500"
        bgClass="bg-orange-500/10"
      />
      <StatCard 
        label="Monthly Income" 
        value={formatCurrency(5420)} 
        trend={8.2} 
        icon={ArrowDownLeft} 
        colorClass="text-green-500"
        bgClass="bg-green-500/10"
      />
      <StatCard 
        label="Monthly Expenses" 
        value={formatCurrency(1240)} 
        trend={-2.4} 
        icon={ArrowUpRight} 
        colorClass="text-red-500"
        bgClass="bg-red-500/10"
      />
      <StatCard 
        label="Credit Score" 
        value="784" 
        trend={1.5} 
        icon={ShieldCheck} 
        colorClass="text-blue-500"
        bgClass="bg-blue-500/10"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass-card p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-semibold">Spending Analytics</h3>
          <div className="flex bg-white/5 p-1 rounded-lg">
            <button className="px-4 py-1.5 text-xs font-medium bg-orange-500 text-white rounded-md shadow-lg">Weekly</button>
            <button className="px-4 py-1.5 text-xs font-medium text-white/60 hover:text-white transition-all">Monthly</button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#F97316' }}
              />
              <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-8 flex flex-col">
        <h3 className="text-lg font-semibold mb-8">Expense Distribution</h3>
        <div className="flex-1 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff10', borderRadius: '12px' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 mt-4">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-white/60">{item.name}</span>
              </div>
              <span className="text-sm font-medium">${item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 glass-card p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                  tx.type === 'income' ? "bg-green-500/20 text-green-400 shadow-green-500/10" : "bg-orange-500/20 text-orange-400 shadow-orange-500/10"
                )}>
                  {tx.type === 'income' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                </div>
                <div>
                  <p className="font-medium group-hover:text-orange-500 transition-colors">{tx.merchant}</p>
                  <p className="text-xs text-white/40">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold text-lg",
                  tx.type === 'income' ? "text-green-400" : "text-white"
                )}>
                  {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                </p>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                  tx.status === 'completed' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                )}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass-card p-8 bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-orange-500" size={24} />
            <h3 className="text-lg font-bold">AI Insights</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-sm text-white/80">You spent <span className="text-orange-500 font-bold">20% more</span> on food this month compared to last.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-sm text-white/80">You can save <span className="text-green-500 font-bold">₹1,800</span> by reducing unused subscriptions.</p>
            </div>
            <Button className="w-full mt-2" size="sm">Get Detailed Report</Button>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-lg font-semibold mb-6">Quick Transfer</h3>
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <button key={i} className="flex-shrink-0 flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-orange-500/50 transition-all">
                  <Plus size={20} className="text-white/40 group-hover:text-orange-500" />
                </div>
                <span className="text-[10px] text-white/40">Add New</span>
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <Input label="Amount" placeholder="0.00" />
            <Button className="w-full">Send Money</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TransferPage = ({ onTransfer }: { onTransfer: (r: string, a: number) => Promise<void> }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onTransfer(recipient, parseFloat(amount));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setRecipient("");
      setAmount("");
    } catch (err) {
      alert("Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Send Money</h2>
        <p className="text-white/40">Transfer funds instantly to any bank account or UPI ID.</p>
      </div>

      <div className="glass-card p-10 relative overflow-hidden">
        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-[#1A1A1A] flex flex-col items-center justify-center text-center p-8"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 orange-glow">
                <ShieldCheck size={40} className="text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Transfer Successful!</h3>
              <p className="text-white/40 mb-8">Your money has been sent successfully.</p>
              <Button onClick={() => setSuccess(false)}>Done</Button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center cursor-pointer hover:bg-orange-500/20 transition-all">
              <Smartphone className="mx-auto mb-2 text-orange-500" />
              <p className="text-xs font-bold">UPI Transfer</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center cursor-pointer hover:bg-white/10 transition-all">
              <Wallet className="mx-auto mb-2 text-white/40" />
              <p className="text-xs font-bold">Bank Account</p>
            </div>
          </div>

          <Input 
            label="Recipient Name or ID" 
            placeholder="e.g. john@upi" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
          <Input 
            label="Amount (INR)" 
            type="number" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Transaction Fee</span>
              <span className="text-green-500 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Estimated Time</span>
              <span className="text-white/80">Instant</span>
            </div>
          </div>

          <Button className="w-full" size="lg" isLoading={loading}>Confirm Transfer</Button>
        </form>
      </div>
    </div>
  );
};

const CardsPage = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">My Cards</h2>
      <Button variant="outline" size="sm" className="gap-2">
        <Plus size={16} /> Add New Card
      </Button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <motion.div 
          whileHover={{ scale: 1.02, rotateY: 5 }}
          className="aspect-[1.58/1] w-full max-w-md mx-auto relative rounded-2xl overflow-hidden orange-glow group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] via-[#F59E0B] to-[#EC4899]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest opacity-60">Premium Platinum</p>
                <h4 className="text-lg font-bold">KodBank</h4>
              </div>
              <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-sm" />
            </div>
            <div className="space-y-4">
              <p className="text-2xl font-mono tracking-[0.2em]">**** **** **** 4290</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] uppercase opacity-60 mb-1">Card Holder</p>
                  <p className="text-sm font-medium">KOD USER</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase opacity-60 mb-1">Expires</p>
                  <p className="text-sm font-medium">08/28</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500/40" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="glass-card p-6 space-y-6">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm">Freeze Card</span>
              <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <span className="text-sm">Contactless</span>
              <div className="w-10 h-5 bg-orange-500/40 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-orange-500 rounded-full" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/40">Monthly Spending Limit</span>
              <span className="text-orange-500 font-bold">₹50,000</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[65%] orange-gradient-bg orange-glow" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <h3 className="text-lg font-semibold mb-6">Card Transactions</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Smartphone size={18} className="text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-medium">Apple Subscription</p>
                  <p className="text-[10px] text-white/40">21 Feb 2026 • 10:24 AM</p>
                </div>
              </div>
              <p className="text-sm font-bold">-₹199.00</p>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-6">View Full Statement</Button>
      </div>
    </div>
  </div>
);

const ProfilePage = ({ user }: { user: UserData | null }) => (
  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div className="flex items-center gap-8 p-8 glass-card bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/5">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full bg-orange-500/20 border-2 border-orange-500/30 flex items-center justify-center text-4xl font-bold text-orange-500 orange-glow overflow-hidden">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <button className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full text-white orange-glow hover:scale-110 transition-all">
          <Plus size={16} />
        </button>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">{user?.username}</h2>
        <p className="text-white/40">{user?.email}</p>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-orange-500/20">Premium</span>
          <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">Verified</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass-card p-8 space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User size={20} className="text-orange-500" /> Personal Information
        </h3>
        <div className="space-y-4">
          <Input label="Full Name" defaultValue={user?.username} />
          <Input label="Email Address" defaultValue={user?.email} disabled />
          <Input label="Phone Number" defaultValue={user?.phone} />
          <Button className="w-full">Save Changes</Button>
        </div>
      </div>

      <div className="glass-card p-8 space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck size={20} className="text-orange-500" /> Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-white/40">Secure your account with 2FA</p>
            </div>
            <div className="w-10 h-5 bg-orange-500/40 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-orange-500 rounded-full" />
            </div>
          </div>
          <Button variant="outline" className="w-full">Change Password</Button>
          <Button variant="ghost" className="w-full text-red-400 hover:bg-red-400/10">Delete Account</Button>
        </div>
      </div>
    </div>
  </div>
);

const AccountsPage = ({ user, isBalanceVisible, toggleBalance }: { user: UserData | null, isBalanceVisible: boolean, toggleBalance: () => void }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold">My Accounts</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="glass-card-orange p-8 bg-gradient-to-br from-orange-500/10 to-transparent">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-white/40 uppercase tracking-widest font-bold mb-1">KodBank Premium Account</p>
            <h3 className="text-xl font-bold">Active Savings</h3>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
            <Wallet size={24} />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-white/40 mb-1">Account Number</p>
            <p className="text-lg font-mono tracking-wider">KB-8829-1102-4490</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-white/40">Current Balance</p>
              <button 
                onClick={toggleBalance}
                className="text-[10px] text-orange-500 hover:underline flex items-center gap-1"
              >
                {isBalanceVisible ? <EyeOff size={10} /> : <Eye size={10} />}
                {isBalanceVisible ? "Hide" : "Check Balance"}
              </button>
            </div>
            <p className="text-3xl font-bold text-orange-500">
              {isBalanceVisible ? formatCurrency(user?.balance || 0) : "₹ ••••••"}
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
          <Button size="sm" className="flex-1">Statement</Button>
          <Button size="sm" variant="outline" className="flex-1">Details</Button>
        </div>
      </div>

      <div className="glass-card p-8 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-transparent hover:border-orange-500/30 transition-all cursor-pointer group">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-orange-500/10 transition-all">
          <Plus size={32} className="text-white/20 group-hover:text-orange-500" />
        </div>
        <h4 className="font-bold mb-1">Open New Account</h4>
        <p className="text-xs text-white/40">Fixed deposits, current accounts & more</p>
      </div>
    </div>
  </div>
);

const LoansPage = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Loans & Credit</h2>
      <Button size="sm" className="gap-2">
        <Plus size={16} /> Apply for Loan
      </Button>
    </div>
    
    <div className="glass-card p-12 flex flex-col items-center justify-center text-center bg-gradient-to-br from-orange-500/5 to-blue-500/5">
      <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center mb-6 orange-glow">
        <TrendingUp size={40} className="text-orange-500" />
      </div>
      <h3 className="text-xl font-bold mb-2">No loans taken</h3>
      <p className="text-white/40 max-w-sm mx-auto mb-8">
        You currently have no active loans with KodBank. Check your eligibility for pre-approved personal loans.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all">
          <p className="text-xs text-white/40 mb-1">Personal Loan</p>
          <p className="font-bold text-orange-500">Up to ₹10L</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all">
          <p className="text-xs text-white/40 mb-1">Home Loan</p>
          <p className="font-bold text-orange-500">8.5% p.a.</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/30 transition-all">
          <p className="text-xs text-white/40 mb-1">Car Loan</p>
          <p className="font-bold text-orange-500">9.2% p.a.</p>
        </div>
      </div>
    </div>
  </div>
);

const InvestmentsPage = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Investments</h2>
      <Button size="sm" variant="outline">Portfolio Analysis</Button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-8 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
          <h3 className="font-bold mb-6">Active Portfolio</h3>
          <div className="space-y-4">
            {[
              { name: 'KodBank Growth Fund', type: 'Mutual Fund', value: '₹45,200', change: '+12.4%', color: 'text-green-500' },
              { name: 'S&P 500 Index', type: 'ETF', value: '₹12,800', change: '+5.2%', color: 'text-green-500' },
              { name: 'Bitcoin', type: 'Crypto', value: '₹8,400', change: '-2.1%', color: 'text-red-500' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{item.value}</p>
                  <p className={cn("text-xs font-bold", item.color)}>{item.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-8 bg-orange-500/10 border-orange-500/30">
        <h3 className="font-bold mb-4">Investment Power</h3>
        <p className="text-sm text-white/70 mb-6 leading-relaxed">
          Your current portfolio is outperforming 85% of users in your bracket. Consider diversifying into Gold Bonds.
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Risk Level</span>
            <span className="text-orange-500 font-bold uppercase">Moderate</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-orange-500" />
          </div>
        </div>
        <Button className="w-full">Explore Opportunities</Button>
      </div>
    </div>
  </div>
);

const AnalyticsPage = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Financial Analytics</h2>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Export Data</Button>
        <Button size="sm">Generate Report</Button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass-card p-6 border-l-4 border-l-orange-500 bg-orange-500/5">
        <p className="text-xs text-white/40 uppercase font-bold mb-1">Savings Rate</p>
        <h4 className="text-2xl font-bold">24.8%</h4>
        <p className="text-[10px] text-green-500 mt-2 flex items-center gap-1">
          <TrendingUp size={12} /> +2.4% from last month
        </p>
      </div>
      <div className="glass-card p-6 border-l-4 border-l-pink-500 bg-pink-500/5">
        <p className="text-xs text-white/40 uppercase font-bold mb-1">Fixed Expenses</p>
        <h4 className="text-2xl font-bold">₹32,400</h4>
        <p className="text-[10px] text-white/40 mt-2">Rent, Utilities, Subscriptions</p>
      </div>
      <div className="glass-card p-6 border-l-4 border-l-blue-500 bg-blue-500/5">
        <p className="text-xs text-white/40 uppercase font-bold mb-1">Investment ROI</p>
        <h4 className="text-2xl font-bold">12.2%</h4>
        <p className="text-[10px] text-green-500 mt-2 flex items-center gap-1">
          <TrendingUp size={12} /> Outperforming market by 3%
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold">Income vs Expenses</h3>
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#F97316' }}
              />
              <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#incomeGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
          <p className="text-sm text-white/60 leading-relaxed">
            Your <span className="text-orange-500 font-bold">income</span> has grown by <span className="text-green-500 font-bold">15%</span> over the last quarter, while expenses remained stable. This is a great sign of financial health.
          </p>
        </div>
      </div>

      <div className="glass-card p-8">
        <h3 className="font-bold mb-8">Spending by Category</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie 
                data={pieData} 
                innerRadius={70} 
                outerRadius={100} 
                paddingAngle={8} 
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #ffffff10', borderRadius: '12px' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-white/60">{item.name}</span>
              </div>
              <span className="text-xs font-bold">₹{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
    <h2 className="text-2xl font-bold">Settings</h2>
    <div className="glass-card p-8 space-y-8">
      <div className="space-y-4">
        <h3 className="font-bold text-orange-500 uppercase tracking-widest text-xs">Preferences</h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
          <div>
            <p className="text-sm font-medium">Email Notifications</p>
            <p className="text-xs text-white/40">Receive monthly statements via email</p>
          </div>
          <div className="w-10 h-5 bg-orange-500 rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
          <div>
            <p className="text-sm font-medium">Dark Mode</p>
            <p className="text-xs text-white/40">Always active for premium users</p>
          </div>
          <div className="w-10 h-5 bg-orange-500 rounded-full relative cursor-pointer">
            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-orange-500 uppercase tracking-widest text-xs">Regional</h3>
        <Input label="Currency" defaultValue="INR (₹)" disabled />
        <Input label="Language" defaultValue="English (US)" />
      </div>

      <Button className="w-full">Save Settings</Button>
    </div>
  </div>
);

// --- Main Dashboard Layout ---

export const Dashboard = ({ onLogout, onAssistantClick }: { onLogout: () => void, onAssistantClick: () => void }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState<{ user: UserData, transactions: Transaction[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransfer = async (recipient: string, amount: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/transfer', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ recipient, amount })
    });
    if (!res.ok) throw new Error('Transfer failed');
    fetchData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F0F0F] space-y-4">
        <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin orange-glow" />
        <p className="text-orange-500 font-medium animate-pulse">Loading your secure dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden relative">
      {/* Subtle Dashboard Overlays */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} onAssistantClick={onAssistantClick} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={userData?.user || null} onProfileClick={() => setActiveTab('profile')} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardHome 
                user={userData?.user || null} 
                transactions={userData?.transactions || []} 
                isBalanceVisible={isBalanceVisible}
                toggleBalance={() => setIsBalanceVisible(!isBalanceVisible)}
              />
            )}
            {activeTab === 'accounts' && (
              <AccountsPage 
                user={userData?.user || null} 
                isBalanceVisible={isBalanceVisible}
                toggleBalance={() => setIsBalanceVisible(!isBalanceVisible)}
              />
            )}
            {activeTab === 'transfer' && <TransferPage onTransfer={handleTransfer} />}
            {activeTab === 'cards' && <CardsPage />}
            {activeTab === 'analytics' && <AnalyticsPage />}
            {activeTab === 'loans' && <LoansPage />}
            {activeTab === 'investments' && <InvestmentsPage />}
            {activeTab === 'profile' && <ProfilePage user={userData?.user || null} />}
            {activeTab === 'settings' && <SettingsPage />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
