"use client";

import { useEffect, useRef, useState } from "react";

export default function CourseRoadmap({ course, onSelectChapter }) {
  return (
    <div className="relative max-w-5xl mx-auto px-6 py-20">
      {/* Timeline spine */}
      <div className="absolute left-1/2 top-0 h-full w-px bg-white/10 -translate-x-1/2 hidden md:block" />

      <div className="space-y-24">
        {course.chapters.map((chapter, index) => (
          <RoadmapItem
            key={index}
            index={index}
            chapter={chapter}
            onSelect={() => onSelectChapter(index)}
          />
        ))}
      </div>
    </div>
  );
}

/* ================================================= */
/* ================= ROADMAP ITEM ================== */
/* ================================================= */

function RoadmapItem({ chapter, index, onSelect }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative md:flex items-center ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Step Indicator */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
        <div
          className={`h-12 w-12 rounded-full border flex items-center justify-center
            text-sm font-semibold transition-all duration-700
            ${
              visible
                ? "bg-orange-500 text-black border-orange-500 scale-100"
                : "bg-[#0f0f12] text-gray-400 border-white/10 scale-90"
            }`}
        >
          {index + 1}
        </div>
      </div>

      {/* Card */}
      <div
        onClick={onSelect}
        className={`
          w-full md:w-[420px]
          bg-[#111113] border border-white/5 rounded-2xl p-6
          cursor-pointer transition-all duration-500
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          hover:border-orange-500/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-widest text-gray-500">
            Chapter {index + 1}
          </span>
          <span className="text-xs text-gray-500">{chapter.duration}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-100 leading-snug">
          {chapter.chapterTitle}
        </h3>

        {/* Meta */}
        <div className="mt-4 flex gap-4 text-sm text-gray-400">
          <span>{chapter.topics.length} Topics</span>
          <span>•</span>
          <span>Structured learning</span>
        </div>

        {/* CTA */}
        <div className="mt-6 text-sm font-medium text-orange-400">
          Continue →
        </div>
      </div>
    </div>
  );
}
