"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/Dashboard"
import { useSettings } from "@/hooks/useSettings"
import { ProfileIcon } from "@/types/settings"
import { useDarkMode } from "@/hooks/useDarkMode"
import { motion } from "framer-motion"
import { toast } from "sonner"

const PROFILE_ICONS: { value: ProfileIcon; emoji: string; label: string }[] = [
  { value: "cat",    emoji: "🐱", label: "Cat" },
  { value: "dog",    emoji: "🐶", label: "Dog" },
  { value: "fox",    emoji: "🦊", label: "Fox" },
  { value: "bear",   emoji: "🐻", label: "Bear" },
  { value: "owl",    emoji: "🦉", label: "Owl" },
  { value: "wolf",   emoji: "🐺", label: "Wolf" },
  { value: "dragon", emoji: "🐲", label: "Dragon" },
  { value: "robot",  emoji: "🤖", label: "Robot" },
  { value: "alien",  emoji: "👾", label: "Alien" },
  { value: "ghost",  emoji: "👻", label: "Ghost" },
]

export default function SettingsPage() {
  const { settings, updateSettings, clearAllData } = useSettings()
  const { isDark, toggle } = useDarkMode()
  const [username, setUsername] = useState(settings.username)
  const [confirmClear, setConfirmClear] = useState(false)

  function handleSaveUsername() {
    if (!username.trim()) return
    updateSettings({ username: username.trim() })
    toast.success("Username updated!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and preferences.</p>
        </motion.div>

        {/* Profile section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-xl border p-6 space-y-4"
        >
          <h2 className="text-lg font-bold">Profile</h2>

          {/* Username */}
          <div>
            <label className="text-sm font-medium">Username</label>
            <div className="flex gap-2 mt-1">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 border rounded-md p-2 bg-background text-sm"
                placeholder="Your name"
                maxLength={24}
              />
              <button
                onClick={handleSaveUsername}
                className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
          </div>

          {/* Profile icon picker */}
          <div>
            <label className="text-sm font-medium">Profile Icon</label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {PROFILE_ICONS.map((icon) => (
                <button
                  key={icon.value}
                  onClick={() => {
                    updateSettings({ profileIcon: icon.value })
                    toast.success(`Profile icon updated to ${icon.label}!`)
                  }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-2xl transition-all
                    ${settings.profileIcon === icon.value
                      ? "border-primary bg-primary/10 shadow-md shadow-primary/20 scale-105"
                      : "hover:bg-muted border-transparent"
                    }`}
                >
                  {icon.emoji}
                  <span className="text-[10px] text-muted-foreground">{icon.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border p-6 space-y-4"
        >
          <h2 className="text-lg font-bold">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Currently {isDark ? "dark" : "light"} mode
              </p>
            </div>
            <button
              onClick={toggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                isDark ? "bg-primary" : "bg-muted"
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                isDark ? "translate-x-6" : "translate-x-0"
              }`} />
            </button>
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border border-red-500/30 p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Clear All Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently deletes all transactions, budgets, and bills.
              </p>
            </div>

            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="border border-red-500/50 text-red-400 rounded-md px-4 py-2 text-sm font-medium hover:bg-red-500/10 transition"
              >
                Clear Data
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="border rounded-md px-4 py-2 text-sm hover:bg-muted transition"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAllData}
                  className="bg-red-500 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-600 transition"
                >
                  Yes, delete everything
                </button>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  )
}