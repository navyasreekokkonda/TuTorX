"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CourseForm() {
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Beginner",
    includeVideos: false,
    chaptersCount: 5,
    category: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please sign in first");

    setLoading(true);

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
      if (!res.ok) throw new Error(rawData.error || "Something went wrong");

      const data = rawData.data || rawData;
      if (rawData.success || data.courseId) {
        // Clear dashboard cache
        sessionStorage.removeItem("dashboard_courses_v2");
        sessionStorage.removeItem("dashboard_progress_v2");
        sessionStorage.removeItem("dashboard_stats_v2");

        router.push(`/course/${data.courseId}`);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-gray-300 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-[#111113] border border-white/5 rounded-3xl p-8 space-y-6"
      >
        {/* HEADER */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-100">
            Create New Course
          </h1>
          <p className="text-sm text-gray-500">
            Generate a structured, AI-powered learning experience
          </p>
        </div>

        {/* COURSE TITLE */}
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-gray-500">
            Course Title
          </label>
          <input
            type="text"
            required
            placeholder="Java Arrays Mastery"
            className="w-full bg-[#0b0b0c] border border-white/5 rounded-lg px-4 py-2
                       text-sm text-gray-200 placeholder:text-gray-600
                       focus:outline-none focus:ring-1 focus:ring-orange-500/30"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-gray-500">
            Description
          </label>
          <textarea
            required
            placeholder="What will students learn from this course?"
            className="w-full min-h-[120px] bg-[#0b0b0c] border border-white/5 rounded-lg px-4 py-3
                       text-sm text-gray-200 placeholder:text-gray-600
                       focus:outline-none focus:ring-1 focus:ring-orange-500/30"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* GRID: DIFFICULTY + CHAPTERS */}
        <div className="grid grid-cols-2 gap-4">
          {/* DIFFICULTY */}
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wide text-gray-500">
              Difficulty
            </label>
            <select
              className="w-full bg-[#0b0b0c] border border-white/5 rounded-lg px-3 py-2
                         text-sm text-gray-200 focus:outline-none"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          {/* CHAPTER COUNT */}
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wide text-gray-500">
              Chapters
            </label>
            <input
              type="number"
              min="1"
              max="20"
              required
              className="w-full bg-[#0b0b0c] border border-white/5 rounded-lg px-3 py-2
                         text-sm text-gray-200 focus:outline-none"
              value={form.chaptersCount}
              onChange={(e) =>
                setForm({
                  ...form,
                  chaptersCount: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wide text-gray-500">
            Categories
          </label>
          <input
            type="text"
            placeholder="Java, DSA, Backend"
            className="w-full bg-[#0b0b0c] border border-white/5 rounded-lg px-4 py-2
                       text-sm text-gray-200 placeholder:text-gray-600
                       focus:outline-none"
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>

        {/* INCLUDE VIDEOS */}
        <label className="flex items-center gap-3 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={form.includeVideos}
            onChange={(e) =>
              setForm({
                ...form,
                includeVideos: e.target.checked,
              })
            }
            className="accent-orange-500"
          />
          Include video references
        </label>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full mt-4 bg-orange-500 text-black py-2.5 rounded-lg
                     text-sm font-semibold hover:opacity-90
                     disabled:opacity-50 transition"
        >
          {loading ? "Generating Course…" : "Generate Course"}
        </button>
      </form>
    </div>
  );
}
