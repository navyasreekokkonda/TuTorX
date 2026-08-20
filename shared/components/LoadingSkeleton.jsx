import React from "react";
import { cn } from "@/shared/lib/utils/cn";

export function LoadingSkeleton({ className, count = 1 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={cn("bg-white/5 animate-pulse rounded-2xl h-24 w-full", className)}
        />
      ))}
    </div>
  );
}
