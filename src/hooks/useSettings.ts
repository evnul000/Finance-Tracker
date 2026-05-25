"use client"

import { useState, useEffect } from "react"
import { UserSettings } from "@/types/settings"
import { apiClient } from "@/lib/apiClient"

const DEFAULT_SETTINGS: UserSettings = {
  username: "User",
  profileIcon: "cat",
  theme: "dark",
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    apiClient.get<{ settings: UserSettings }>("/api/settings")
      .then(data => setSettings(data.settings))
      .catch(() => {})
  }, [])

  async function updateSettings(updated: Partial<UserSettings>) {
    const next = { ...settings, ...updated }
    setSettings(next)
    await apiClient.patch("/api/settings", updated)
  }

  async function clearAllData() {
    await Promise.all([
      apiClient.delete("/api/transactions?all=true").catch(() => {}),
      apiClient.delete("/api/bills?all=true").catch(() => {}),
      apiClient.delete("/api/budgets?all=true").catch(() => {}),
    ])
    window.location.reload()
  }

  return { settings, updateSettings, clearAllData }
}