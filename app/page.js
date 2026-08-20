"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Zap,
  Sparkles,
  Code2,
  Layers,
  BookOpen,
  Terminal,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Play,
  Sliders,
  BarChart3,
  Cpu,
  ShieldCheck,
  Award,
  ChevronRight,
  Flame,
} from "lucide-react";

const featureShowcase = [
  {
    id: "course",
    title: "1. AI Course & Roadmap Studio",
    subtitle: "Synthesize Multi-Module Curriculums in Seconds",
    icon: Layers,
    badge: "TutorX Neural Engine",
    color: "from-amber-500/20 to-orange-500/10 border-orange-500/30",
    preview: {
      type: "course",
      title: "Generated Course: Dynamic Programming & Tabulation Mastery",
      modules: [
        { name: "Module 1: 1D/2D State Transition Equations", status: "Completed O(1) Space", active: true },
        { name: "Module 2: Bottom-Up Tabulation Matrix Optimization", status: "Live Practice Ready", active: false },
        { name: "Module 3: Advanced Knapsack & Palindromic Partitioning", status: "AI Quizzes Available", active: false },
      ],
      codeSnippet: `// Space-Optimized Fibonacci Tabulation (O(1) Auxiliary Memory)\nfunction fibTabulation(n) {\n    if (n <= 1) return n;\n    let prev2 = 0, prev1 = 1;\n    for (let i = 2; i <= n; i++) {\n        let curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}\nconsole.log("Output for n=50:", fibTabulation(50)); // 12586269025`,
    },
  },
  {
    id: "notebook",
    title: "2. NotebookLLM Studio + Sliders",
    subtitle: "Dual-Pane Document Q&A & Zoom Sliders",
    icon: BookOpen,
    badge: "Interactive Sliders & TTS",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
    preview: {
      type: "notebook",
      sliderRatio: "60% Document / 40% AI Chat",
      textZoom: "16px Crisp Typography",
      chatHistory: [
        { role: "user", text: "+ Summarize Key Takeaways from System Design PDF" },
        {
          role: "assistant",
          text: "## High-Availability Caching Invariants\n1. **Doubly Linked List + HashMap** enables O(1) LRU eviction.\n2. **Consistent Hashing** minimizes cache invalidation during cluster scaling.",
        },
      ],
    },
  },
  {
    id: "practice",
    title: "3. LeetCode / TUF Practice Lab",
    subtitle: "6 Target Patterns & Intensity Sliders",
    icon: Code2,
    badge: "Multi-Language Runner",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30",
    preview: {
      type: "practice",
      selectedPattern: "Sliding Window [FAANG High Frequency]",
      intensitySlider: "Sprint Count: [====o=====] 5 Problems (Daily Sprint)",
      difficultyPill: "Medium Standard Benchmark",
      codeRunner: `// Sliding Window Maximum (O(N) Deque Solution)\nfunction maxSlidingWindow(nums, k) {\n    const deque = [], res = [];\n    for (let i = 0; i < nums.length; i++) {\n        while (deque.length && deque[0] <= i - k) deque.shift();\n        while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();\n        deque.push(i);\n        if (i >= k - 1) res.push(nums[deque[0]]);\n    }\n    return res;\n}\n// Status: Accepted | Time: 12ms | Memory: 42.1 MB`,
    },
  },
  {
    id: "analytics",
    title: "4. Telemetry & Learning Insights",
    subtitle: "Real-Time Activity Pulse & Skill Distribution",
    icon: BarChart3,
    badge: "Telemetry Engine",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
    preview: {
      type: "analytics",
      streak: "🔥 7 DAYS ACTIVE STREAK",
      metrics: [
        { label: "Total Courses", value: "12", trend: "+2 This Month" },
        { label: "Topics Mastered", value: "48", trend: "Top 5% User" },
        { label: "Avg. Completion", value: "94%", trend: "Optimal Pace" },
      ],
      skillBars: [
        { skill: "Algorithms & DSA", percent: "85%" },
        { skill: "System Architecture", percent: "65%" },
        { skill: "Distributed Caching", percent: "50%" },
      ],
    },
  },
];

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("course");
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-rotate feature showcase
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const idx = featureShowcase.findIndex((f) => f.id === prev);
        const nextIdx = (idx + 1) % featureShowcase.length;
        return featureShowcase[nextIdx].id;
      });
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentFeature = featureShowcase.find((f) => f.id === activeTab) || featureShowcase[0];

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-gray-200 font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">
      {/* FLOATING NAVBAR */}
      <nav className="fixed top-3 inset-x-0 z-50 px-4">
        <div className="max-w-6xl mx-auto bg-[#121216]/90 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3.5 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Zap className="w-4 h-4 text-black fill-current" />
            </div>
            <span className="text-lg font-black tracking-wider text-white uppercase italic">
              Tutor<span className="text-orange-500">X</span>
            </span>
            <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-[10px] uppercase tracking-wider">
              LeetCode & TUF Grade Engine
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/demo")}
              className="px-4 py-2 rounded-full bg-[#18181d] hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Instant Guest Sandbox</span>
            </button>
            <button
              onClick={() => router.push(isSignedIn ? "/dashboard" : "/sign-in")}
              className="px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-md shadow-orange-500/20"
            >
              {isSignedIn ? "Go to Dashboard →" : "Get Started Free →"}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-orange-500/20 via-amber-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider animate-pulse">
            <Terminal className="w-3.5 h-3.5" /> Production-Grade Engineering & DSA Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.1]">
            Master Algorithms, DSA & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 italic">
              System Architecture
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 leading-relaxed font-normal">
            Synthesize deep multi-chapter curriculums, converse with interactive dual-pane NotebookLLMs featuring zoom & split sliders, and master algorithms with our high-speed multi-language LeetCode & TUF practice laboratory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => router.push(isSignedIn ? "/dashboard" : "/sign-up")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-xl shadow-orange-500/25 flex items-center justify-center gap-3"
            >
              Start Free Training Session <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#141418] hover:bg-[#1a1a20] border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-3 shadow-sm"
            >
              <Code2 className="w-4 h-4 text-orange-400" /> Try Guest Sandbox (No Login Needed)
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> 2 Free Deep-Dive Courses</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> JS, Python, Java & C++ Runner</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Zero Friction Sandbox</span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE VIDEO / FEATURE WALKTHROUGH INTRO SHOWCASE */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto bg-[#121216] border border-white/[0.08] rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top Showcase Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold uppercase tracking-wider text-[10px]">Live Feature Walkthrough Intro</span>
                <h2 className="text-lg font-bold text-white tracking-tight uppercase">Platform Capabilities Simulator</h2>
              </div>
              <p className="text-gray-500 text-xs mt-0.5">Click any feature tab below to inspect live screen simulation, interactive sliders, and code runners.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition flex items-center gap-1.5 ${
                  isPlaying ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-white/5 border-white/10 text-gray-400"
                }`}
              >
                <Play className={`w-3 h-3 ${isPlaying ? "fill-current animate-pulse" : ""}`} />
                {isPlaying ? "Auto-Loop Active" : "Paused"}
              </button>
            </div>
          </div>

          {/* Feature Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-6">
            {featureShowcase.map((f) => {
              const Icon = f.icon;
              const isSelected = activeTab === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveTab(f.id);
                    setIsPlaying(false);
                  }}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between h-28 ${
                    isSelected
                      ? "bg-[#16161c] border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/50 scale-[1.02]"
                      : "bg-[#141418] border-white/[0.06] hover:border-white/15 hover:bg-[#18181d]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-2 rounded-xl border bg-gradient-to-br ${f.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-gray-300 uppercase tracking-tight">
                      {f.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-tight leading-tight">{f.title}</h3>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{f.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Simulated Screen Stage */}
          <div className="bg-[#0e0e12] border border-white/[0.08] rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-500">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 font-mono text-gray-400 text-[11px] font-semibold">
                  tutorx-ai.engine // {currentFeature.title.toLowerCase().replace(/ /g, "_")}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-orange-400 font-mono text-[10px] uppercase font-bold">
                Live Interactive Preview
              </span>
            </div>

            {/* Preview Content based on active tab */}
            {currentFeature.preview.type === "course" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141418] p-4 rounded-xl border border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-orange-400 tracking-wider">AI Generated Roadmap</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{currentFeature.preview.title}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-[10px] uppercase">
                    3 Modules Synthesized
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentFeature.preview.modules.map((m, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${m.active ? "bg-orange-500/10 border-orange-500/30 text-white" : "bg-[#141418] border-white/[0.05] text-gray-400"}`}>
                      <p className="text-xs font-bold leading-tight mb-1">{m.name}</p>
                      <p className="text-[10px] text-orange-400 font-mono">{m.status}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#141418] border border-white/[0.08] rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                  <pre className="leading-relaxed">{currentFeature.preview.codeSnippet}</pre>
                </div>
              </div>
            )}

            {currentFeature.preview.type === "notebook" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#141418] border border-white/[0.06] space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-300">Split Ratio Slider (`40% to 75%`)</span>
                      <span className="text-orange-400 font-mono">{currentFeature.preview.sliderRatio}</span>
                    </div>
                    <div className="w-full h-2 bg-[#18181d] rounded-full overflow-hidden">
                      <div className="w-3/5 h-full bg-orange-500 rounded-full" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#141418] border border-white/[0.06] space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-gray-300">Typography Scale (`12px to 20px`)</span>
                      <span className="text-orange-400 font-mono">{currentFeature.preview.textZoom}</span>
                    </div>
                    <div className="w-full h-2 bg-[#18181d] rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-orange-500 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentFeature.preview.chatHistory.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] p-4 rounded-2xl text-xs leading-relaxed ${m.role === "user" ? "bg-white text-black font-bold" : "bg-[#141418] border border-white/[0.08] text-gray-200"}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentFeature.preview.type === "practice" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#141418] border border-orange-500/30">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Target Pattern</span>
                    <p className="text-xs font-bold text-orange-400 mt-0.5">{currentFeature.preview.selectedPattern}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#141418] border border-white/[0.06]">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Sprint Intensity</span>
                    <p className="text-xs font-bold text-white mt-0.5">{currentFeature.preview.intensitySlider}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#141418] border border-white/[0.06]">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Logic Tier</span>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">{currentFeature.preview.difficultyPill}</p>
                  </div>
                </div>

                <div className="bg-[#141418] border border-white/[0.08] rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                  <pre className="leading-relaxed">{currentFeature.preview.codeRunner}</pre>
                </div>
              </div>
            )}

            {currentFeature.preview.type === "analytics" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">{currentFeature.preview.streak}</span>
                  <span className="px-3 py-1 rounded-full bg-orange-500 text-black font-black text-[10px] uppercase">Top 5% Telemetry</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentFeature.preview.metrics.map((met, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#141418] border border-white/[0.06]">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{met.label}</p>
                      <p className="text-2xl font-black text-white tabular-nums my-1">{met.value}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">{met.trend}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-2">
                  {currentFeature.preview.skillBars.map((sk, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-300">{sk.skill}</span>
                        <span className="text-orange-400 font-mono">{sk.percent}</span>
                      </div>
                      <div className="h-2 bg-[#141418] rounded-full overflow-hidden border border-white/[0.05]">
                        <div className="h-full bg-gradient-to-r from-orange-600 to-amber-400 rounded-full" style={{ width: sk.percent }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHY TUTORX COMPARISON MATRIX */}
      <section className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold uppercase tracking-wider text-orange-400">
              Platform Matrix Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Why Engineers Choose TutorX AI</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-[#121216] border border-white/[0.08] rounded-2xl overflow-hidden text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#16161c] border-b border-white/[0.08] text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4 sm:p-5">Feature / Dimension</th>
                  <th className="p-4 sm:p-5 text-orange-400">TutorX AI Ecosystem</th>
                  <th className="p-4 sm:p-5 text-gray-500">Standard Coding Platforms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-gray-300 font-medium">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Course Synthesis Engine</td>
                  <td className="p-4 sm:p-5 text-green-400 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Custom Multi-Chapter Roadmaps in Seconds</td>
                  <td className="p-4 sm:p-5 text-gray-500">Rigid, static pre-recorded video playlists</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Notebook Document Analysis</td>
                  <td className="p-4 sm:p-5 text-green-400 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Dual-Pane Split Sliders + 20px Zoom + TTS</td>
                  <td className="p-4 sm:p-5 text-gray-500">Basic static PDF viewer without Q&A</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Algorithmic Practice Lab</td>
                  <td className="p-4 sm:p-5 text-green-400 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> LeetCode & TUF Grade Patterns + Sliders</td>
                  <td className="p-4 sm:p-5 text-gray-500">Generic text editors without pattern guidance</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Frictionless Evaluation</td>
                  <td className="p-4 sm:p-5 text-green-400 font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /> Instant Guest Sandbox (`/demo`) No Login</td>
                  <td className="p-4 sm:p-5 text-gray-500">Forced paywalls and mandatory login blocks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/[0.06] text-center text-xs text-gray-500 font-semibold uppercase tracking-wider bg-[#0e0e12]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 TutorX AI Engineering Platform. All rights reserved.</p>
          <div className="flex items-center gap-6 text-gray-400">
            <button onClick={() => router.push("/demo")} className="hover:text-orange-400 transition font-bold">Try Guest Demo</button>
            <button onClick={() => router.push("/sign-in")} className="hover:text-orange-400 transition font-bold">Sign In</button>
            <button onClick={() => router.push("/sign-up")} className="hover:text-orange-400 transition font-bold">Register Account</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
