"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { 
    X, 
    Sparkles, 
    Plus, 
    ChevronRight, 
    BookOpen, 
    Layers, 
    Video, 
    Zap,
    Loader2
} from "lucide-react";

export default function CourseCreateModal({ isOpen, onClose }) {
    const { user } = useUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [form, setForm] = useState({
        title: "",
        description: "",
        difficulty: "Beginner",
        includeVideos: false,
        chaptersCount: 5,
        category: [],
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await fetch("/api/generate-course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    ...form,
                }),
            });

            const rawData = await res.json();
            if (!res.ok || rawData.error) {
                throw new Error(rawData.error || rawData.message || "Course generation failed.");
            }

            const data = rawData.data || rawData;
            if (rawData.success || data.courseId) {
                sessionStorage.removeItem("dashboard_courses_v2");
                sessionStorage.removeItem("dashboard_progress_v2");
                sessionStorage.removeItem("dashboard_stats_v2");
                router.push(`/course/${data.courseId}`);
            }
        } catch (err) {
            console.error("Course generation failed:", err);
            setErrorMessage(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-10 animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-[#0e0e11] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-full">
                
                {isLoading ? (
                    /* SKELETON / LOADING STATE */
                    <div className="p-12 sm:p-20 flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-3xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                <Zap className="w-10 h-10 text-orange-500 animate-pulse" />
                            </div>
                            <div className="absolute -inset-4 border border-orange-500/10 rounded-[32px] animate-[ping_3s_linear_infinite]" />
                        </div>

                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                AI Synthesizing Architecture...
                            </h2>
                            <p className="text-gray-500 text-sm font-medium max-w-xs mx-auto leading-relaxed">
                                Our neural engines are mapping out {form.chaptersCount} chapters of high-density knowledge for "{form.title}".
                            </p>
                        </div>

                        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 animate-[loading-bar_2s_ease-in-out_infinite]" />
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse flex items-center px-4 gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-700" />
                                    <div className="h-2 w-16 bg-gray-800 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* FORM STATE */
                    <>
                        {/* Header */}
                        <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-orange-500 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white uppercase tracking-widest">Generate Course</h2>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Powered by Advanced AI</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scroll p-10 space-y-8">
                            <div className="space-y-6">
                                {/* Title */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Learning Objective</label>
                                    <input 
                                        type="text"
                                        required
                                        placeholder="e.g., Quantum Computing Fundamentals"
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-[22px] px-6 py-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Concept Scope</label>
                                    <textarea 
                                        required
                                        placeholder="Briefly describe what you want to master..."
                                        className="w-full min-h-[100px] bg-white/[0.03] border border-white/5 rounded-[22px] px-6 py-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all resize-none"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    />
                                </div>

                                {/* Settings Grid */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Cognitive Depth</label>
                                        <select 
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-[22px] px-6 py-4 text-sm text-gray-200 focus:outline-none transition-all appearance-none cursor-pointer"
                                            value={form.difficulty}
                                            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                                        >
                                            <option className="bg-[#0e0e11]">Beginner</option>
                                            <option className="bg-[#0e0e11]">Intermediate</option>
                                            <option className="bg-[#0e0e11]">Advanced</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Chapter Density</label>
                                        <input 
                                            type="number"
                                            min="1"
                                            max="15"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-[22px] px-6 py-4 text-sm text-gray-200 focus:outline-none transition-all"
                                            value={form.chaptersCount}
                                            onChange={(e) => setForm({ ...form, chaptersCount: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                {/* Toggle */}
                                <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[22px]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                            <Video className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest">Enhanced Content</p>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase">Include Smart Video References</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setForm({ ...form, includeVideos: !form.includeVideos })}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors ${form.includeVideos ? "bg-orange-500" : "bg-white/10"}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.includeVideos ? "translate-x-6" : "translate-x-0"}`} />
                                    </button>
                                </div>
                            </div>

                            {errorMessage && (
                                <div className="p-5 rounded-[22px] bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold leading-relaxed animate-in fade-in space-y-3">
                                    <p className="font-bold uppercase tracking-wider">Course Synthesis Alert</p>
                                    <p>{errorMessage}</p>
                                    {errorMessage.includes("limit") && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                                router.push("/demo");
                                            }}
                                            className="mt-2 w-full py-2.5 bg-orange-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-orange-400 transition"
                                        >
                                            Explore Interactive Demo Account →
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Submit */}
                            <button 
                                type="submit"
                                className="group w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-[24px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4"
                            >
                                <Zap className="w-4 h-4 text-orange-500 group-hover:fill-orange-500" />
                                Initialize Course Synthesis
                            </button>
                        </form>
                    </>
                )}
            </div>

            <style jsx>{`
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
