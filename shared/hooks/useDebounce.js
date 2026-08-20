"use client";

import { useState, useEffect } from "react";

/**
 * Hook to debounce values (e.g. search input).
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in ms (default 300ms)
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
