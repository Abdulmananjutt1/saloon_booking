"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // On mount — sync state with localStorage or DOM attribute
  useEffect(() => {
    try {
      const saved = (localStorage.getItem("gs-theme") || localStorage.getItem("theme")) as Theme | null;
      const domTheme = document.documentElement.getAttribute("data-theme") as Theme | null;
      const initial: Theme =
        saved === "dark" || saved === "light"
          ? saved
          : domTheme === "dark" || domTheme === "light"
          ? domTheme
          : "light";

      setThemeState(initial);
      document.documentElement.setAttribute("data-theme", initial);
      localStorage.setItem("gs-theme", initial);
      localStorage.setItem("theme", initial);
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    try {
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("gs-theme", next);
      localStorage.setItem("theme", next);
    } catch {
      /* ignore */
    }
  };

  const toggle = () => {
    const current =
      document.documentElement.getAttribute("data-theme") === "dark" || theme === "dark"
        ? "dark"
        : "light";
    const next: Theme = current === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
