"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Target, 
  Flame, 
  BarChart3, 
  Cpu, 
  X, 
  ChevronRight,
  Sparkles,
  Terminal,
  Activity
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function JarvisAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const [greeting, setGreeting] = useState("Initializing System...");
  const [stats, setStats] = useState({
    java: 70,
    dsa: 40,
    react: 25
  });

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-8 w-14 h-14 rounded-full bg-[#0b0b0c] border border-orange-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-110 transition-transform z-[60] group cursor-pointer"
      >
        <div className="absolute inset-0 rounded-full border border-orange-500/20 animate-ping opacity-20" />
        <Cpu className="w-6 h-6 text-orange-500 group-hover:rotate-180 transition-transform duration-700" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={() => setIsOpen(false)}
      />

      {/* HUD Container */}
      <div className="relative w-full max-w-4xl bg-[#0b0b0c]/80 border border-orange-500/20 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-[80vh] md:h-auto animate-in zoom-in-95 duration-500">
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10 opacity-20" />

        {/* Header/Left Sidebar (HUD Info) */}
        <div className="w-full md:w-80 bg-orange-500/5 border-r border-orange-500/10 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                <Cpu className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-xs font-black tracking-widest text-orange-500/80 uppercase">
                System A.I. / Jarvis
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white leading-none">
                {greeting},
              </h2>
              <h3 className="text-4xl font-black text-orange-500 uppercase tracking-tighter">
                {user?.firstName || "Operator"}
              </h3>
            </div>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,1)]" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest underline underline-offset-8 decoration-orange-500/30">
                  Neural Link Active
                </span>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <div className="w-2 h-2 rounded-full bg-gray-600" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Sat-Link: Stable
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsOpen(false)}
            className="mt-8 flex items-center gap-2 text-xs font-black text-gray-500 hover:text-orange-500 transition-colors uppercase tracking-[0.3em] group cursor-pointer"
          >
            <X className="w-4 h-4" /> Disconnect
          </button>
        </div>

        {/* Main Interface Content */}
        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scroll">
          
          {/* TODAY'S FOCUS */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase flex items-center gap-2">
              <Target className="w-3 h-3" /> Mission Objectives
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-orange-500/20 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white">Graph Algorithms</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-all" />
                </div>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Depth-First Search Implementation</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-orange-500/20 transition-all group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white">React Performance</span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-all" />
                </div>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Memoization & Virtualization</p>
              </div>
            </div>
          </section>

          {/* DAILY CHALLENGE */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase flex items-center gap-2">
              <Flame className="w-3 h-3 text-orange-500" /> Combat Trial
            </h4>
            <div className="relative p-6 bg-orange-500 border border-orange-400 rounded-3xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform duration-700">
                <Terminal className="w-16 h-16 text-black" />
              </div>
              <p className="text-[10px] font-black text-black/60 uppercase tracking-widest mb-1">Today's Protocol</p>
              <h5 className="text-xl font-black text-black leading-tight mb-4 uppercase">Solve 1 Dynamic Programming Problem</h5>
              <button className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:scale-105 transition-transform">
                Begin Trial
              </button>
            </div>
          </section>

          {/* LEARNING PROGRESS */}
          <section className="space-y-4 md:col-span-2">
            <h4 className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase flex items-center gap-2">
              <BarChart3 className="w-3 h-3" /> Core Competencies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ProgressTile label="JAVA SYSTEM" value={stats.java} color="orange" />
              <ProgressTile label="ALGORITHMS" value={stats.dsa} color="blue" />
              <ProgressTile label="REACT ARCH" value={stats.react} color="purple" />
            </div>
          </section>

          {/* AI RECOMMENDATIONS */}
          <section className="space-y-4 md:col-span-2 p-6 bg-white/5 border border-white/5 rounded-3xl border-dashed">
            <h4 className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Neural Recommendation
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed italic">
              "System analysis suggests a 15% skill gap in Node.js asynchronous patterns. I recommend initializing the 'Event Loop Deep Dive' module to optimize your backend proficiency."
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

function ProgressTile({ label, value, color }) {
  const colors = {
    orange: "bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    blue: "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    purple: "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">{label}</span>
        <span className="text-xs font-black text-white">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
