"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { ChevronDown, ChevronRight, Play, CheckCircle2, XCircle, Code2, Terminal, BookOpen, AlertCircle, Loader2 } from "lucide-react";

export default function ProblemDisplay({ session, onRun, onSubmit, isRunning }) {
    const [activeTab, setActiveTab] = useState(0);
    const [language, setLanguage] = useState("javascript");
    const [codeMap, setCodeMap] = useState({});
    const [outputs, setOutputs] = useState({});
    const [showTestCases, setShowTestCases] = useState(false);

    const problems = session?.problems || [];
    const currentProblem = problems[activeTab];

    useEffect(() => {
        if (currentProblem && !codeMap[activeTab]) {
            setCodeMap(prev => ({
                ...prev,
                [activeTab]: {
                    javascript: currentProblem.starter_code?.javascript || "// Write your JavaScript code here\n",
                    python: currentProblem.starter_code?.python || "# Write your Python code here\n",
                    java: currentProblem.starter_code?.java || "// Write your Java code here\n",
                }
            }));
        }
    }, [activeTab, currentProblem]);

    const handleCodeChange = (value) => {
        setCodeMap(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [language]: value
            }
        }));
        if (outputs[activeTab]) {
            setOutputs(prev => {
                const newOutputs = { ...prev };
                delete newOutputs[activeTab];
                return newOutputs;
            });
        }
    };

    const handleAction = async (isSubmit) => {
        const code = codeMap[activeTab]?.[language] || "";
        if (!code.trim()) {
            alert("Please write some code before running.");
            return;
        }

        setShowTestCases(true);

        const res = await (isSubmit ? onSubmit : onRun)({
            sessionId: session._id,
            problemIndex: activeTab,
            code,
            language,
            testCases: currentProblem?.test_cases || [],
            runnerLogic: currentProblem?.runner_logic,
        });

        if (res.error || res.success === false) {
            setOutputs(prev => ({ ...prev, [activeTab]: { 
                passed: 0, 
                total: currentProblem?.test_cases?.length || 0,
                error: res.message || res.error || "Execution failed",
                results: [] 
            }}));
            return;
        }

        setOutputs(prev => ({ ...prev, [activeTab]: res }));
    };

    if (!problems.length) {
        return (
            <div className="flex flex-col items-center justify-center p-20 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-gray-600 opacity-20" />
                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">No problems found in this session</p>
            </div>
        );
    }

    if (!currentProblem) return null;

    const currentOutput = outputs[activeTab];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
            {/* Problem Navbar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 px-2 no-print">
                <div className="flex gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/5">
                    {problems.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveTab(i)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === i
                                ? "bg-orange-500 text-black shadow-lg shadow-orange-500/10"
                                : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            P{i + 1}
                        </button>
                    ))}
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        {language}
                    </div>
                    <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[9px] font-black text-orange-500 uppercase tracking-widest animate-pulse">
                        Live Session
                    </div>
                </div>
            </div>

            <div className="flex flex-1 gap-4 overflow-hidden">
                {/* 1. LEFT PANEL: PROBLEM SPECS (40%) */}
                <div className="w-[40%] bg-[#0e0e11]/40 backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex items-center gap-3 px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                        <BookOpen className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Problem Description</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-10 custom-scroll space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-white tracking-tight leading-none uppercase">
                                {currentProblem.title}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-md border border-green-500/10">Med</span>
                                <span className="px-2 py-0.5 bg-white/5 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-md border border-white/5 italic">Linked Lists</span>
                            </div>
                            <div className="prose prose-invert prose-orange max-w-none prose-p:text-gray-400 prose-p:leading-relaxed prose-p:text-sm">
                                <p>{currentProblem.description}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <section className="space-y-3">
                                <h3 className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.2em]">Constraints</h3>
                                <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5 font-mono text-[11px] leading-relaxed text-gray-500">
                                    {currentProblem.constraints}
                                </div>
                            </section>

                            <section className="space-y-3">
                                <h3 className="text-[10px] font-black text-orange-500/60 uppercase tracking-[0.2em]">Example Case</h3>
                                <div className="p-6 bg-[#111113] rounded-3xl border border-white/5 space-y-5">
                                    <div>
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2">Input</p>
                                        <code className="text-xs text-orange-400 font-mono">{currentProblem.sample_input}</code>
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-2">Output</p>
                                        <code className="text-xs text-green-400 font-mono">{currentProblem.sample_output}</code>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* 2. RIGHT PANEL: THE WORKSPACE (60%) */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {/* EDITOR SECTION */}
                    <div className={`flex-1 bg-[#0b0b0d] border border-white/5 rounded-[40px] overflow-hidden flex flex-col relative shadow-2xl transition-all duration-500 ${showTestCases ? "h-2/3" : "h-full"}`}>
                        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.01]">
                            <div className="flex items-center gap-4">
                                <Code2 className="w-4 h-4 text-orange-500" />
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Code Editor</span>
                                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse ml-1" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500/30 cursor-pointer"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1">
                            <Editor
                                theme="vs-dark"
                                language={language}
                                value={codeMap[activeTab]?.[language] || ""}
                                onChange={handleCodeChange}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15,
                                    padding: { top: 30, bottom: 30 },
                                    fontFamily: "'JetBrains Mono', monospace",
                                    lineHeight: 1.8,
                                    letterSpacing: 0.5,
                                    cursorStyle: "block",
                                    cursorBlinking: "smooth",
                                    smoothScrolling: true,
                                    contextmenu: false,
                                }}
                                loading={<div className="h-full w-full flex items-center justify-center bg-[#0b0b0d]"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>}
                            />
                        </div>

                        {/* WORKSPACE ACTIONS */}
                        <div className="flex items-center justify-between px-8 py-6 border-t border-white/5 bg-[#141417]/80 backdrop-blur-xl">
                            <button
                                onClick={() => setShowTestCases(!showTestCases)}
                                className={`flex items-center gap-2 group transition-all ${showTestCases ? "text-orange-500" : "text-gray-500 hover:text-white"}`}
                            >
                                <Terminal size={18} className="group-hover:rotate-12 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{showTestCases ? "Close Console" : "Open Console"}</span>
                            </button>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleAction(false)}
                                    disabled={isRunning}
                                    className="px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-300 hover:bg-white/10 transition-all flex items-center gap-2 border border-white/5 disabled:opacity-50 active:scale-95 shadow-xl shadow-black/20"
                                >
                                    <Play className="w-4 h-4 text-orange-500" />
                                    Run Code
                                </button>
                                <button
                                    onClick={() => handleAction(true)}
                                    disabled={isRunning}
                                    className="px-8 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest bg-orange-500 text-black shadow-xl shadow-orange-500/20 hover:bg-orange-400 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Submit Solution
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. CONSOLE PANEL (Dynamic) */}
                    {showTestCases && (
                        <div className="h-1/3 bg-[#0e0e11] border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.01]">
                                <div className="flex items-center gap-3">
                                    <Terminal className="w-4 h-4 text-orange-500" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Execution Logs</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {currentOutput && (
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${currentOutput.passed === currentOutput.total 
                                            ? "bg-green-500/10 border-green-500/20 text-green-500" 
                                            : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
                                            {currentOutput.passed}/{currentOutput.total} Tests Passed
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 custom-scroll font-mono text-[13px]">
                                {!currentOutput && !isRunning && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-700 gap-4 opacity-50">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                            <Terminal size={24} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">Awaiting execution command...</p>
                                    </div>
                                )}

                                {isRunning && (
                                    <div className="flex flex-col items-center justify-center h-full gap-4 py-10">
                                        <div className="relative w-12 h-12">
                                            <div className="absolute inset-0 border-2 border-orange-500/10 rounded-full" />
                                            <div className="absolute inset-0 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest animate-pulse">Analyzing logic patterns...</p>
                                    </div>
                                )}

                                {currentOutput && !isRunning && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-4">
                                            {currentOutput.results?.map((res, idx) => (
                                                <div key={idx} className={`p-6 rounded-[28px] border transition-all duration-300 ${res.passed 
                                                    ? "bg-white/[0.02] border-white/5 grayscale-[0.6] hover:grayscale-0" 
                                                    : "bg-red-500/[0.02] border-red-500/10 shadow-lg shadow-red-500/5 transition-all"
                                                    }`}>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${res.passed ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-red-500 shadow-lg shadow-red-500/50"}`} />
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Test Pattern {idx + 1}</span>
                                                        </div>
                                                        {!res.passed && <span className="text-[9px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-red-500/10">{res.status || "Critical Failure"}</span>}
                                                    </div>
                                                    
                                                    {!res.passed && (
                                                        <div className="space-y-4 font-mono text-[12px]">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                                                    <p className="text-[9px] text-gray-600 font-bold uppercase mb-2">Expected Vector</p>
                                                                    <p className="text-gray-400">{res.expected}</p>
                                                                </div>
                                                                <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                                                    <p className="text-[9px] text-gray-600 font-bold uppercase mb-2">Detected Output</p>
                                                                    <p className="text-red-400">{res.got || "NULL"}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {res.passed && (
                                                        <p className="text-[11px] text-gray-600 italic">Signature matched. Logic verified.</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
