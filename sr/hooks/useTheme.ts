"use client";

import { useState, useEffect, useCallback } from "react";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    
    if (saved !== null) {
      const isDark = saved === "true";
      setIsDarkMode(isDark);
      applyTheme(isDark);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      applyTheme(prefersDark);
    }
    
    setIsLoaded(true);
  }, []);

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.body.classList.add("darkMode");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.body.classList.remove("darkMode");
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("darkMode", String(newValue));
      applyTheme(newValue);
      return newValue;
    });
  }, []);

  return { isDarkMode, toggleDarkMode, isLoaded };
}
