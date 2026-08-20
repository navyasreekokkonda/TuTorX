"use client";

import React from "react";
import { Sparkles, Code2, BookOpen, Cpu, Search, CheckCircle2 } from "lucide-react";

const features = [
    {
        title: "LeetCode IDE Interface",
        description: "Professional 40/60 split workspace with a dynamic console drawer for elite coding.",
        icon: <Code2 className="w-5 h-5 text-blue-500" />,
        date: "Just Now",
        isNew: true
    },
    {
        title: "Intelligent Course Search",
        description: "Real-time course filtering to find your learning material instantly.",
        icon: <Search className="w-5 h-5 text-orange-500" />,
        date: "1h ago",
        isNew: true
    },
    {
        title: "NotebookLLM Pro",
        description: "Advanced Markdown parsing and interactive Neural Knowledge Cards for deep learning.",
        icon: <BookOpen className="w-5 h-5 text-purple-500" />,
        date: "2h ago",
        isNew: true
    },
    {
        title: "Jarvis Control Center",
        description: "Futuristic dashboard redesign with real-time metrics and sleek glassmorphism.",
        icon: <Cpu className="w-5 h-5 text-green-500" />,
        date: "Yesterday",
        isNew: false
    }
];

export default function NotificationCenter({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="absolute top-24 right-8 w-96 bg-[#0e0e11] border border-white/5 rounded-[32px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Platform Updates</span>
                </div>
                <button 
                    onClick={onClose}
                    className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                >
                    Dismiss
                </button>
            </div>

            {/* Content */}
            <div className="max-h-[450px] overflow-y-auto custom-scroll p-4 space-y-2">
                {features.map((feature, idx) => (
                    <div 
                        key={idx}
                        className="group p-5 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all duration-300 relative"
                    >
                        {feature.isNew && (
                            <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse" />
                        )}
                        
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">
                                        {feature.title}
                                    </h4>
                                    <span className="text-[9px] font-medium text-gray-500">
                                        {feature.date}
                                    </span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-gray-500 group-hover:text-gray-400 transition-colors line-clamp-2">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
                <button 
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:bg-orange-500 hover:text-black transition-all"
                >
                    Clear All Notifications
                </button>
            </div>
        </div>
    );
}
