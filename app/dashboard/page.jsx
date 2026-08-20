"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Trophy,
  Loader2,
  Play,
  BookOpen,
  Layers,
  Code2,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  Terminal
} from "lucide-react";
import OrangePlusButton from "../components/button";
import { useUser } from "@clerk/nextjs";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import JarvisAssistant from "../components/JarvisAssistant";
import CourseCreateModal from "../components/CourseCreateModal";
import RightPanel from "../components/RightPanel";
/* ================= PAGE ================= */

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0b0b0c] text-gray-300 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          currentPage="Dashboard" 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex flex-1 overflow-hidden">
          <MainContent 
            searchQuery={searchQuery} 
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
          <RightPanel />
        </div>
      </div>
      <JarvisAssistant />
      <CourseCreateModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}

/* ================= MAIN CONTENT ================= */

const normalizeArray = (val) => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === "object") {
    if (Array.isArray(val.items)) return val.items;
    if (Array.isArray(val.courses)) return val.courses;
    if (Array.isArray(val.data)) return val.data;
  }
  return [];
};

function MainContent({ searchQuery, setIsCreateModalOpen }) {
  const router = useRouter();
  const { user } = useUser();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [progressData, setProgressData] = useState({});
  const [avgProgress, setAvgProgress] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  /* ================= COURSES CACHE ================= */

  useEffect(() => {
    if (!user) return;

    const cachedCourses = sessionStorage.getItem("dashboard_courses_v2");
    if (cachedCourses) {
      try {
        const parsed = JSON.parse(cachedCourses);
        setCourses(normalizeArray(parsed));
        setLoading(false);
        return;
      } catch (e) {
        sessionStorage.removeItem("dashboard_courses_v2");
      }
    }

    fetch("/api/course")
      .then((res) => res.json())
      .then((data) => {
        const safeData = normalizeArray(data);
        setCourses(safeData);
        sessionStorage.setItem(
          "dashboard_courses_v2",
          JSON.stringify(safeData)
        );
        setLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setLoading(false);
      });
  }, [user]);

  /* ================= PROGRESS + STATS CACHE ================= */

  const safeCoursesList = normalizeArray(courses);

  useEffect(() => {
    if (!user || safeCoursesList.length === 0) return;

    const cachedProgress = sessionStorage.getItem("dashboard_progress_v2");
    const cachedStats = sessionStorage.getItem("dashboard_stats_v2");

    if (cachedProgress && cachedStats) {
      try {
        setProgressData(JSON.parse(cachedProgress));
        const stats = JSON.parse(cachedStats);
        setAvgProgress(stats?.avgProgress || 0);
        setTotalCompleted(stats?.totalCompleted || 0);
        return;
      } catch (e) {
        sessionStorage.removeItem("dashboard_progress_v2");
        sessionStorage.removeItem("dashboard_stats_v2");
      }
    }

    const fetchAllProgress = async () => {
      const progressMap = {};
      let completedSum = 0;
      let percentageSum = 0;

      for (const course of safeCoursesList) {
        try {
          const res = await fetch(`/api/progress?courseId=${course._id}`);
          const data = await res.json();

          const totalTopics = course.totalTopics || 0;
          const completedTopics = Math.min(
            data?.completedTopics?.length || 0,
            totalTopics
          );

          const percentage =
            totalTopics > 0
              ? Math.round((completedTopics / totalTopics) * 100)
              : 0;

          progressMap[course._id] = {
            completedTopics,
            totalTopics,
            percentage,
          };

          completedSum += completedTopics;
          percentageSum += percentage;
        } catch (err) {
          console.error("Progress fetch failed:", err);
        }
      }

      const avg =
        safeCoursesList.length > 0 ? Math.round(percentageSum / safeCoursesList.length) : 0;

      setProgressData(progressMap);
      setTotalCompleted(completedSum);
      setAvgProgress(avg);

      sessionStorage.setItem(
        "dashboard_progress_v2",
        JSON.stringify(progressMap)
      );
      sessionStorage.setItem(
        "dashboard_stats_v2",
        JSON.stringify({
          totalCompleted: completedSum,
          avgProgress: avg,
        })
      );
    };

    fetchAllProgress();
  }, [user, safeCoursesList.length]);

  const filteredCourses = safeCoursesList.filter(course =>
    (course?.title || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  const visibleCourses = showAll ? filteredCourses : filteredCourses.slice(0, 2);

  const difficultyStyle = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      case "advanced":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border border-gray-500/20";
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 relative custom-scroll">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* FREE TIER QUOTA & STATUS CARD */}
        <div className="p-5 rounded-2xl bg-[#121216] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Current Plan: Free Tier
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">LeetCode & TUF AI Engine Quotas</h3>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              Free accounts are granted <span className="text-orange-400 font-bold">2 Custom Courses</span> and <span className="text-orange-400 font-bold">2 AI Practice Problem Sets</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <div className="bg-[#18181d] px-4 py-2 rounded-xl border border-white/10 text-center space-y-0.5">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Course Quota</span>
              <span className="text-xs font-bold text-white">{safeCoursesList.length} / 2 Used</span>
            </div>
            <button
              onClick={() => router.push("/demo")}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-400 text-black font-bold uppercase text-[10px] tracking-widest transition shadow-sm flex items-center justify-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3 h-3 fill-current" /> Explore Guest Sandbox →
            </button>
          </div>
        </div>

        {/* METRICS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-5 hover:border-white/15 transition">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
              Average Progress
            </p>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold text-white">
                {avgProgress}
              </span>
              <span className="text-xs text-gray-500 font-medium pb-0.5">%</span>
            </div>
          </div>

          <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-5 hover:border-white/15 transition">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
              Topics Completed
            </p>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold text-white">
                {totalCompleted}
              </span>
              <span className="text-xs text-gray-500 font-medium pb-0.5">Topics</span>
            </div>
          </div>

          <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-5 hover:border-white/15 transition">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
              Total Courses
            </p>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold text-white">
                {safeCoursesList.length}
              </span>
              <span className="text-xs text-gray-500 font-medium pb-0.5">Courses</span>
            </div>
          </div>
        </section>

        {/* ACTIVE MODULES */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Active Modules
            </h2>

            {safeCoursesList.length > 2 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
              >
                {showAll ? "Show less" : "View all"}
              </button>
            )}
          </div>

          {loading && <p className="text-xs text-gray-500 font-medium">Loading modules…</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleCourses.map((course) => {
              const progress = progressData[course._id] || {
                completedTopics: 0,
                totalTopics: 0,
                percentage: 0,
              };

              return (
                <div
                  key={course._id}
                  className="bg-[#121216] border border-white/[0.07] rounded-2xl p-5 hover:border-orange-500/30 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 min-w-0">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide truncate">
                        {course.title}
                      </h3>

                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${difficultyStyle(
                            course.difficulty
                          )}`}
                        >
                          {course.difficulty || "Unknown"}
                        </span>
                        <span>
                          Created{" "}
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/course/${course._id}`)}
                      className="w-8 h-8 rounded-full bg-[#18181d] border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black transition shrink-0"
                      title="Resume Course"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                      <span>Progress</span>
                      <span className="text-gray-200 font-bold">
                        {progress.completedTopics}/{progress.totalTopics} topics ({progress.percentage}%)
                      </span>
                    </div>

                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all duration-500 rounded-full"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* NOTEBOOK LM CARD */}
          <div className="relative bg-[#121216] mt-4 border border-orange-500/20 rounded-2xl p-6 flex flex-col justify-between hover:border-orange-500/40 transition">
            <span className="absolute -top-2.5 left-5 bg-orange-500 text-black text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-widest uppercase">
              NEW
            </span>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Try NotebookLLM AI
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
                Upload PDFs, generate summaries, notes, flashcards and chat with your technical documentation right inside your study environment.
              </p>
            </div>

            <button
              onClick={() => router.push("/notebook")}
              className="mt-4 bg-orange-500 hover:bg-orange-400 text-black px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest w-fit transition shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Launch NotebookLLM →
            </button>
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 right-[calc(320px+24px)] z-50">
        <OrangePlusButton
          className="cursor-pointer"
          onClick={() => setIsCreateModalOpen(true)}
        />
      </div>
    </main>
  );
}


