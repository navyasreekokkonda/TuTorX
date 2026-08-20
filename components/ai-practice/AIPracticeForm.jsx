"use client";

import React, { useState } from "react";
import { Loader2, Sparkles, Code, Cpu, Target, Layers, GitBranch, Zap, Trophy, ShieldAlert } from "lucide-react";

const patternCards = [
  {
    id: "Sliding Window",
    title: "Sliding Window",
    desc: "Subarrays, contiguous sequences & dynamic window sizing",
    icon: Layers,
    tag: "Most Asked in FAANG",
    color: "from-amber-500/20 to-orange-500/10 border-orange-500/30",
  },
  {
    id: "Two Pointers",
    title: "Two Pointers",
    desc: "Sorted arrays, palindrome validation & pointer convergence",
    icon: Target,
    tag: "High Frequency",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
  },
  {
    id: "Dynamic Programming",
    title: "Dynamic Programming",
    desc: "Memoization, tabulation & optimal substructure mastery",
    icon: Cpu,
    tag: "Hard Mastery",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
  },
  {
    id: "Graphs",
    title: "Graphs & BFS/DFS",
    desc: "Topological sort, shortest path & grid traversals",
    icon: GitBranch,
    tag: "Core Systems",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  },
  {
    id: "Trees",
    title: "Trees & BST",
    desc: "Binary tree traversals, LCA & path sum optimization",
    icon: GitBranch,
    tag: "Fundamental",
    color: "from-rose-500/20 to-red-500/10 border-rose-500/30",
  },
  {
    id: "Binary Search",
    title: "Binary Search",
    desc: "Logarithmic search, search space reduction & matrix search",
    icon: Zap,
    tag: "Must Know",
    color: "from-indigo-500/20 to-violet-500/10 border-indigo-500/30",
  },
];

const difficulties = [
  { label: "Easy", desc: "Warmup & Core Mechanics", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  { label: "Medium", desc: "Standard Interview Benchmark", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { label: "Hard", desc: "FAANG / TUF Advanced Tier", color: "text-red-400 bg-red-500/10 border-red-500/20" },
];

export default function AIPracticeForm({ onGenerate, isLoading }) {
  const [pattern, setPattern] = useState("Sliding Window");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ pattern, count, difficulty });
  };

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1: INTERACTIVE PATTERN CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              1. Select DSA Target Pattern
            </h3>
            <span className="text-xs font-semibold text-gray-500">Selected: <span className="text-orange-400 font-bold">{pattern}</span></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patternCards.map((card) => {
              const Icon = card.icon;
              const isSelected = pattern === card.id;
              return (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => setPattern(card.id)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-36 ${
                    isSelected
                      ? "bg-[#16161c] border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/50 scale-[1.02]"
                      : "bg-[#121216] border-white/[0.07] hover:border-white/20 hover:bg-[#15151a]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${card.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-gray-300 uppercase tracking-tight">
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight mb-1">{card.title}</h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{card.desc}</p>
                  </div>

                  {isSelected && (
                    <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: INTERACTIVE SLIDERS AND DIFFICULTY TIERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#121216] border border-white/[0.07] rounded-2xl p-6">
          {/* INTENSITY SLIDER */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-400" />
                2. Problem Count & Sprint Intensity
              </label>
              <span className="text-sm font-mono font-bold text-orange-400 bg-orange-500/10 px-3 py-0.5 rounded-full border border-orange-500/20">
                {count} {count === 1 ? "Problem" : "Problems"}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <input
                type="range"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full h-2 bg-[#18181d] rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <span>1 (Quick Check)</span>
                <span>5 (Standard Practice)</span>
                <span>10 (Mastery Marathon)</span>
              </div>
            </div>
          </div>

          {/* LOGIC DIFFICULTY TIERS */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
              3. Logic Tier & Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {difficulties.map((d) => {
                const isSelected = difficulty === d.label;
                return (
                  <button
                    key={d.label}
                    type="button"
                    onClick={() => setDifficulty(d.label)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? `${d.color} shadow-sm ring-1 ring-current`
                        : "bg-[#18181d] border-white/[0.06] text-gray-400 hover:text-white hover:border-white/15"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">{d.label}</span>
                    <span className="text-[9px] text-gray-500 line-clamp-1">{d.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* STEP 3: SLEEK LAUNCH BAR */}
        <div className="pt-2 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto min-w-[340px] px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-bold uppercase tracking-wider text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating {pattern} Curriculum...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Initialize DSA Training Session →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
