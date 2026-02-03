"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("darkMode", false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        document.body.classList.add("darkMode");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.body.classList.remove("darkMode");
        document.documentElement.setAttribute("data-theme", "light");
      }
    };
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, [setIsDarkMode]);

  return { isDarkMode, toggleDarkMode, isLoaded };
}
