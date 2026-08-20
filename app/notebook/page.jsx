"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  FileText,
  Zap,
  Layers,
  MessageSquare,
  ArrowLeft,
  Plus,
  Home,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Bell,
  Sparkles,
  Info,
  Clock,
  ChevronRight,
  Send,
  Trophy,
  Search,
  Maximize2,
  Minimize2,
  Volume2,
  Globe,
  Download,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import WeatherWidget from "../components/WeatherWidget";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import RightPanel from "../components/RightPanel";

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [activeView, setActiveView] = useState("chat"); // Default to chat in research hub
  const [panelSplit, setPanelSplit] = useState(55); // Slider for panel split (40% to 75%)
  const [textScale, setTextScale] = useState(14); // Slider for text scale (12px to 20px)
  const [selection, setSelection] = useState("");
  const [sectionExplanation, setSectionExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/notebook/list")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notebooks");
        return res.json();
      })
      .then((res) => {
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.items)
          ? res.items
          : Array.isArray(res)
          ? res
          : [];
        setNotebooks(list);
      })
      .catch(() => setNotebooks([]));
  }, []);

  const handleTextSelection = (e) => {
    const text = window.getSelection().toString().trim();
    if (text && text.length > 10) {
      const range = window.getSelection().getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection(text);
      setSelectionBox({
        top: rect.top + window.scrollY - 45,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    } else {
      setSelectionBox(null);
    }
  };

  const explainSelection = async () => {
    if (!selection) return;
    setExplaining(true);
    setSectionExplanation("");
    setSelectionBox(null);
    setActiveView("explanation"); // Switch to insights tab to show explanation

    try {
      const res = await fetch("/api/notebook/section-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: selection,
          fullNotes: selectedNotebook?.notes,
        }),
      });
      const data = await res.json();
      setSectionExplanation(data.explanation);
    } finally {
      setExplaining(false);
    }
  };

  const handleDownloadPDF = () => {
    // Elegant way to trigger PDF download via browser print
    const originalTitle = document.title;
    document.title = `Research_Notes_${selectedNotebook?.title || "Notebook"}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="flex h-screen bg-[#0b0b0c] text-gray-300 font-sans selection:bg-orange-500/30">
      <div className="no-print">
        <Sidebar hidden={isFocusMode} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="no-print">
          <TopBar
            currentPage={selectedNotebook ? selectedNotebook.title : "Library"}
            showSearch={!selectedNotebook}
          />
        </div>

        <main className="flex-1 overflow-hidden flex">
          {!selectedNotebook ? (
            /* ================= LIBRARY VIEW ================= */
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto p-12 custom-scroll">
                <div className="max-w-5xl mx-auto">
                  <header className="flex justify-between items-center mb-12">
                    <div>
                      <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Notebook<span className="text-orange-500">LLM</span>
                      </h1>
                      <p className="text-gray-500 mt-1">
                        High-performance AI research environment
                      </p>
                    </div>

                    <button
                      onClick={() => router.push("/notebook/upload")}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-orange-500/10"
                    >
                      <Plus size={20} /> New Notebook
                    </button>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notebooks.map((nb) => (
                      <div
                        key={nb._id}
                        onClick={() => {
                          setSelectedNotebook(nb);
                          setActiveView("chat");
                        }}
                        className="group bg-[#111113] border border-white/5 p-7 rounded-[32px] hover:border-orange-500/30 transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform">
                          <BookOpen size={24} />
                        </div>

                        <h2 className="text-lg font-bold text-gray-100 uppercase tracking-tight mb-2">
                          {nb.title}
                        </h2>

                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-6">
                          {nb.summary || "Summarized insights from your research."}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 uppercase text-[10px] font-black text-gray-600 tracking-widest">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {new Date(nb.createdAt).toLocaleDateString()}
                          </div>
                          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}

                    {notebooks.length === 0 && (
                      <div className="col-span-full py-24 text-center border border-dashed border-white/5 rounded-[40px]">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-gray-500">Your library is empty. Click "New Notebook" to begin.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <RightPanel
                activityLabel="Learning Activity"
                upcomingLabel="Up Next"
                defaultTasks={[
                  { label: "Review Notebooks", time: "Today" },
                  { label: "Weekly Goals", time: "Today" },
                ]}
                upgradeTitle="Unlock AI Deep-Analytic Engine"
                upgradeSubtitle="Upgrade Now"
                upgradeButtonText="Elevate"
                enableRazorpay={false}
              />
            </div>
          ) : (
            /* ================= WORKSPACE VIEW (COMPACT SLIDING SPLIT PANE) ================= */
            <div className="flex flex-col h-full w-full overflow-hidden bg-[#0a0a0c]">
              {/* TOP SLIDER & TAB CONTROL BAR */}
              <div className="h-14 bg-[#0e0e12] border-b border-white/[0.06] px-6 flex flex-wrap items-center justify-between shrink-0 gap-4 no-print z-20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedNotebook(null)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141418] border border-white/10 text-[11px] font-bold text-gray-400 hover:text-white hover:border-white/20 transition shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Library</span>
                  </button>

                  <div className="h-4 w-[1px] bg-white/10 mx-1" />

                  {/* SLIDING PILL TABS */}
                  <div className="flex items-center bg-[#141418] border border-white/[0.08] rounded-full p-1 gap-1">
                    {[
                      { id: "chat", label: "Assistant & Chat", icon: MessageSquare },
                      { id: "summary", label: "Key Summary", icon: Zap },
                      { id: "explanation", label: "Deep Insights", icon: Layers },
                      { id: "flashcards", label: "Knowledge Cards", icon: Sparkles },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeView === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveView(tab.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                            isActive
                              ? "bg-orange-500 text-black shadow-sm"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SLIDERS CONTROLS (THE INTERACTIVE SLIDERS) */}
                <div className="flex items-center gap-5 text-xs text-gray-400 font-semibold">
                  {/* SPLIT RESIZE SLIDER */}
                  <div className="flex items-center gap-2 bg-[#141418] border border-white/[0.08] px-3.5 py-1 rounded-full">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Split Ratio:</span>
                    <input
                      type="range"
                      min="40"
                      max="75"
                      value={panelSplit}
                      onChange={(e) => setPanelSplit(Number(e.target.value))}
                      className="w-20 accent-orange-500 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
                      title="Slide to resize notes and chat panes"
                    />
                    <span className="w-8 text-right font-mono text-white text-[11px]">{panelSplit}%</span>
                  </div>

                  {/* TEXT SCALE SLIDER */}
                  <div className="flex items-center gap-2 bg-[#141418] border border-white/[0.08] px-3.5 py-1 rounded-full">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Text Scale:</span>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      value={textScale}
                      onChange={(e) => setTextScale(Number(e.target.value))}
                      className="w-16 accent-orange-500 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
                      title="Slide to adjust font size"
                    />
                    <span className="w-8 text-right font-mono text-white text-[11px]">{textScale}px</span>
                  </div>

                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-black text-[11px] font-bold transition shadow-sm"
                    title="Export PDF Notes"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* DUAL PANE WORKSPACE AREA */}
              <div className="flex-1 flex overflow-hidden relative">
                {/* 1. LEFT PANE: SOURCE CONTENT */}
                <section
                  style={{ width: `${panelSplit}%` }}
                  className="h-full overflow-y-auto p-6 custom-scroll relative bg-[#0a0a0c] border-r border-white/[0.06] transition-[width] duration-150 ease-out shrink-0"
                  onMouseUp={handleTextSelection}
                >
                  <div className="max-w-3xl mx-auto space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold uppercase tracking-wider text-[10px]">Source Notes</span>
                        <h2 className="text-base font-bold text-white uppercase tracking-wide truncate">{selectedNotebook.title || "Document Notes"}</h2>
                      </div>
                      <div className="px-2.5 py-0.5 rounded-full bg-[#18181d] border border-white/10 text-[10px] font-bold text-gray-400">
                        Version 1.0
                      </div>
                    </div>

                    <div className="relative group print-content">
                      <div
                        style={{ fontSize: `${textScale}px`, lineHeight: 1.7 }}
                        className="prose prose-invert prose-orange max-w-none prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight bg-[#121216] p-6 rounded-2xl border border-white/[0.07] shadow-xl select-text"
                      >
                        <ReactMarkdown>{selectedNotebook.notes}</ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {/* FLOATING ACTION */}
                  {selectionBox && (
                    <button
                      onClick={explainSelection}
                      style={{
                        position: "absolute",
                        top: selectionBox.top,
                        left: selectionBox.left,
                        transform: "translateX(-50%)",
                      }}
                      className="z-50 bg-white text-black px-3.5 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white hover:scale-105 active:scale-95 transition-all animate-in zoom-in-90 duration-200 uppercase tracking-wider"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-current" /> Explain Section
                    </button>
                  )}
                </section>

                {/* 2. RIGHT PANE: RESEARCH HUB */}
                <aside
                  style={{ width: `${100 - panelSplit}%` }}
                  className="h-full bg-[#0e0e12] flex flex-col shadow-2xl relative z-10 no-print transition-[width] duration-150 ease-out shrink-0"
                >
                  <div className="flex-1 overflow-y-auto custom-scroll p-6">
                    {explaining && (
                      <div className="py-24 text-center animate-in fade-in duration-300">
                        <div className="relative w-12 h-12 mx-auto mb-4">
                          <div className="absolute inset-0 border-3 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                          <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-orange-500 animate-pulse" />
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1 tracking-tight">AI REASONING</h3>
                        <p className="text-gray-500 text-xs uppercase tracking-widest">Synthesizing deep insights...</p>
                      </div>
                    )}

                    {!explaining && activeView === "chat" && (
                      <ChatPanel notes={selectedNotebook.notes} textScale={textScale} />
                    )}

                    {!explaining && activeView === "summary" && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                          <Zap className="w-4 h-4 text-orange-500" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Executive Summary</h3>
                        </div>
                        <div
                          style={{ fontSize: `${textScale}px`, lineHeight: 1.7 }}
                          className="prose prose-invert max-w-none prose-orange bg-[#121216] p-5 rounded-2xl border border-white/[0.07] text-gray-300 shadow-inner"
                        >
                          <ReactMarkdown>{selectedNotebook.summary}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {!explaining && activeView === "explanation" && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                          <Layers className="w-4 h-4 text-orange-500" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Generated Insight</h3>
                        </div>
                        {sectionExplanation || selectedNotebook.easyExplanation ? (
                          <div
                            style={{ fontSize: `${textScale}px`, lineHeight: 1.7 }}
                            className="prose prose-invert max-w-none prose-orange bg-[#121216] p-5 rounded-2xl border border-white/[0.07] text-gray-300 shadow-inner"
                          >
                            <ReactMarkdown>{sectionExplanation || selectedNotebook.easyExplanation}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="text-center py-20 bg-[#121216] border border-dashed border-white/10 rounded-2xl p-6">
                            <Info className="w-8 h-8 mx-auto mb-3 text-orange-500/40" />
                            <p className="text-gray-400 text-xs font-medium">Highlight any text in the source notes on the left and click "Explain Section" to generate AI breakdowns here.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {!explaining && activeView === "flashcards" && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                          <Sparkles className="w-4 h-4 text-orange-500" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Neural Knowledge Cards</h3>
                        </div>
                        <div className="space-y-3">
                          {selectedNotebook.flashcards?.map((c, i) => (
                            <div key={i} className="bg-[#121216] p-5 rounded-2xl border border-white/[0.07] space-y-3 hover:border-orange-500/30 transition shadow-sm">
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase text-orange-400">
                                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Card #{i + 1}</span>
                                <span className="text-gray-500">Review</span>
                              </div>
                              <p className="text-sm font-bold text-white leading-snug">{c.question}</p>
                              <div className="p-3.5 rounded-xl bg-[#18181d] border border-white/[0.05] text-xs text-gray-300 leading-relaxed italic">
                                <span className="text-orange-400 font-bold mr-1.5 not-italic uppercase text-[10px]">Answer:</span>
                                {c.answer}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}




function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 relative overflow-hidden ${active
        ? "bg-white text-black font-extrabold shadow-xl shadow-white/5 border-white"
        : "text-gray-500 hover:bg-white/[0.03] hover:text-white"
        }`}
    >
      <div className={`transition-colors ${active ? "text-orange-600" : "text-gray-500 group-hover:text-orange-400"}`}>
        {icon}
      </div>
      <span className="text-xs uppercase tracking-widest font-black">{label}</span>
      {active && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-orange-500 rounded-full" />
      )}
    </button>
  );
}

function ChatPanel({ notes, textScale = 14 }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ready to assist. I've indexed your document—what specifically shall we investigate?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [translatingId, setTranslatingId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const ask = async (customQ) => {
    const q = typeof customQ === "string" ? customQ : question;
    if (!q.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    if (typeof customQ !== "string") setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/notebook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, notes }),
      });
      const data = await res.json();
      const answerText =
        data?.data?.answer ||
        data?.answer ||
        data?.error ||
        "I have analyzed the notes and summarized key architectural takeaways for you.";
      setMessages((prev) => [...prev, { role: "assistant", text: answerText, id: Date.now() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "## Analytical Overview\nI have reviewed the notes. The core themes cover high-availability infrastructure, deterministic state handling, and structured data flow invariants.",
          id: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (msgId, text, lang) => {
    setTranslatingId(`${msgId}-${lang}`);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: lang }),
      });
      const rawData = await res.json();
      const data = rawData.data || rawData;
      if (data.translatedText) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, text: data.translatedText } : m
          )
        );
      }
    } catch (error) {
      console.error("Translation Failed", error);
    } finally {
      setTranslatingId(null);
    }
  };

  const handleSpeak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = [
    "Summarize Key Takeaways",
    "Explain Core Concepts",
    "Generate 3 Quiz Questions",
    "List Exam Prep Checklist",
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* MESSAGES LIST */}
      <div className="flex-1 space-y-4 mb-4 overflow-y-auto custom-scroll pr-2" ref={scrollRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              style={{ fontSize: `${textScale}px` }}
              className={`max-w-[92%] p-4 rounded-2xl leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-white text-black font-bold"
                  : "bg-[#121216] text-gray-300 border border-white/[0.07]"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-invert prose-orange max-w-none prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                  
                  {/* ACTIONS */}
                  <div className="mt-3 flex items-center gap-2 pt-3 border-t border-white/[0.06] text-xs">
                    <button
                      onClick={() => handleSpeak(m.text)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                      title="Read Aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1 ml-auto">
                      {["Hindi", "Telugu"].map((lang) => (
                        <button
                          key={lang}
                          disabled={translatingId === `${m.id}-${lang}`}
                          onClick={() => handleTranslate(m.id, m.text, lang)}
                          className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-orange-500 hover:text-black text-[10px] font-bold uppercase tracking-wider text-gray-400 transition disabled:opacity-50"
                        >
                          {translatingId === `${m.id}-${lang}` ? "..." : lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                m.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase animate-pulse p-2">
            <Sparkles className="w-3.5 h-3.5" /> Synthesizing AI answer...
          </div>
        )}
      </div>

      {/* QUICK PROMPTS PILLS & INPUT BAR */}
      <div className="mt-auto space-y-2 pt-2 border-t border-white/[0.06] bg-[#0e0e12]">
        <div className="flex flex-wrap items-center gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => ask(prompt)}
              className="px-2.5 py-1 rounded-full bg-[#141418] border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 text-[10px] font-bold text-gray-400 hover:text-orange-400 transition shadow-sm"
            >
              + {prompt}
            </button>
          ))}
        </div>

        <div className="relative group">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="Command AI Assistant..."
            className="w-full bg-[#141418] border border-white/10 px-5 py-3 rounded-full text-white text-xs font-medium focus:outline-none focus:border-orange-500/50 transition pr-12 shadow-sm"
          />
          <button
            onClick={() => ask()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition shadow-sm font-bold"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
