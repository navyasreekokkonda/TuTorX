"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  BarChart3,
  Target,
  Settings,
  LogOut,
  Zap,
  Cpu
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function Sidebar({ hidden = false }) {
  const { signOut } = useClerk();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (hidden) return null;

  const navItems = [
    { icon: Home, label: "Home", address: "/dashboard" },
    { icon: BookOpen, label: "Library", address: "/notebook" },
    { icon: BarChart3, label: "Analytics", address: "/analytics" },
    { icon: Target, label: "Goals", address: "/goals" },
    { icon: Cpu, label: "AI Practice Lab", address: "/dashboard/ai-practice" },
    { icon: Settings, label: "Settings", address: "/settings" },
  ];

  const handleNavigation = (address) => {
    // For Home, if it's "/", we navigate to dashboard, but the logo/home usually points to dashboard in this app
    router.push(address);
  };

  return (
    <>
      <aside className="w-16 bg-[#0e0e12]/90 backdrop-blur-md border-r border-white/[0.06] flex flex-col items-center py-5 justify-between z-50 shrink-0">
        {/* TOP */}
        <div className="flex flex-col items-center gap-8">
          {/* LOGO */}
          <div 
            className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-md cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => router.push("/dashboard")}
          >
            <Zap className="w-4 h-4 text-black fill-current" />
          </div>

          {/* NAV */}
          <nav className="flex flex-col gap-3">
            {navItems.map((item, i) => {
              const isActive = pathname === item.address || (item.address === "/dashboard" && pathname === "/");
              return (
                <button
                  key={i}
                  className={`p-2.5 rounded-xl transition-all ${isActive
                    ? "bg-[#141418] border border-orange-500/30 text-orange-400 shadow-sm"
                    : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  title={item.label}
                  onClick={() => handleNavigation(item.address)}
                >
                  <item.icon className="w-4 h-4" />
                </button>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </aside>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* MODAL */}
          <div className="relative bg-[#111113] border border-white/10 rounded-2xl p-6 w-[320px] shadow-xl">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              Log out?
            </h3>

            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to log out of TutorX?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-300 border border-white/10 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={() => signOut({ redirectUrl: "/" })}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-black hover:opacity-90"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
