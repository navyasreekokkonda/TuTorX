"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SaveUserToDB() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const cacheKey = `tutorx_user_saved_${user.id}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(cacheKey)) {
      return;
    }

    async function saveUser() {
      try {
        await fetch("/api/save-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerkId: user.id,
            name: user.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
          }),
        });
        if (typeof window !== "undefined") {
          sessionStorage.setItem(cacheKey, "true");
        }
      } catch (err) {
        console.error("Failed to save user profile:", err);
      }
    }

    saveUser();
  }, [user]);

  return null;
}