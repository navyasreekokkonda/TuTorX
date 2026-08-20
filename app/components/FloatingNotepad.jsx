"use client";
import { useEffect, useRef, useState } from "react";

/* ================================================= */
/* ================ FLOATING NOTEPAD =============== */
/* ================================================= */
export default function FloatingNotepad({ courseId }) {
  const STORAGE_KEY = `course_notes_${courseId}`;

  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");

  /* ---------------- DRAG STATE ---------------- */
  const boxRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({
    x: window.innerWidth - 420,
    y: window.innerHeight - 520,
  });

  /* ---------------- LOAD NOTES ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setNotes(saved);
  }, [STORAGE_KEY]);

  /* ---------------- SAVE NOTES ---------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, notes);
  }, [notes, STORAGE_KEY]);

  /* ---------------- DRAG HANDLERS ---------------- */
  const onMouseDown = (e) => {
    const rect = boxRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  /* ---------------- DOWNLOAD ---------------- */
  const downloadNotes = () => {
    const blob = new Blob([notes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "course-notes.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ================= FLOATING TOGGLE ================= */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[60]
                   bg-orange-500 text-black
                   px-4 py-2 rounded-full
                   text-sm font-semibold shadow-xl
                   hover:opacity-90 active:scale-95 transition"
      >
        Notes
      </button>

      {/* ================= NOTEPAD ================= */}
      {open && (
        <div
          ref={boxRef}
          style={{ left: position.x, top: position.y }}
          className="fixed z-[60]
                     w-[380px] h-[460px]
                     bg-[#0f0f11]
                     border border-white/10
                     rounded-2xl shadow-2xl
                     flex flex-col select-none"
        >
          {/* HEADER (DRAGGABLE) */}
          <div
            onMouseDown={onMouseDown}
            className="cursor-move
                       px-4 py-3
                       flex items-center justify-between
                       border-b border-white/10
                       bg-[#111113] rounded-t-2xl"
          >
            <div className="flex items-center gap-2">
              <span className="text-orange-400">📝</span>
              <h3 className="text-sm font-semibold text-gray-200">
                Personal Notes
              </h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={downloadNotes}
                className="text-xs px-2 py-1 rounded
                           bg-white/5 hover:bg-white/10
                           text-gray-300"
              >
                Download
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-xs px-2 py-1 rounded
                           bg-white/5 hover:bg-white/10
                           text-gray-300"
              >
                ✕
              </button>
            </div>
          </div>

          {/* TEXTAREA */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write, paste code, or jot ideas here…"
            className="flex-1 resize-none
                       bg-transparent
                       p-4
                       text-sm text-gray-300
                       placeholder:text-gray-600
                       focus:outline-none"
          />

          {/* FOOTER */}
          <div
            className="px-4 py-2 text-[11px]
                       text-gray-500
                       border-t border-white/10
                       bg-[#111113] rounded-b-2xl"
          >
            Auto-saved locally • Drag header to move
          </div>
        </div>
      )}
    </>
  );
}
