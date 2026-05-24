"use client"

import { useDarkMode } from "@/hooks/useDarkMode"
import { Moon, Sun } from "lucide-react"

export function Navbar() {
  const { isDark, toggle } = useDarkMode()

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl">💰</span>
        <h1 className="text-xl font-bold">Finance Tracker</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="border rounded-md p-2 hover:bg-muted transition"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

     
      </div>
    </header>
  )
}