/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  ChevronRight, 
  Home, 
  History, 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  Sparkles, 
  Mic, 
  Camera, 
  Edit3, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  Coffee, 
  Train, 
  Settings as SettingsIcon,
  BarChart3,
  ArrowLeft,
  X,
  CheckCircle2,
  MoreVertical,
  Utensils,
  Laptop,
  Check,
  Wallet,
  LogOut,
  Moon,
  Smartphone,
  ChevronDown,
  Tag,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  Tooltip
} from 'recharts';
import { cn } from './lib/utils';

// --- Types ---

type View = 'home' | 'history' | 'add' | 'insights' | 'settings' | 'scan' | 'voice' | 'manual' | 'success' | 'detail';

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  type: 'expense' | 'income';
  paymentMethod: string;
}

// --- Mock Data ---

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', merchant: 'Starbucks', category: 'Coffee & Drink', amount: -6.45, date: 'Today', time: '08:12 AM', type: 'expense', paymentMethod: 'Visa •• 42' },
  { id: '2', merchant: 'Uber', category: 'Transport', amount: -24.80, date: 'Today', time: '07:45 AM', type: 'expense', paymentMethod: 'Visa •• 42' },
  { id: '3', merchant: 'Whole Foods', category: 'Groceries', amount: -142.12, date: 'Yesterday', time: '06:20 PM', type: 'expense', paymentMethod: 'Visa •• 42' },
  { id: '4', merchant: 'Salary Deposit', category: 'Income', amount: 4250.00, date: 'Yesterday', time: '10:00 AM', type: 'income', paymentMethod: 'Bank Transfer' },
  { id: '5', merchant: 'Apple Store', category: 'Electronics', amount: -1299.00, date: 'Sep 20, 2023', time: '04:15 PM', type: 'expense', paymentMethod: 'Visa •• 42' },
  { id: '6', merchant: 'Netflix', category: 'Subscriptions', amount: -15.99, date: 'Sep 20, 2023', time: '01:00 AM', type: 'expense', paymentMethod: 'Visa •• 42' },
];

const CATEGORY_DATA = [
  { name: 'Food & Dining', value: 40, amount: '$1,712', color: '#006b55', icon: <Utensils className="w-4 h-4" /> },
  { name: 'Transport', value: 20, amount: '$856', color: '#00725b', icon: <Train className="w-4 h-4" /> },
  { name: 'Shopping', value: 15, amount: '$642', color: '#44474a', icon: <ShoppingBag className="w-4 h-4" /> },
];

const WEEKLY_TREND = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 35 },
  { day: 'Thu', value: 70 },
  { day: 'Fri', value: 60 },
  { day: 'Sat', value: 25 },
  { day: 'Sun', value: 65 },
];

// --- Sub-components ---

const Header = ({ title = "Flo", subtitle = "OCTOBER OVERVIEW", showAvatar = true }) => (
  <header className="fixed top-0 left-0 w-full z-10 bg-[#f8f9fa]/80 backdrop-blur-md px-6 h-24 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {showAvatar && (
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&q=80" 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#191c1d] leading-none">{title}</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{subtitle}</p>
      </div>
    </div>
    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
      <Bell className="w-6 h-6 text-[#191c1d]" />
    </button>
  </header>
);

const BottomNav = ({ activeView, setView }: { activeView: View; setView: (v: View) => void }) => {
  const tabs: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-6 h-6" /> },
    { id: 'history', label: 'History', icon: <History className="w-6 h-6" /> },
    { id: 'add', label: 'Add', icon: <PlusCircle className="w-7 h-7" /> },
    { id: 'insights', label: 'Insights', icon: <BarChart3 className="w-6 h-6" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-100 flex justify-around items-center px-4 pt-3 pb-8 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
      {tabs.map((tab) => {
        const isActive = activeView === tab.id || (tab.id === 'add' && ['scan', 'voice', 'manual', 'success', 'detail'].includes(activeView));
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-[#006b55]" : "text-[#44474a]",
              tab.id === 'add' && "scale-110 -translate-y-1"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-colors",
              isActive && tab.id !== 'add' && "bg-[#6dfad2]"
            )}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-semibold tracking-wide uppercase">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// --- View Components ---

const DashboardView = ({ setView }: { setView: (v: View) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -20 }}
    className="pt-28 pb-32 px-6 space-y-6"
  >
    {/* Primary Summary Card */}
    <section className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#44474a]">Total Spent This Month</p>
          <h2 className="text-4xl font-bold text-[#191c1d] tracking-tighter">$1,248.50</h2>
        </div>
        <div className="bg-[#6dfad2] text-[#00725b] px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          <span>12% lower</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-xs font-bold text-[#191c1d]">
          <span>Budget Progress</span>
          <span>62% used</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: '62%' }} 
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-[#006b55] rounded-full" 
          />
        </div>
        <div className="flex justify-between text-xs font-bold">
          <span className="text-gray-400">Limit: $2,000.00</span>
          <span className="text-[#006b55]">$751.50 remaining</span>
        </div>
      </div>
    </section>

    {/* Row of 3 Stats */}
    <section className="grid grid-cols-3 gap-3">
      {[
        { label: 'Today', value: '$42.00', color: 'text-[#191c1d]' },
        { label: 'This Week', value: '$320.00', color: 'text-[#191c1d]' },
        { label: 'Left', value: '$751.50', color: 'text-[#006b55]' },
      ].map((stat) => (
        <div key={stat.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
          <p className={cn("text-sm font-bold truncate", stat.color)}>{stat.value}</p>
        </div>
      ))}
    </section>

    {/* Quick Capture */}
    <section className="space-y-4">
      <h3 className="text-xl font-bold text-[#191c1d] px-1">Add a New Expense</h3>
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'scan' as View, icon: <Camera className="w-5 h-5" />, label: 'Scan' },
          { id: 'voice' as View, icon: <Mic className="w-5 h-5" />, label: 'Voice' },
          { id: 'manual' as View, icon: <Edit3 className="w-5 h-5" />, label: 'Manual' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setView(item.id)}
            className="bg-white py-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#191c1d]">
              {item.icon}
            </div>
            <span className="text-[10px] font-bold text-[#44474a] uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </section>

    {/* AI Insight Card */}
    <section className="bg-white rounded-2xl p-5 border border-blue-50 ai-glow flex gap-4 items-start">
      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
        <Sparkles className="w-5 h-5 text-blue-500 fill-blue-500" />
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">AI Insight</span>
        <p className="text-sm text-[#191c1d] leading-relaxed">
          Your grocery spending is <span className="font-bold">18% higher</span> than last week. Most of the increase came from weekend purchases.
        </p>
      </div>
    </section>

    {/* Categories Section */}
    <section className="space-y-4">
      <div className="flex justify-between items-end">
        <h3 className="text-2xl font-bold text-[#191c1d]">Categories</h3>
        <button className="text-xs font-bold text-[#006b55]" onClick={() => setView('insights')}>Details</button>
      </div>
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-5">
        {[
          { name: 'Groceries', amount: '450.00', progress: 45, color: 'bg-black' },
          { name: 'Food & Drinks', amount: '320.50', progress: 32, color: 'bg-[#006b55]' },
          { name: 'Transport', amount: '180.00', progress: 18, color: 'bg-blue-500' },
          { name: 'Shopping', amount: '298.00', progress: 29, color: 'bg-gray-500' },
        ].map((cat) => (
          <div key={cat.name} className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#191c1d]">{cat.name}</span>
              <span className="text-[#191c1d]">${cat.amount}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full", cat.color)} 
                style={{ width: `${cat.progress}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Recent Activity Section */}
    <section className="space-y-4">
      <div className="flex justify-between items-end">
        <h3 className="text-2xl font-bold text-[#191c1d]">Recent Activity</h3>
        <button className="text-xs font-bold text-[#006b55]" onClick={() => setView('history')}>View All</button>
      </div>
      <div className="bg-white rounded-[24px] border border-gray-100 divide-y divide-gray-50 shadow-sm overflow-hidden">
        {[
          { id: '1', merchant: 'Starbucks', category: 'Food & Drinks', date: 'Today', amount: -12.50, icon: <Coffee className="w-5 h-5" /> },
          { id: '2', merchant: 'Amazon', category: 'Shopping', date: 'Yesterday', amount: -84.20, icon: <ShoppingBag className="w-5 h-5" /> },
          { id: '3', merchant: 'Uber', category: 'Transport', date: '2 days ago', amount: -22.00, icon: <Train className="w-5 h-5" /> },
        ].map((activity) => (
          <div key={activity.id} className="p-5 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#191c1d]">
                {activity.icon}
              </div>
              <div>
                <p className="font-bold text-[#191c1d]">{activity.merchant}</p>
                <p className="text-xs font-medium text-gray-400">{activity.category} • {activity.date}</p>
              </div>
            </div>
            <p className="font-bold text-lg text-[#191c1d]">
              -${Math.abs(activity.amount).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </section>
  </motion.div>
);

const HistoryView = () => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }} 
    animate={{ opacity: 1, x: 0 }} 
    className="pt-24 pb-32 px-6 space-y-8"
  >
    {/* Search & Filter */}
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search transactions" 
          className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#006b55] transition-all"
        />
      </div>
      <button className="p-3.5 bg-white border border-gray-200 rounded-2xl">
        <Filter className="w-6 h-6 text-[#191c1d]" />
      </button>
    </div>

    {/* AI Insight Header */}
    <div className="bg-[#6dfad2]/20 border border-[#6dfad2]/40 rounded-2xl p-5 flex gap-4">
      <div className="w-12 h-12 rounded-full bg-[#6dfad2]/40 flex items-center justify-center shrink-0">
        <div className="w-6 h-6 bg-[#006b55] rounded flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-sm">
        <span className="font-bold text-[#006b55]">AI INSIGHT</span><br />
        You've spent <span className="font-bold">12% less</span> on <span className="font-bold">Dining Out</span> this week compared to your average. Keep it up!
      </p>
    </div>

    {/* Categorized List */}
    {['TODAY', 'YESTERDAY', 'SEP 20, 2023'].map((group) => (
      <section key={group} className="space-y-4">
        <p className="text-xs font-bold text-[#44474a] uppercase tracking-widest">{group}</p>
        <div className="bg-white rounded-xxl border border-gray-100 divide-y divide-gray-50 shadow-sm overflow-hidden">
          {MOCK_TRANSACTIONS.filter(t => t.date.toUpperCase() === group).map((t) => (
             <div key={t.id} className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#191c1d]">
                  {t.category === 'Groceries' ? <ShoppingBag className="w-6 h-6" /> : t.category === 'Income' ? <TrendingUp className="w-6 h-6 text-[#006b55]" /> : <Laptop className="w-6 h-6" />}
               </div>
               <div>
                 <p className="font-bold text-[#191c1d]">{t.merchant}</p>
                 <p className="text-xs font-medium text-[#44474a]">{t.category}</p>
               </div>
             </div>
             <div className="text-right">
                <p className={cn("font-bold text-lg leading-none", t.amount < 0 ? "text-[#191c1d]" : "text-[#006b55]")}>
                  {t.amount < 0 ? `-$${Math.abs(t.amount).toFixed(2)}` : `+$${t.amount.toFixed(2)}`}
                </p>
                <p className="text-[10px] font-bold text-[#44474a] mt-1 uppercase tracking-tighter">{t.time}</p>
             </div>
           </div>
          ))}
        </div>
      </section>
    ))}
  </motion.div>
);

const AddExpenseOptionsView = ({ setView }: { setView: (v: View) => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} 
    animate={{ opacity: 1, scale: 1 }} 
    className="pt-24 pb-32 px-6 space-y-8"
  >
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Add Expense</h2>
      <p className="text-gray-500">How would you like to record your transaction today?</p>
    </div>

    <div className="space-y-4">
      {[
        { id: 'scan' as View, icon: <Camera className="w-7 h-7" />, title: 'Scan Receipt', desc: 'Snap a photo, let Flo do the work', ai: true },
        { id: 'voice' as View, icon: <Mic className="w-7 h-7" />, title: 'Voice Log', desc: 'Say it out loud to record instantly', ai: true },
        { id: 'manual' as View, icon: <Edit3 className="w-7 h-7" />, title: 'Manual Entry', desc: 'Quickly enter details yourself', ai: false },
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => setView(item.id)}
          className="w-full bg-white p-6 rounded-xxl border border-gray-100 flex items-center justify-between text-left transition-all active:scale-[0.98] shadow-sm hover:border-[#006b55]/30 group"
        >
          <div className="flex gap-5 items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#f8f9fa] flex items-center justify-center text-[#191c1d] group-hover:bg-[#006b55] group-hover:text-white transition-colors">
              {item.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold">{item.title}</p>
                {item.ai && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">AI-Powered</span>}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-[#006b55] transition-colors" />
        </button>
      ))}
    </div>

    <div className="bg-blue-50/50 rounded-2xl p-4 flex items-center justify-center gap-2 border border-blue-100/50">
      <Sparkles className="w-4 h-4 text-blue-500" />
      <span className="text-sm font-medium text-blue-600">AI processing reduces entry time by 80%</span>
    </div>
  </motion.div>
);

const ScanReceiptView = ({ setView }: { setView: (v: View) => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setView('manual'), 500);
          return 100;
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [setView]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-50 bg-[#2e3132] overflow-hidden flex flex-col"
    >
      <div className="p-6 flex justify-between items-center text-white">
        <button onClick={() => setView('add')}><X className="w-7 h-7" /></button>
        <span className="font-bold text-lg">Flo</span>
        <button className="p-2 opacity-0"><Bell /></button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-full aspect-[3/4] max-w-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20">
          <img 
            src="https://images.unsplash.com/photo-1556742049-04ff435118c1?w=800&auto=format&fit=crop&q=80" 
            alt="Receipt" 
            className="w-full h-full object-cover grayscale brightness-75 scale-110 rotate-12"
          />
          {/* Scanner viewfinders */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-2xl" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-2xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-2xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-2xl" />
          
          <motion.div 
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 w-full h-1 bg-[#6dfad2] shadow-[0_0_20px_#6dfad2]"
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-t-[40px] space-y-8 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-500">
            <Sparkles className="w-5 h-5 fill-current" />
            <p className="font-bold">AI is reading your receipt...</p>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#006b55] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 1, label: 'Merchant', icon: <ShoppingBag className="w-6 h-6" />, active: progress > 30 },
            { id: 2, label: 'Date', icon: <Calendar className="w-6 h-6" />, active: progress > 60 },
            { id: 3, label: 'Amount', icon: <Wallet className="w-6 h-6" />, active: progress > 90 },
          ].map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-2 opacity-50 transition-opacity">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all",
                item.active ? "bg-[#6dfad2] text-[#006b55] opacity-100 scale-105" : "bg-gray-100 text-gray-400"
              )}>
                {item.icon}
              </div>
              <span className={cn("text-xs font-bold", item.active ? "text-[#006b55]" : "text-gray-400")}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ManualFormView = ({ setView }: { setView: (v: View) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }} 
    animate={{ opacity: 1, y: 0 }} 
    className="pt-24 pb-32 px-6 flex flex-col bg-white min-h-screen"
  >
    <div className="flex-1 space-y-8">
      {/* Big Amount Input */}
      <div className="text-center space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-bold text-gray-300">$</span>
          <h2 className="text-6xl font-bold text-[#e1e3e4] tracking-tighter">0.00</h2>
        </div>
        <div className="w-32 h-1 bg-[#6dfad2] mx-auto rounded-full" />
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#44474a] uppercase">Merchant Name</label>
          <div className="relative">
            <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="e.g. Starbucks, Amazon" className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-4 font-medium" />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-[#44474a] uppercase">Category</label>
            <button className="text-[10px] font-bold text-[#006b55] uppercase flex items-center gap-1">
              <PlusCircle className="w-3 h-3" /> New Category
            </button>
          </div>
          <div className="relative">
            <select className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-4 pr-10 font-bold appearance-none">
              <option>Food & Dining</option>
              <option>Groceries</option>
              <option>Transport</option>
              <option>Shopping</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#44474a] uppercase">Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value="10/27/2023" readOnly className="w-full bg-[#f8f9fa] border-none rounded-2xl py-4 pl-12 pr-4 font-bold" />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#44474a] uppercase">Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-[#6dfad2] text-[#00725b] p-4 rounded-2xl flex flex-col items-center gap-1 border border-transparent shadow-sm">
              <CreditCard className="w-5 h-5" />
              <div className="text-[10px] font-bold text-center">Visa ••<br/>4242</div>
            </button>
            <button className="bg-[#f8f9fa] p-4 rounded-2xl flex flex-col items-center gap-1 text-[#44474a]">
              <Wallet className="w-5 h-5" />
              <span className="text-[10px] font-bold">Cash</span>
            </button>
            <button className="bg-[#f8f9fa] p-4 rounded-2xl flex flex-col items-center gap-1 text-[#44474a]">
              <PlusCircle className="w-5 h-5" />
              <span className="text-[10px] font-bold">New</span>
            </button>
          </div>
        </div>

        {/* AI Prompt */}
        <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100 flex gap-4 items-start">
             <Sparkles className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
             <p className="text-sm text-blue-600 font-medium">
                This merchant matches your <span className="font-bold">"Weekend Dining"</span> budget category. You've spent 75% of your allowance for this month.
             </p>
        </div>
      </div>
    </div>

    <div className="space-y-4 pt-8">
      <button 
        onClick={() => setView('success')}
        className="w-full bg-black text-white py-4 rounded-xxl font-bold text-lg active:scale-95 transition-all shadow-lg"
      >
        Review Expense
      </button>
      <button 
        onClick={() => setView('add')}
        className="w-full bg-white border border-gray-200 py-4 rounded-xxl font-bold text-lg active:scale-95 transition-all"
      >
        Cancel
      </button>
    </div>
  </motion.div>
);

const SuccessView = ({ setView }: { setView: (v: View) => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }} 
    animate={{ opacity: 1, scale: 1 }} 
    className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-10 text-center gap-10"
  >
    <div className="relative">
        <div className="w-48 h-48 bg-[#6dfad2]/20 rounded-full flex items-center justify-center animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle2 className="w-24 h-24 text-[#006b55]" strokeWidth={1} />
        </div>
    </div>
    
    <div className="space-y-4">
        <h2 className="text-3xl font-bold">Expense Saved!</h2>
        <p className="text-gray-500 text-lg">Your transaction has been processed and logged successfully.</p>
    </div>

    <div className="w-full bg-white border border-gray-100 rounded-3xl p-8 space-y-6 shadow-sm">
        <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Summary</span>
            <h3 className="text-4xl font-bold">$24.00</h3>
            <div className="flex items-center justify-center gap-2 text-gray-600 font-bold">
                <ShoppingBag className="w-4 h-4" /> <span>at Whole Foods</span>
            </div>
        </div>
        <div className="py-2.5 px-4 bg-[#6dfad2]/10 border border-[#6dfad2]/30 rounded-full inline-flex items-center gap-2 mx-auto">
            <Sparkles className="w-4 h-4 text-[#006b55]" />
            <span className="text-sm font-bold text-[#006b55]">AI Insight: Within your weekly budget</span>
        </div>
    </div>

    <div className="w-full space-y-4">
        <button 
            onClick={() => setView('add')}
            className="w-full bg-black text-white py-4 rounded-xxl font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
        >
            <PlusCircle className="w-5 h-5" /> Add Another
        </button>
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setView('history')} className="py-4 border border-gray-200 rounded-xxl font-bold flex items-center justify-center gap-2">
                <History className="w-5 h-5" /> View History
            </button>
            <button onClick={() => setView('home')} className="py-4 border border-gray-200 rounded-xxl font-bold flex items-center justify-center gap-2">
                <Home className="w-5 h-5" /> Dashboard
            </button>
        </div>
    </div>
  </motion.div>
);

const InsightsView = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="pt-24 pb-32 px-6 space-y-8"
    >
      <div className="space-y-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Financial Overview</p>
        <div className="flex items-end justify-between">
            <h2 className="text-4xl font-bold tracking-tighter">Monthly Insights</h2>
            <div className="bg-[#6dfad2] text-[#00725b] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                <span>8% lower vs last month</span>
            </div>
        </div>
      </div>

      <section className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-8">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold">Spending by Category</h3>
                <p className="text-sm text-gray-500">Your biggest expenses this month</p>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold">$4,280.00</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Spent</p>
            </div>
        </div>

        <div className="space-y-6">
            {CATEGORY_DATA.map((item) => (
                <div key={item.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600" style={{ color: item.color }}>
                                {item.icon}
                            </div>
                            <span className="font-bold">{item.name}</span>
                        </div>
                        <span className="font-bold text-lg">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${item.value}%` }} 
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full rounded-full" 
                            style={{ backgroundColor: item.color }} 
                        />
                    </div>
                </div>
            ))}
        </div>
      </section>

      <section className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold">Weekly Trend</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={WEEKLY_TREND}>
                    <defs>
                        <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#006b55" />
                            <stop offset="100%" stopColor="#4A90E2" />
                        </linearGradient>
                    </defs>
                    <Line type="monotone" dataKey="value" stroke="url(#lineColor)" strokeWidth={4} dot={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#44474a', fontWeight: 600 }} />
                </LineChart>
            </ResponsiveContainer>
          </div>
      </section>

      <section className="bg-white rounded-2xl p-5 border border-blue-50 ai-glow flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-blue-500 fill-blue-500" />
          </div>
          <div className="space-y-1">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">AI Insight</span>
              <p className="text-sm text-[#191c1d] leading-relaxed">
                Your grocery spending is <span className="font-bold">18% higher</span> than last week. Most of the increase came from weekend purchases.
              </p>
          </div>
      </section>
    </motion.div>
);

const SettingsView = () => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      className="pt-24 pb-32 px-6 space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-500">Manage your account preferences and smart automation.</p>
      </div>

      <section className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Account</h3>
          <div className="bg-white rounded-[24px] border border-gray-100 divide-y divide-gray-50 shadow-sm">
              <button className="w-full flex items-center justify-between p-5 text-left">
                  <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center"><Smartphone className="w-6 h-6" /></div>
                      <div>
                          <p className="font-bold">Profile</p>
                          <p className="text-xs text-gray-500">Personal info, email, security</p>
                      </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
              <button className="w-full flex items-center justify-between p-5 text-left">
                  <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center"><Wallet className="w-6 h-6" /></div>
                      <div>
                          <p className="font-bold">Currency</p>
                          <p className="text-xs text-gray-500">USD ($) - United States Dollar</p>
                      </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
          </div>
      </section>

      <section className="space-y-4">
          <div className="flex justify-between items-center pl-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categories</h3>
            <button className="text-[10px] font-bold text-[#006b55] uppercase">Edit All</button>
          </div>
          <div className="bg-white rounded-[24px] border border-gray-100 divide-y divide-gray-50 shadow-sm">
            {[
              { name: 'Food & Dining', icon: <Utensils className="w-5 h-5" />, color: 'text-[#006b55]' },
              { name: 'Groceries', icon: <ShoppingBag className="w-5 h-5" />, color: 'text-black' },
              { name: 'Transport', icon: <Train className="w-5 h-5" />, color: 'text-blue-500' },
              { name: 'Shopping', icon: <ShoppingBag className="w-5 h-5" />, color: 'text-gray-500' },
            ].map((cat) => (
              <button key={cat.name} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center", cat.color)}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{cat.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Active Category</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
            <button className="w-full flex items-center gap-4 p-4 text-[#006b55] hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm uppercase tracking-wide">Add New Category</span>
            </button>
          </div>
      </section>

      <section className="space-y-4">
          <div className="flex items-center gap-2 pl-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Automation</h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">AI-Powered</span>
          </div>
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center"><Sparkles className="w-6 h-6 text-blue-500" /></div>
                        <div>
                            <p className="font-bold">AI Smart Categorization</p>
                            <p className="text-xs text-blue-500 font-medium">Flo automatically learns your spending habits</p>
                        </div>
                    </div>
                    <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold">Active</div>
                </div>
                <div className="h-px bg-gray-50 w-full" />
                <button className="w-full flex items-center justify-between p-1">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center"><Filter className="w-6 h-6" /></div>
                        <div>
                            <p className="font-bold">Rule Overrides</p>
                            <p className="text-xs text-gray-500">Custom logic for specific merchants</p>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
          </div>
      </section>

      <div className="flex flex-col items-center gap-6 pt-4">
          <button className="flex items-center gap-2 text-red-500 font-bold py-2">
              <LogOut className="w-5 h-5" /> Sign Out
          </button>
          <div className="text-center">
              <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">Flo v2.4.0 • Made with Calm Intelligence</p>
          </div>
      </div>
    </motion.div>
);

const VoiceLogView = ({ setView }: { setView: (v: View) => void }) => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-50 bg-[#f8f9fa] flex flex-col pt-20"
    >
      <div className="px-6 flex justify-between items-center">
          <button onClick={() => setView('add')}><ArrowLeft className="w-7 h-7" /></button>
          <h2 className="text-xl font-bold">Flo</h2>
          <Bell className="w-7 h-7" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 px-8">
            <div className="bg-blue-50 text-blue-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Listening</div>
            <p className="text-center text-xl font-medium max-w-xs">
                "Lunch at <span className="text-blue-500">Whole Foods</span> for <span className="text-blue-500">24 euros</span> on my Visa..."
            </p>

            <div className="relative">
                <div className="w-48 h-48 rounded-full border-2 border-blue-100 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-blue-50/50 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center shadow-2xl">
                            <Mic className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>
                {/* Wave animation circles */}
                <motion.div 
                    animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-2 border-blue-500"
                />
            </div>
      </div>

      <div className="bg-white rounded-t-[40px] px-8 py-10 shadow-2xl space-y-8">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500 fill-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Processing entity mapping</span>
              </div>
              <MoreVertical className="w-6 h-6 text-gray-300" />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50/50 p-5 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Merchant</p>
                  <p className="text-xl font-bold">Whole Foods</p>
              </div>
              <div className="bg-gray-50/50 p-5 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</p>
                  <p className="text-xl font-bold text-blue-500">€24.00</p>
              </div>
              <div className="bg-gray-50/50 p-5 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</p>
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4" />
                    <p className="text-xl font-bold">Dining</p>
                  </div>
              </div>
              <div className="bg-gray-50/50 p-5 rounded-2xl space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <p className="text-xl font-bold">Visa ••42</p>
                  </div>
              </div>
          </div>

          <div className="bg-blue-50/50 p-5 rounded-2xl flex items-center gap-3 border border-blue-100">
                <div className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </div>
                <p className="text-sm font-medium text-blue-600">Matches your usual lunch pattern at this location.</p>
          </div>

          <div className="flex gap-4">
                <button onClick={() => setView('add')} className="flex-1 py-4 border border-gray-200 rounded-full font-bold text-lg">CANCEL</button>
                <button onClick={() => setView('success')} className="flex-1 py-4 bg-black text-white rounded-full font-bold text-lg shadow-xl">STOP & SAVE</button>
          </div>
      </div>
    </motion.div>
);

// --- Main App ---

export default function App() {
  const [activeView, setView] = useState<View>('home');

  const renderView = () => {
    switch (activeView) {
      case 'home': return <DashboardView setView={setView} />;
      case 'history': return <HistoryView />;
      case 'add': return <AddExpenseOptionsView setView={setView} />;
      case 'scan': return <ScanReceiptView setView={setView} />;
      case 'voice': return <VoiceLogView setView={setView} />;
      case 'manual': return <ManualFormView setView={setView} />;
      case 'success': return <SuccessView setView={setView} />;
      case 'insights': return <InsightsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView setView={setView} />;
    }
  };

  const showNav = !['scan', 'voice', 'success'].includes(activeView);
  const showHeader = !['scan', 'voice', 'success', 'manual'].includes(activeView);

  return (
    <div className="min-h-screen bg-[#f8f9fa] selection:bg-[#6dfad2]">
      {showHeader && <Header />}
      
      <main className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      {showNav && <BottomNav activeView={activeView} setView={setView} />}
      
      {/* Scroll indicator for mobile feel */}
      <div className="fixed top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#006b55]/10 to-transparent pointer-events-none" />
    </div>
  );
}

