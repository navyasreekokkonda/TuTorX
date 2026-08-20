"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Trophy, Loader2 } from "lucide-react";

export default function RightPanel({
  activityLabel = "Activity",
  upcomingLabel = "Upcoming",
  defaultTasks = [
    { label: "DSA Practice", time: "Today" },
    { label: "Java Revision", time: "Today" },
  ],
  upgradeTitle = "Unlock Cloud Compute",
  upgradeSubtitle = "Pro Plan",
  upgradeButtonText = "Upgrade",
  enableRazorpay = true,
}) {
  const { user } = useUser();
  const [upcoming, setUpcoming] = useState([]);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetch("/api/goals", {
      headers: {
        "x-user-id": user.id,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("API response not ok");
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data)
          ? data
          : null;

        if (!list) {
          setUpcoming(defaultTasks);
          return;
        }

        const upcomingTasks = list
          .filter((t) => !t.completed)
          .slice(0, 2)
          .map((t) => ({
            label: t.text || t.label || "Task",
            time: "Today",
          }));

        if (upcomingTasks.length > 0) {
          setUpcoming(upcomingTasks);
        } else {
          setUpcoming(defaultTasks);
        }
      })
      .catch(() => {
        setUpcoming(defaultTasks);
      });
  }, [user]);

  const handleUpgrade = async () => {
    if (!enableRazorpay || !user) return;
    setIsUpgrading(true);

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 2499, currency: "INR" }),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Failed to create order");

      const loadScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isScriptLoaded = await loadScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsUpgrading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AI Learning Platform",
        description: "Monthly Pro Subscription",
        order_id: order.id,
        handler: function (response) {
          alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#f97316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert("Payment failed to initialize.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <aside className="w-80 bg-[#0e0e10] border-l border-white/5 p-8 space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          {activityLabel}
        </h3>

        <div className="flex items-end gap-1 h-32">
          {[40, 70, 45, 90, 60, 30, 50].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                i === 3 ? "bg-orange-500" : "bg-white/10"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4">
          {upcomingLabel}
        </h3>

        <div className="space-y-3">
          {upcoming.map((e, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-orange-500/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-orange-500/10">
                <Trophy className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">{e.label}</p>
                <p className="text-xs text-gray-500">{e.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#111113] border border-orange-500/20 relative overflow-hidden">
        <p className="text-xs uppercase text-gray-400 mb-2">{upgradeSubtitle}</p>
        <p className="text-lg font-semibold text-gray-100 mb-4">
          {upgradeTitle}
        </p>
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="w-full h-10 bg-orange-500 text-black px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isUpgrading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            upgradeButtonText
          )}
        </button>
      </div>
    </aside>
  );
}
