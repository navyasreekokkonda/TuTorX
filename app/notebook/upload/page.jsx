"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

export default function UploadNotebookPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, uploading, analyzing, saving, done

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus("uploading");

    try {
      // 1️⃣ Upload PDF
      const formData = new FormData();
      formData.append("pdf", file);

      const pdfRes = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
      });

      const pdfData = await pdfRes.json();
      setStatus("analyzing");

      // 2️⃣ Analyze text
      const analyzeRes = await fetch("/api/pdf/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pdfData.text }),
      });

      const analyzed = await analyzeRes.json();
      setStatus("saving");

      // 3️⃣ Save notebook
      await fetch("/api/notebook/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name.replace(".pdf", ""),
          ...analyzed.data,
        }),
      });

      setStatus("done");
      setTimeout(() => {
        router.push("/notebook");
      }, 1000);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-gray-300 flex items-center justify-center p-6 relative overflow-hidden">
      {/* BACKGROUND DECOR */}
      <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />

      <div className="max-w-2xl w-full bg-[#111113]/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-12 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <button
          onClick={() => router.push("/notebook")}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition mb-10 uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Library
        </button>

        {!loading ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/20">
                <Upload className="text-black" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Expand Library</h1>
                <p className="text-gray-500 text-sm">Upload a PDF to create a new AI-powered notebook.</p>
              </div>
            </div>

            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] p-20 cursor-pointer hover:bg-white/[0.02] hover:border-orange-500/40 transition-all duration-300">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <span className="text-lg font-bold text-gray-200 mb-2">
                {file ? file.name : "Select PDF Document"}
              </span>
              <span className="text-sm text-gray-500">
                {file ? "Click to change file" : "or drag and drop file here"}
              </span>
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <button
              onClick={handleUpload}
              disabled={!file}
              className="mt-10 w-full bg-white disabled:opacity-30 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98] text-black py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3"
            >
              <Sparkles size={18} className="text-orange-500" />
              Initialize Notebook
            </button>
          </div>
        ) : (
          <div className="py-10">
            <LoadingState status={status} />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState({ status }) {
  const steps = [
    { id: "uploading", label: "Uploading Document" },
    { id: "analyzing", label: "AI Structural Analysis" },
    { id: "saving", label: "Knowledge Distillation" },
    { id: "done", label: "Ready for Deep Dive" }
  ];

  const currentIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
          <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-orange-400 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Processing Intelligence</h2>
        <p className="text-gray-500 text-sm">Please wait while our AI engine analyzes your document.</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {steps.map((step, i) => {
          const isDone = i < currentIndex || status === "done";
          const isActive = i === currentIndex;

          return (
            <div key={step.id} className={`flex items-center gap-4 transition-opacity duration-500 ${!isActive && !isDone ? "opacity-30" : "opacity-100"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${isDone ? "bg-green-500 border-green-500" : isActive ? "border-orange-500" : "border-white/10"}`}>
                {isDone ? <CheckCircle2 size={14} className="text-black" /> : <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-orange-500 animate-pulse" : "bg-gray-600"}`} />}
              </div>
              <span className={`text-[13px] font-bold ${isActive ? "text-white" : isDone ? "text-green-500/80" : "text-gray-500"}`}>{step.label}</span>
            </div>
          );
        })}
      </div>

      {status === "done" && (
        <div className="text-center text-green-500 font-bold animate-bounce pt-4">
          Redirecting to your workspace...
        </div>
      )}
    </div>
  );
}
