"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Tick */}
        <div className="animate-scale-in">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-white text-xl font-medium">Login successful</h1>

        <p className="text-neutral-400 text-sm">
          Redirecting to your dashboard…
        </p>
      </div>
    </div>
  );
}
