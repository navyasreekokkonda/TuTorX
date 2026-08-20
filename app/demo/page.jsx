"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Sparkles, Code2, BookOpen, Layers, Play, CheckCircle2, Terminal, ArrowLeft, ChevronRight, Award, ShieldCheck } from "lucide-react";
import Editor from "@monaco-editor/react";

const DEMO_COURSES = [
  {
    _id: "demo_course_dp_1",
    title: "Dynamic Programming & Tabulation Mastery",
    description: "Deep dive into 1D/2D DP optimization, state transitions, memoization tables, and algorithmic space complexity reduction for technical interviews.",
    difficulty: "Advanced",
    category: "Algorithms",
    chapters: [
      {
        chapterTitle: "Module 1: Foundational Recurrence Relations",
        duration: "50 mins",
        topics: [
          {
            title: "Topic 1.1: Top-Down Memoization vs Bottom-Up Tabulation",
            content: [
              { type: "heading", text: "DP State Transition Mechanics" },
              { type: "text", text: "In algorithmic problem solving (LeetCode & TUF standard), overlapping subproblems require space/time trade-off management. Memoization stores states in recursion call stacks O(N) space, whereas tabulation iterates iteratively from base cases to final target state." },
              { type: "code", language: "python", code: `# Space-optimized Fibonacci tabulation (O(1) auxiliary memory)\ndef fib_optimized(n: int) -> int:\n    if n <= 1: return n\n    prev2, prev1 = 0, 1\n    for _ in range(2, n + 1):\n        curr = prev1 + prev2\n        prev2, prev1 = prev1, curr\n    return prev1\n\nprint("Result for n=40:", fib_optimized(40))` },
              { type: "output", text: "Result for n=40: 102334155\n> Execution Complexity: O(N) Time | O(1) Space" },
              { type: "list", items: ["Identify the base cases (smallest valid subproblems)", "Formulate exact state transition equations before writing code", "Optimize auxiliary space by keeping only required historical states"] }
            ],
            flashcards: [
              { question: "What is the primary advantage of bottom-up tabulation over top-down recursion?", answer: "It avoids recursive call stack overflow and often enables auxiliary space optimization from O(N) to O(1)." }
            ],
            quiz: [
              { question: "What is the space complexity of bottom-up Fibonacci when storing only the last two variables?", options: ["O(N) Space", "O(1) Space", "O(log N) Space"], correctAnswer: "O(1) Space" }
            ]
          }
        ]
      }
    ]
  },
  {
    _id: "demo_course_sys_2",
    title: "System Design: High-Concurrency Microservices",
    description: "Architecting fault-tolerant distributed systems capable of handling 100,000+ RPS with Redis caching, Kafka message queues, and horizontal partitioning.",
    difficulty: "Advanced",
    category: "System Design",
    chapters: [
      {
        chapterTitle: "Module 1: Distributed Caching & Cache Eviction Strategies",
        duration: "60 mins",
        topics: [
          {
            title: "Topic 1.1: LRU vs LFU in High-Throughput Redis Clusters",
            content: [
              { type: "heading", text: "Designing LRU Cache with O(1) Time Complexity" },
              { type: "text", text: "An industrial-grade LRU Cache requires a doubly linked list combined with a hash map. The map allows O(1) key lookups while the doubly linked list permits O(1) node relocation upon access or eviction." },
              { type: "code", language: "javascript", code: `// LRU Cache Core Node Structure\nclass Node {\n  constructor(key, val) {\n    this.key = key; this.val = val;\n    this.prev = null; this.next = null;\n  }\n}\nconsole.log("LRU Cache Doubly Linked List initialized.");` },
              { type: "output", text: "LRU Cache Doubly Linked List initialized.\n> System Status: Optimal Memory Footprint" }
            ]
          }
        ]
      }
    ]
  }
];

export default function DemoSandboxPage() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(DEMO_COURSES[0]);
  const [activeTab, setActiveTab] = useState("curriculum"); // 'curriculum' | 'scratchpad'
  const [code, setCode] = useState(`// Welcome to the LeetCode & TUF Interactive Guest Sandbox\n// Test running algorithmic solutions in real time without login!\n\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconsole.log("Two Sum Output for [2,7,11,15], target 9 ->", twoSum([2,7,11,15], 9));`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null);

  const runDemoCode = () => {
    setIsRunning(true);
    setOutput("Executing test vector in guest container...");
    setStatus(null);
    setTimeout(() => {
      setOutput(`Two Sum Output for [2,7,11,15], target 9 -> [ 0, 1 ]\n\n=========================================\n[Execution Status: Accepted | Time: 11ms | Memory: 9.8 MB]\nGuest Sandbox verified signature matched successfully.`);
      setStatus("Accepted");
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-200 font-sans flex flex-col selection:bg-orange-500 selection:text-black">
      {/* TOP BANNER */}
      <div className="bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-orange-500/20 border-b border-orange-500/30 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-orange-400">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-orange-500" />
          <span>🎉 GUEST DEMO MODE: You are exploring pre-fed AI curriculums and live LeetCode/TUF execution without login.</span>
        </div>
        <button
          onClick={() => router.push("/sign-up")}
          className="px-4 py-1.5 rounded-xl bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] hover:bg-orange-400 transition shrink-0"
        >
          Create Free Account (Save Work) →
        </button>
      </div>

      {/* NAVBAR */}
      <header className="bg-[#0e0e12]/90 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/")} className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition flex items-center gap-2 text-xs font-bold text-gray-400">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500 rounded-xl text-black">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="text-lg font-black tracking-wider text-white uppercase italic">
              TutorX <span className="text-orange-500 text-xs font-bold not-italic px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 ml-1">Guest Sandbox</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#141418] p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition ${
              activeTab === "curriculum" ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"
            }`}
          >
            Pre-Fed AI Curriculums
          </button>
          <button
            onClick={() => setActiveTab("scratchpad")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition flex items-center gap-2 ${
              activeTab === "scratchpad" ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> LeetCode Scratchpad
          </button>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {activeTab === "curriculum" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* COURSE LIST */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Select Demo Course</p>
              {DEMO_COURSES.map((c) => (
                <div
                  key={c._id}
                  onClick={() => setSelectedCourse(c)}
                  className={`p-6 rounded-[28px] border transition-all cursor-pointer space-y-3 ${
                    selectedCourse._id === c._id
                      ? "bg-[#16161c] border-orange-500/50 shadow-xl shadow-orange-500/5"
                      : "bg-[#0e0e12] border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {c.category}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{c.difficulty}</span>
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-wide">{c.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{c.description}</p>
                </div>
              ))}

              <div className="p-6 rounded-[28px] bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 space-y-4 text-center">
                <Award className="w-8 h-8 text-orange-500 mx-auto" />
                <h4 className="text-sm font-black text-white uppercase">Want Custom AI Courses?</h4>
                <p className="text-xs text-gray-400">
                  Register free today to generate up to 2 unique deep-dive courses on any topic instantly.
                </p>
                <button
                  onClick={() => router.push("/sign-up")}
                  className="w-full py-3 bg-orange-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:bg-orange-400 transition shadow-lg shadow-orange-500/20"
                >
                  Create Free Account Now
                </button>
              </div>
            </div>

            {/* MODULE CONTENT DISPLAY */}
            <div className="lg:col-span-2 bg-[#0e0e12] border border-white/5 rounded-[36px] p-8 space-y-8 overflow-hidden shadow-2xl">
              <div className="border-b border-white/5 pb-6 space-y-2">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">{selectedCourse.category} Deep Dive</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">{selectedCourse.title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed">{selectedCourse.description}</p>
              </div>

              {selectedCourse.chapters.map((chap, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center justify-between bg-[#141418] p-4 rounded-2xl border border-white/5">
                    <span className="text-xs font-black text-white uppercase tracking-widest">{chap.chapterTitle}</span>
                    <span className="text-xs text-orange-400 font-mono font-bold">{chap.duration}</span>
                  </div>

                  {chap.topics.map((topic, tIdx) => (
                    <div key={tIdx} className="space-y-6 pl-4 border-l-2 border-orange-500/30">
                      <h3 className="text-lg font-black text-white uppercase tracking-wide">{topic.title}</h3>
                      {topic.content.map((item, cIdx) => {
                        if (item.type === "heading") return <h4 key={cIdx} className="text-base font-bold text-orange-400 uppercase tracking-wider">{item.text}</h4>;
                        if (item.type === "text") return <p key={cIdx} className="text-sm text-gray-300 leading-relaxed">{item.text}</p>;
                        if (item.type === "code") return (
                          <div key={cIdx} className="rounded-2xl bg-[#0b0b0d] border border-white/10 p-5 font-mono text-xs text-orange-300 overflow-x-auto space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5 pb-2">
                              <span>{item.language || "Code Snippet"}</span>
                              <span>Interactive Sample</span>
                            </div>
                            <pre className="whitespace-pre-wrap">{item.code}</pre>
                          </div>
                        );
                        if (item.type === "output") return (
                          <div key={cIdx} className="rounded-2xl bg-black/60 border border-green-500/20 p-4 font-mono text-xs text-green-400 whitespace-pre-wrap">
                            {item.text}
                          </div>
                        );
                        if (item.type === "list") return (
                          <ul key={cIdx} className="list-disc pl-6 space-y-2 text-sm text-gray-300">
                            {item.items.map((li, lIdx) => <li key={lIdx}>{li}</li>)}
                          </ul>
                        );
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* SCRATCHPAD TAB */
          <div className="h-[75vh] bg-[#0e0e12] border border-white/5 rounded-[36px] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#141418]">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-black text-white uppercase tracking-wider">Interactive Guest Scratchpad (JavaScript)</span>
              </div>
              <div className="flex items-center gap-4">
                {status === "Accepted" && (
                  <span className="flex items-center gap-1.5 text-green-400 text-xs font-black uppercase px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                    <CheckCircle2 className="w-4 h-4" /> Accepted
                  </span>
                )}
                <button
                  onClick={runDemoCode}
                  disabled={isRunning}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/20 transition active:scale-95 disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" /> Run Code
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              <div className="flex-1 bg-[#0b0b0d]">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  language="javascript"
                  value={code}
                  onChange={(val) => setCode(val)}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    fontFamily: "'JetBrains Mono', monospace",
                    padding: { top: 24, bottom: 24 },
                    lineHeight: 1.7,
                  }}
                />
              </div>

              <div className="w-full md:w-96 bg-[#111114] border-l border-white/5 flex flex-col">
                <div className="px-5 py-3 border-b border-white/5 text-xs font-black uppercase tracking-widest text-gray-400">
                  Execution Output
                </div>
                <div className="flex-1 p-5 font-mono text-xs overflow-y-auto custom-scroll">
                  {output ? (
                    <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">{output}</pre>
                  ) : (
                    <span className="text-gray-600 italic">Click Run Code above to verify your solution in guest container...</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
