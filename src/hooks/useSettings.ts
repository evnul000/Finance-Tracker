"use client"

import { useState } from "react"
import { UserSettings } from "@/types/settings"

const DEFAULT_SETTINGS: UserSettings = {
  username: "User",
  profileIcon: "cat",
  theme: "dark",
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS
    const stored = localStorage.getItem("settings")
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
  })

  function updateSettings(updated: Partial<UserSettings>) {
    const next = { ...settings, ...updated }
    setSettings(next)
    localStorage.setItem("settings", JSON.stringify(next))
  }

  function clearAllData() {
    localStorage.removeItem("transactions")
    localStorage.removeItem("budgets")
    localStorage.removeItem("bills")
    localStorage.removeItem("settings")
    window.location.reload()
  }

  return { settings, updateSettings, clearAllData }
}