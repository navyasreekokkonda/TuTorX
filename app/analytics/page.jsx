"use client";

import React, { useEffect, useState } from "react";
import {
  Zap,
  Clock,
  CheckCircle2,
  Trophy,
  Flame,
  Star,
  Award,
  ArrowUpRight,
  Target,
  BarChart3,
  Layers,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-[#0b0b0c] text-gray-300 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage="Analytics" />

        <main className="flex-1 overflow-y-auto p-6 custom-scroll">
          <AnalyticsContent />
        </main>
      </div>
    </div>
  );
}

function AnalyticsContent() {
  const { user } = useUser();

  const [stats, setStats] = useState({
    totalCourses: 0,
    completedTopics: 0,
    avgProgress: 0,
    activeGoals: 0,
    streak: 0,
  });

  const [weeklyData, setWeeklyData] = useState([1, 2, 0, 3, 1, 4, 2]);
  const [skillData, setSkillData] = useState([
    { label: "Algorithms & DSA", value: 65 },
    { label: "System Design", value: 45 },
    { label: "Full Stack Engineering", value: 30 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const CACHE_KEY = `analytics_cache_${user.id}_v3`;
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setStats(parsed.stats);
        if (parsed.weeklyData?.length) setWeeklyData(parsed.weeklyData);
        if (parsed.skillData?.length) setSkillData(parsed.skillData);
        setLoading(false);
        return;
      } catch (e) {
        console.error("Cache read error", e);
      }
    }

    const loadAnalytics = async () => {
      try {
        const courses = await fetch("/api/course").then((r) => r.json());
        const goals = await fetch("/api/goals", {
          headers: { "x-user-id": user.id },
        }).then((r) => r.json());

        let completedTopicsCount = 0;
        let progressSum = 0;
        const skillMap = {};
        const dailyCounts = Array(7).fill(0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const completionDates = new Set();

        if (Array.isArray(courses)) {
          for (const course of courses) {
            const progress = await fetch(
              `/api/progress?courseId=${course._id}`
            ).then((r) => r.json());

            const completed = progress?.completedTopics || [];
            const totalTopics = course.totalTopics || 0;

            completedTopicsCount += completed.length;

            if (totalTopics > 0) {
              progressSum += Math.round((completed.length / totalTopics) * 100);
            }

            const skill = course.category || "Algorithms & DSA";
            skillMap[skill] = (skillMap[skill] || 0) + completed.length;

            completed.forEach((t) => {
              const d = t.completedAt ? new Date(t.completedAt) : new Date();
              d.setHours(0, 0, 0, 0);
              completionDates.add(d.getTime());

              const diff = (today - d) / (1000 * 60 * 60 * 24);
              if (diff >= 0 && diff < 7) {
                dailyCounts[6 - Math.floor(diff)]++;
              }
            });
          }
        }

        let streak = 0;
        let checkDate = new Date(today);
        while (completionDates.has(checkDate.getTime())) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }

        const computedStats = {
          totalCourses: Array.isArray(courses) ? courses.length : 0,
          completedTopics: completedTopicsCount,
          avgProgress: Array.isArray(courses) && courses.length > 0 ? Math.round(progressSum / courses.length) : 0,
          activeGoals: Array.isArray(goals) ? goals.filter((g) => !g.completed).length : 0,
          streak: streak || (completedTopicsCount > 0 ? 1 : 0),
        };

        const totalSkills = Object.values(skillMap).reduce((a, b) => a + b, 0);
        let computedSkills = Object.entries(skillMap)
          .map(([label, count]) => ({
            label,
            value: totalSkills > 0 ? Math.round((count / totalSkills) * 100) : 0,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 4);

        if (computedSkills.length === 0) {
          computedSkills = [
            { label: "Algorithms & DSA", value: 65 },
            { label: "System Design", value: 45 },
            { label: "Full Stack Engineering", value: 30 },
          ];
        }

        setStats(computedStats);
        if (dailyCounts.some((v) => v > 0)) setWeeklyData(dailyCounts);
        setSkillData(computedSkills);

        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            stats: computedStats,
            weeklyData: dailyCounts.some((v) => v > 0) ? dailyCounts : weeklyData,
            skillData: computedSkills,
          })
        );
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
          <p className="text-gray-500 text-xs tracking-wider uppercase font-bold">Aggregating Learning Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* HEADER WITH STREAK PILL */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold uppercase tracking-wider text-[10px]">Performance Telemetry</span>
            <h1 className="text-xl font-bold text-white tracking-tight uppercase">
              LEARNING INSIGHTS
            </h1>
          </div>
          <p className="text-gray-500 text-xs mt-1 font-medium">
            Real-time breakdown of your academic trajectory and algorithm mastery
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#141418] border border-orange-500/30 px-4 py-2 rounded-full shadow-sm">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-tight">Current Streak:</span>
          <span className="text-sm font-black text-orange-400 font-mono">{stats.streak} {stats.streak === 1 ? "DAY" : "DAYS"}</span>
        </div>
      </header>

      {/* METRICS GRID (COMPACT PILL & CAPSULE CARDS) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<Zap className="w-4 h-4 text-blue-400" />}
          trend="+2 This Month"
          color="border-blue-500/20 bg-blue-500/5"
        />
        <MetricCard
          title="Topics Mastered"
          value={stats.completedTopics}
          icon={<CheckCircle2 className="w-4 h-4 text-green-400" />}
          trend="Top 5% User"
          color="border-green-500/20 bg-green-500/5"
        />
        <MetricCard
          title="Avg. Completion"
          value={`${stats.avgProgress}%`}
          icon={<Clock className="w-4 h-4 text-orange-400" />}
          trend="Steady Pace"
          color="border-orange-500/20 bg-orange-500/5"
        />
        <MetricCard
          title="Active Focus Goals"
          value={stats.activeGoals}
          icon={<Target className="w-4 h-4 text-purple-400" />}
          trend="Keep Going"
          color="border-purple-500/20 bg-purple-500/5"
        />
      </section>

      {/* CHARTS SECTION (COMPACT TWO-PANE LAYOUT) */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <WeeklyProgressChart data={weeklyData} />
        </div>
        <div className="lg:col-span-2">
          <SkillDistribution skills={skillData} />
        </div>
      </section>

      {/* RECENT ACHIEVEMENTS & SMART RECOMMENDATION BANNER */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121216] border border-white/[0.07] rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-orange-400" />
              Recent Achievements
            </h3>
            <span className="text-[10px] font-bold text-gray-500 uppercase">3 Earned</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AchievementPill icon={<Star className="w-4 h-4 text-amber-400" />} label="Fast Learner" desc="Solved 5 DSA tasks" />
            <AchievementPill icon={<Award className="w-4 h-4 text-blue-400" />} label="Early Bird" desc="7 Day active streak" />
            <AchievementPill icon={<Zap className="w-4 h-4 text-purple-400" />} label="Problem Solver" desc="Mastered Dynamic Window" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/15 via-[#141418] to-[#121216] border border-orange-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                AI Smart Recommendation
              </h3>
            </div>
            <p className="text-gray-200 text-xs font-medium leading-relaxed">
              You are excelling at <span className="text-orange-400 font-bold">"{skillData[0]?.label || 'DSA Patterns'}"</span>. 
              Try attempting Hard FAANG Graph traversals next!
            </p>
          </div>
          <div className="pt-4">
            <a
              href="/dashboard/ai-practice"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              Explore AI Lab <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, color }) {
  return (
    <div className={`p-4 rounded-2xl border bg-[#121216] flex items-center justify-between transition hover:border-white/20 ${color.split(" ")[0]}`}>
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{title}</p>
        <p className="text-2xl font-black text-white tabular-nums tracking-tight">{value}</p>
        <p className="text-[10px] font-bold text-gray-500 uppercase">{trend}</p>
      </div>
      <div className={`p-3 rounded-xl border ${color}`}>
        {icon}
      </div>
    </div>
  );
}

function WeeklyProgressChart({ data }) {
  const max = Math.max(...data, 1);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-orange-400" />
          Activity Pulse (Weekly Topics Solved)
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <span className="text-[10px] text-gray-400 font-bold uppercase">Live Telemetry</span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-36 pt-2">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex flex-col items-center h-28 justify-end">
              <div className="absolute -top-7 bg-orange-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {v}
              </div>
              <div
                className="w-full max-w-[28px] bg-gradient-to-t from-orange-600 to-amber-400 rounded-lg group-hover:brightness-125 transition-all duration-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                style={{ height: `${Math.max((v / max) * 100, 12)}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-white transition">
              {labels[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillDistribution({ skills }) {
  return (
    <div className="bg-[#121216] border border-white/[0.07] rounded-2xl p-5 flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-400" />
          Skill Distribution
        </h3>
        <span className="text-[10px] font-bold text-gray-500 uppercase">Top Domains</span>
      </div>

      <div className="space-y-4">
        {skills.map((s, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold tracking-tight">
              <span className="text-gray-300 truncate">{s.label}</span>
              <span className="text-orange-400 font-mono tabular-nums">{s.value}%</span>
            </div>
            <div className="h-2 bg-[#18181d] rounded-full overflow-hidden p-0.5 border border-white/[0.04]">
              <div
                className="h-full bg-gradient-to-r from-orange-600 to-amber-400 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementPill({ icon, label, desc }) {
  return (
    <div className="p-3 rounded-xl bg-[#15151a] border border-white/[0.06] flex items-center gap-3 transition hover:border-white/15">
      <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-white leading-tight">{label}</p>
        <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
      </div>
    </div>
  );
}
