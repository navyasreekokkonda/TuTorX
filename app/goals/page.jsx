"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Trophy,
  Star,
  Clock,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

/* ================= PAGE ================= */

export default function GoalsPage() {
  const { user } = useUser();

  const [tasks, setTasks] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState("");

  /* -------- FETCH TASKS -------- */
  useEffect(() => {
    if (!user) return;

    fetch("/api/goals")
      .then((res) => res.json())
      .then((res) => setTasks(res.data || res || []));
  }, [user]);

  /* -------- FETCH ROADMAP -------- */
  useEffect(() => {
    fetch("/api/roadmap")
      .then((res) => res.json())
      .then((res) => setRoadmap(res.data || res || []));
  }, []);

  /* -------- TOGGLE TASK -------- */
  const toggleTask = async (id) => {
    await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  /* -------- ADD TASK -------- */
  const addTask = async () => {
    if (!newTask.trim()) return;

    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: newTask,
      }),
    });

    const json = await res.json();
    const created = json.data || json;
    if (created && created._id) {
      setTasks((prev) => [created, ...prev]);
    }
    setNewTask("");
    setShowAddTask(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex h-screen bg-[#0b0b0c] text-gray-300 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage="Goals" />

        <main className="flex-1 overflow-y-auto p-8 custom-scroll">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ================= LEFT COLUMN ================= */}
            <div className="lg:col-span-1 space-y-6">
              {/* DAILY TASKS */}
              <section className="bg-[#111113] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                    Daily To-Do
                  </h2>
                  <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-1 rounded-md">
                    {completedCount}/{tasks.length} Done
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => toggleTask(task._id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                        task.completed
                          ? "bg-orange-500/5 border-orange-500/20 text-gray-500"
                          : "bg-white/5 border-white/5 text-gray-200 hover:border-white/10"
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600" />
                      )}
                      <span
                        className={`text-sm ${
                          task.completed ? "line-through" : ""
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddTask(true)}
                  className="w-full mt-4 py-3 rounded-xl border border-dashed border-white/10
                             text-xs text-gray-500 hover:text-gray-300 hover:border-white/20"
                >
                  + Add Custom Task
                </button>
              </section>

              {/* ACHIEVEMENT */}
              <section className="bg-orange-500 rounded-3xl p-6 text-black">
                <Trophy className="w-8 h-8 mb-4" />
                <h3 className="font-bold text-xl mb-1">Weekly Champ</h3>
                <p className="text-sm opacity-80">
                  You’re among the top learners this week 🚀
                </p>
              </section>
            </div>

            {/* ================= RIGHT COLUMN ================= */}
            <div className="lg:col-span-2">
              <section className="bg-[#111113] border border-white/5 rounded-3xl p-8">
                <h2 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-6">
                  Learning Roadmap
                </h2>

                <div className="relative space-y-8">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-orange-500 via-orange-500/50 to-white/5" />

                  {roadmap.map((step) => (
                    <RoadmapStep
                      key={step._id}
                      status={step.status}
                      title={step.title}
                      desc={step.desc}
                      icon={
                        step.status === "completed" ? (
                          <CheckCircle2 size={16} />
                        ) : step.status === "active" ? (
                          <Clock size={16} />
                        ) : (
                          <Star size={16} />
                        )
                      }
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* ================= ADD TASK MODAL ================= */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowAddTask(false)}
          />

          <div className="relative bg-[#111113] border border-white/10 rounded-2xl p-6 w-[360px]">
            <h3 className="text-sm font-semibold text-gray-200 mb-4">
              Add New Task
            </h3>

            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="e.g. Finish DSA Arrays"
              className="w-full bg-[#0b0b0c] border border-white/10 rounded-lg px-3 py-2
                         text-sm text-gray-200 focus:outline-none"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddTask(false)}
                className="px-3 py-1.5 text-xs text-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={addTask}
                className="px-4 py-1.5 text-xs bg-orange-500 text-black rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



/* ================= ROADMAP STEP ================= */

function RoadmapStep({ status, title, desc, icon }) {
  const styles = {
    completed:
      "bg-orange-500 border-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]",
    active: "bg-[#0b0b0c] border-orange-500 text-orange-500 animate-pulse",
    locked: "bg-[#0b0b0c] border-white/10 text-gray-600",
  };

  return (
    <div className="relative pl-12">
      <div
        className={`absolute left-0 top-1 w-10 h-10 rounded-full border-2 flex items-center justify-center ${styles[status]}`}
      >
        {icon}
      </div>

      <div
        className={`p-5 rounded-2xl border ${
          status === "locked"
            ? "bg-transparent border-white/5 opacity-50"
            : "bg-white/5 border-white/5"
        }`}
      >
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}


