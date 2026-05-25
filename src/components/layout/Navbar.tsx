"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDarkMode } from "@/hooks/useDarkMode"
import { useSettings } from "@/hooks/useSettings"
import { Moon, Sun, Bell, X } from "lucide-react"
import { Bill } from "@/types/bill"
import { Budget } from "@/types/budget"
import { Transaction } from "@/types/transaction"
import { getUpcomingBills, BILL_CATEGORY_EMOJI } from "@/lib/billUtils"
import { CATEGORIES } from "@/config/categories"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { useAuth } from "@/context/AuthContext"
import { useSocket } from "@/hooks/useSocket"
import { LogOut, Wifi, WifiOff } from "lucide-react"

const PROFILE_ICONS: Record<string, string> = {
  cat: "🐱", dog: "🐶", fox: "🦊", bear: "🐻",
  owl: "🦉", wolf: "🐺", dragon: "🐲", robot: "🤖",
  alien: "👾", ghost: "👻",
}

export function Navbar() {
  const router = useRouter()
  const { isDark, toggle } = useDarkMode()
  const { settings } = useSettings()
  const [showNotifications, setShowNotifications] = useState(false)
  const [bills, setBills] = useState<Bill[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 })
  const bellRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const { connected }    = useSocket()

  useEffect(() => {
    const b  = localStorage.getItem("bills")
    const bu = localStorage.getItem("budgets")
    const tr = localStorage.getItem("transactions")
    if (b)  setBills(JSON.parse(b))
    if (bu) setBudgets(JSON.parse(bu))
    if (tr) setTransactions(JSON.parse(tr))
  }, [])

  // Calculate exact pixel position of the bell button
  function openNotifications() {
    if (bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect()
      setDropdownPos({
        top: rect.bottom + 8,
        // right = distance from right edge of viewport to right edge of button
        right: window.innerWidth - rect.right,
      })
    }
    setShowNotifications((p) => !p)
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const upcomingBills = getUpcomingBills(bills, 14)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const overBudgetAlerts = budgets
    .filter((b) => b.month === currentMonth)
    .map((budget) => {
      const spent = transactions
        .filter(
          (t) =>
            t.category === budget.category &&
            t.type === "expense" &&
            t.date.slice(0, 7) === currentMonth
        )
        .reduce((sum, t) => sum + t.amount, 0)
      return { budget, spent, isOver: spent > budget.limit }
    })
    .filter((a) => a.isOver)

  const totalNotifications = upcomingBills.length + overBudgetAlerts.length

  // The dropdown rendered via portal — completely outside the navbar DOM
  const dropdown = (
    <AnimatePresence>
      {showNotifications && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: dropdownPos.top,
            right: dropdownPos.right,
            width: "288px",
            zIndex: 9999,
          }}
          className="rounded-xl border bg-background shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="font-semibold text-sm">Notifications</span>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-muted-foreground hover:text-foreground transition"
            >
              <X size={14} />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {totalNotifications === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                All clear! No alerts.
              </p>
            )}

            {upcomingBills.length > 0 && (
              <div>
                <p className="text-[11px] text-muted-foreground px-4 pt-3 pb-1 font-semibold uppercase tracking-wider">
                  Upcoming Bills
                </p>
                {upcomingBills.map(({ bill, daysUntil }) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-muted transition border-b last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base flex-shrink-0">
                        {BILL_CATEGORY_EMOJI[bill.category]}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{bill.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${bill.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                      daysUntil <= 3
                        ? "bg-red-500/20 text-red-400"
                        : daysUntil <= 7
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-primary/20 text-primary"
                    }`}>
                      {daysUntil === 0 ? "Today!" : `${daysUntil}d`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {overBudgetAlerts.length > 0 && (
              <div>
                <p className="text-[11px] text-muted-foreground px-4 pt-3 pb-1 font-semibold uppercase tracking-wider">
                  Over Budget
                </p>
                {overBudgetAlerts.map(({ budget, spent }) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-muted transition border-b last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base flex-shrink-0">
                        {CATEGORIES[budget.category]?.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{budget.category}</p>
                        <p className="text-xs text-muted-foreground">
                          ${spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 bg-red-500/20 text-red-400">
                      +${(spent - budget.limit).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-sm">
        {/* Left — logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <h1 className="text-xl font-bold">Finance Tracker</h1>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-md hover:bg-muted transition"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Bell button — ref attached directly to the button */}
          <button
            ref={bellRef}
            onClick={openNotifications}
            className="p-2 rounded-md hover:bg-muted transition relative"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={() => router.push("/settings")}
            className="flex items-center gap-2 pl-2 pr-3 py-1 px-2.5 rounded-md hover:bg-muted transition border"
            title="Go to Settings"
          >
            <span className="text-lg leading-none">
              {PROFILE_ICONS[settings.profileIcon] ?? "🐱"}
            </span>
            <span className="text-sm font-medium max-w-20 truncate">
              {settings.username}
            </span>
          </button>
            {/* Socket connection indicator */}
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-muted"}`}
            title={connected ? "Real-time connected" : "Connecting..."}
          />

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-md hover:bg-muted transition text-muted-foreground hover:text-red-400"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Portal renders dropdown at document.body level — zero layout impact */}
      {typeof document !== "undefined" &&
        createPortal(dropdown, document.body)}
    </>
  )
}