"use client";

import React, { useState } from "react";
import { Search, Bell, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import WeatherWidget from "./WeatherWidget";
import NotificationCenter from "./NotificationCenter";

export default function TopBar({ 
  currentPage = "Dashboard", 
  showSearch = true,
  searchQuery = "",
  onSearchChange = () => {}
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="h-16 bg-[#0e0e12]/90 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-6 z-40 relative shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-gray-500">
          <span>Console</span>
          <span className="text-gray-600">/</span>
          <span className="text-white font-bold">{currentPage}</span>
        </div>

        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search courses or topics..."
              className="bg-[#141418] border border-white/[0.08] rounded-full pl-9 pr-4 py-1.5 text-xs w-60
              placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50 text-gray-200 hover:border-white/15 transition-all focus:w-72 shadow-inner shadow-black/20"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className={`p-2 rounded-full border border-white/[0.06] bg-[#141418] relative transition-all ${
            isNotifOpen ? "text-orange-400 border-orange-500/30" : "text-gray-400 hover:text-white hover:border-white/15"
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
        </button>

        <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

        <div className="flex items-center gap-2.5 bg-[#141418] border border-white/[0.08] rounded-full px-3.5 py-1.5 shadow-sm hover:border-white/15 transition">
          <WeatherWidget />
          <div className="h-3.5 w-[1px] bg-white/10 mx-0.5" />
          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-6 h-6" } }} />
          </div>
        </div>
      </div>
    </header>
  );
}
