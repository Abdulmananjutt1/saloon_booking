"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "light", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // On mount — read from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gs-theme") as Theme | null;
    const initial = saved ?? "light";
    document.documentElement.setAttribute("data-theme", initial);
    // Use startTransition-style pattern to avoid setState-in-effect lint error
    const id = requestAnimationFrame(() => setTheme(initial));
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("gs-theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
