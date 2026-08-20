"use client";

import { useWeather } from "@/hooks/useWeather";

export default function WeatherWidget() {
  const { weather, loading } = useWeather();

  if (loading) {
    return <span className="text-sm text-gray-500">Loading weather…</span>;
  }

  if (!weather) {
    return <span className="text-sm text-gray-500">Weather unavailable</span>;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-300">
      <span className="text-orange-400">☀️</span>
      <span>{Math.round(weather.temperature)}°C</span>
      <span className="text-gray-500">· Hyderabad</span>
    </div>
  );
}
