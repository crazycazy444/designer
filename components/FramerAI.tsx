"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Send, Sparkles, Layout, Palette, Image as ImageIcon, CreditCard, Lock, CheckCircle2, ChevronRight, Globe, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FramerAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [currentDesign, setCurrentDesign] = useState({
    theme: 'light',
    accentColor: 'indigo',
    borderRadius: 'full',
    heroText: 'Design at the speed of thought.',
    heroSubtext: 'Our AI-powered designer transforms your ideas into stunning websites in seconds. No code required.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072',
    navLogo: 'LUMINA'
  });
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const messageLimit = 5;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImport = () => {
    if (!importUrl) return;
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setMessages(prev => [...prev, { role: 'assistant', content: `Imported ${importUrl} successfully! How should I redesign it?` }]);
      setCurrentDesign(prev => ({ ...prev, navLogo: importUrl.replace(/https?:\/\/(www\.)?/, '').split('.')[0].toUpperCase() }));
    }, 2000);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    if (!isPremium && messages.filter(m => m.role === 'user').length >= messageLimit) {
      setShowPremiumModal(true);
      return;
    }

    const newUserMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = input.toLowerCase();
    setInput('');

    // Simulate AI thinking and "designing" based on input
    setTimeout(() => {
      let response = "I've updated the design based on your feedback.";
      const newDesign = { ...currentDesign };

      if (currentInput.includes('dark')) {
        newDesign.theme = 'dark';
        response = "Switching to a dark theme for a more sophisticated look.";
      } else if (currentInput.includes('light')) {
        newDesign.theme = 'light';
        response = "Reverting to a clean, light theme.";
      }

      if (currentInput.includes('purple')) {
        newDesign.accentColor = 'purple';
        response = "Applying a vibrant purple accent across the site.";
      } else if (currentInput.includes('blue')) {
        newDesign.accentColor = 'blue';
        response = "Refreshing the UI with professional blue tones.";
      } else if (currentInput.includes('rose') || currentInput.includes('pink')) {
        newDesign.accentColor = 'rose';
        response = "Added some warmth with rose accents.";
      }

      if (currentInput.includes('square') || currentInput.includes('sharp')) {
        newDesign.borderRadius = 'none';
        response = "Updated the border radius to sharp edges for a more brutalist feel.";
      } else if (currentInput.includes('rounded')) {
        newDesign.borderRadius = '2xl';
        response = "Softer edges applied to all components.";
      }

      if (currentInput.includes('space') || currentInput.includes('galaxy')) {
        newDesign.imageUrl = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072';
        newDesign.heroText = 'Design for the next frontier.';
        response = "Space-themed imagery and copy integrated.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setCurrentDesign(newDesign);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* Sidebar - Design Controls */}
      <div className="w-80 border-r border-white/10 bg-[#0a0a0a] flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Framer AI</span>
        </div>

        <nav className="space-y-6 flex-1">
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Design Tools</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 p-2 rounded-lg bg-white/5 text-white/90 hover:bg-white/10 cursor-pointer transition-colors">
                <Layout size={18} />
                <span>Layout</span>
              </li>
              <li className="flex items-center gap-3 p-2 rounded-lg text-white/60 hover:bg-white/5 cursor-pointer transition-colors">
                <Palette size={18} />
                <span>Colors</span>
              </li>
              <li className="flex items-center gap-3 p-2 rounded-lg text-white/60 hover:bg-white/5 cursor-pointer transition-colors">
                <ImageIcon size={18} />
                <span>Assets</span>
              </li>
            </ul>
          </div>

          {!isPremium && (
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-4 rounded-xl">
              <p className="text-sm font-medium mb-2">Free Plan</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${(messages.filter(m => m.role === 'user').length / messageLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-white/60 mb-4">
                {messageLimit - messages.filter(m => m.role === 'user').length} designs remaining today.
              </p>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Zap size={14} />
                Upgrade to Pro
              </button>
            </div>
          )}
        </nav>

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-rose-400"></div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Guest User</p>
              <p className="text-xs text-white/40 truncate">Free account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Preview & Chat */}
      <div className="flex-1 flex flex-col relative">
        {/* Preview Area */}
        <div className="flex-1 p-8 overflow-auto bg-grid">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-1 w-full md:w-auto">
                <Globe size={14} className="text-white/40" />
                <input
                  type="text"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="Paste website URL to redesign..."
                  className="bg-transparent border-none focus:outline-none text-sm text-white/80 w-full"
                />
                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                >
                  {isImporting ? 'IMPORTING...' : 'IMPORT'}
                </button>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors border border-white/10">
                  Preview
                </button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors">
                  Publish
                </button>
              </div>
            </div>

            {/* Simulated Website Content */}
            <motion.div
              key={JSON.stringify(currentDesign)}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={cn(
                "rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 min-h-[600px] flex flex-col transition-colors duration-500",
                currentDesign.theme === 'dark' ? "bg-black text-white" : "bg-white text-black"
              )}
            >
              {/* Modern Nav */}
              <nav className="px-10 py-6 flex justify-between items-center border-b border-black/5">
                <div className="font-bold text-xl tracking-tighter">{currentDesign.navLogo}</div>
                <div className={cn(
                  "flex gap-8 text-sm font-medium",
                  currentDesign.theme === 'dark' ? "text-gray-400" : "text-gray-500"
                )}>
                  <span>Product</span>
                  <span>Features</span>
                  <span>Pricing</span>
                </div>
                <button className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium",
                  currentDesign.theme === 'dark' ? "bg-white text-black" : "bg-black text-white"
                )}>Get Started</button>
              </nav>

              {/* Hero Section */}
              <div className="flex-1 flex flex-col lg:flex-row items-center px-10 lg:px-20 py-20 gap-12">
                <div className="w-full lg:w-1/2">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tighter mb-6">
                    {currentDesign.heroText.split(' ').map((word, i) => (
                      <span key={i} className={i === currentDesign.heroText.split(' ').length - 1 ? `text-transparent bg-clip-text bg-gradient-to-r from-${currentDesign.accentColor}-600 to-purple-600` : ""}>
                        {word}{" "}
                      </span>
                    ))}
                  </h1>
                  <p className={cn(
                    "text-xl mb-10 max-w-md",
                    currentDesign.theme === 'dark' ? "text-gray-400" : "text-gray-500"
                  )}>
                    {currentDesign.heroSubtext}
                  </p>
                  <div className="flex gap-4">
                    <button className={cn(
                      "px-8 py-4 text-white font-semibold shadow-lg",
                      `bg-${currentDesign.accentColor}-600`,
                      currentDesign.borderRadius === 'full' ? "rounded-full" : "rounded-none"
                    )}>Start Building</button>
                    <button className={cn(
                      "px-8 py-4 border font-semibold",
                      currentDesign.theme === 'dark' ? "border-white/20" : "border-gray-200",
                      currentDesign.borderRadius === 'full' ? "rounded-full" : "rounded-none"
                    )}>Watch Demo</button>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 relative h-full">
                   {/* Real-life imagery usage */}
                   <div className={cn(
                     "w-full h-[300px] lg:h-[400px] overflow-hidden shadow-2xl relative",
                     currentDesign.borderRadius === 'full' ? "rounded-3xl" : "rounded-none"
                    )}>
                     <Image
                       src={currentDesign.imageUrl}
                       alt="Modern workspace"
                       fill
                       className="object-cover"
                     />
                   </div>
                   <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Status</p>
                        <p className="text-sm font-semibold">Optimizing layouts...</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-6 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <div className="mb-4 flex flex-col gap-2">
              <AnimatePresence>
                {messages.slice(-2).map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "text-sm p-3 rounded-xl max-w-[80%]",
                      msg.role === 'user'
                        ? "bg-white/5 border border-white/10 self-end ml-auto"
                        : "bg-indigo-600/10 border border-indigo-500/20 text-indigo-200"
                    )}
                  >
                    {msg.content}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your design vision..."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
              />
              <button
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center transition-colors shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-center mt-3 text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">
              Powered by Framer AI Engine
            </p>
          </div>
        </div>
      </div>

      {/* Premium Upgrade Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl"
            >
              <div className="flex h-[550px]">
                {/* Modal Left - Image/Promo */}
                <div className="w-1/2 relative hidden md:block">
                  <Image
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1964"
                    alt="Premium features"
                    fill
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent z-10"></div>
                  <div className="absolute bottom-10 left-10 pr-10 z-20">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                      <Zap size={24} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Unlock the full power of AI.</h2>
                    <p className="text-white/60">Unlimited designs, custom domains, and premium asset libraries await.</p>
                  </div>
                </div>

                {/* Modal Right - Pricing */}
                <div className="flex-1 p-10 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold">Choose your plan</h3>
                      <p className="text-white/40 text-sm">Cancel anytime. No hidden fees.</p>
                    </div>
                    <button
                      onClick={() => setShowPremiumModal(false)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                      <Lock size={20} className="text-white/40" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-10 overflow-auto pr-2">
                    <div className="p-4 rounded-2xl border border-indigo-500/50 bg-indigo-500/5 flex items-center justify-between group cursor-pointer hover:bg-indigo-500/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Pro Monthly</p>
                          <p className="text-sm text-white/40">Perfect for individual creators</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$29</p>
                        <p className="text-xs text-white/40">per month</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg">Pro Annual</p>
                          <p className="text-sm text-white/40">Best value for agencies</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">$240</p>
                        <p className="text-xs text-white/40">$20 / month</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/5 grayscale opacity-50">
                        <CreditCard size={20} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Stripe</span>
                        <span className="text-[8px] text-white/40 mt-1">COMING SOON</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/5 grayscale opacity-50">
                        <CreditCard size={20} className="mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">PayPal</span>
                        <span className="text-[8px] text-white/40 mt-1">COMING SOON</span>
                      </div>
                    </div>

                    {/* PAYMENT INTEGRATION PLACEHOLDER */}
                    {/*
                      FIXME: To enable subscription payments:
                      1. Initialize Stripe/PayPal SDK here
                      2. Add your API Keys to .env.local
                      3. Implement the handleSubscription function below
                    */}

                    <button
                      onClick={() => {
                        alert("Subscription logic would trigger here. Please integrate Stripe/PayPal in the code.");
                        setIsPremium(true);
                        setShowPremiumModal(false);
                      }}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 group"
                    >
                      Complete Purchase
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center mt-4 text-xs text-white/40">
                      Secure checkout powered by industry standard encryption.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
