"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/Dashboard"
import { useBudgets } from "@/hooks/useBudgets"
import { Transaction } from "@/types/transaction"
import { BudgetPanel } from "@/components/dashboard/BudgetPanel"
import { apiClient } from "@/lib/apiClient"
import { motion } from "framer-motion"

export default function BudgetsPage() {
  const { budgets, addBudget, deleteBudget } = useBudgets()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    apiClient.get<{ transactions: Transaction[] }>("/api/transactions")
      .then(data => setTransactions(data.transactions))
      .catch(() => {})
      .finally(() => setMounted(true))
  }, [])

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthBudgets = budgets.filter(b => b.month === currentMonth)
  const overBudget   = monthBudgets.filter(b => {
    const spent = transactions
      .filter(t => t.category === b.category && t.type === "expense" && t.date.slice(0, 7) === currentMonth)
      .reduce((s, t) => s + t.amount, 0)
    return spent > b.limit
  })

  if (!mounted) return (
    <DashboardLayout>
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-muted" />
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground mt-1">Manage your monthly budget goals.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Budgets Set</p>
            <h2 className="text-3xl font-bold mt-2">{monthBudgets.length}</h2>
            <p className="text-xs text-muted-foreground mt-1">this month</p>
          </div>
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Over Budget</p>
            <h2 className={`text-3xl font-bold mt-2 ${overBudget.length > 0 ? "text-red-500" : "text-green-500"}`}>
              {overBudget.length}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">categories</p>
          </div>
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Total Budget Limit</p>
            <h2 className="text-3xl font-bold mt-2">
              ${monthBudgets.reduce((s, b) => s + b.limit, 0).toFixed(2)}
            </h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <BudgetPanel
            budgets={budgets}
            transactions={transactions}
            onAddBudget={addBudget}
            onDeleteBudget={deleteBudget}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  )
}