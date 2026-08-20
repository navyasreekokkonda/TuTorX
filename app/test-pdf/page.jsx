"use client";
import { useState } from "react";

export default function TestPdfPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 🔹 1️⃣ PASTE analyzeWithGemini HERE
  const analyzeWithGemini = async (text) => {
    const res = await fetch("/api/pdf/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    console.log("Gemini Result:", data);
    setResult(data);
  };

  // 🔹 2️⃣ PDF upload handler
  const uploadPdf = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);

    const res = await fetch("/api/pdf/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("PDF Upload Result:", data);

    setLoading(false);

    // 🔥 3️⃣ CALL GEMINI AFTER TEXT EXTRACTION
    if (data.text) {
      analyzeWithGemini(data.text);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>PDF → Gemini Test</h2>

      <input type="file" accept="application/pdf" onChange={uploadPdf} />

      {loading && <p>Processing PDF…</p>}

      {result?.success && (
        <pre style={{ marginTop: 20 }}>
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
