"use client"

import { useEffect, useState } from "react"

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true
    // Default to dark if no preference saved yet
    const saved = localStorage.getItem("theme")
    return saved ? saved === "dark" : true
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDark])

  return { isDark, toggle: () => setIsDark((prev) => !prev) }
}