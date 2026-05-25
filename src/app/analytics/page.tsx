"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/Dashboard"
import { Transaction } from "@/types/transaction"
import { SpendingPieChart } from "@/components/dashboard/SpendingPieChart"
import { MonthlyChart } from "@/components/dashboard/MonthlyChart"
import { CATEGORIES } from "@/config/categories"
import { apiClient } from "@/lib/apiClient"
import { motion } from "framer-motion"

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    apiClient.get<{ transactions: Transaction[] }>("/api/transactions")
      .then(data => setTransactions(data.transactions))
      .catch(() => {})
      .finally(() => setMounted(true))
  }, [])

  const totalIncome   = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const savingsRate   = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : "0.0"

  const categoryTotals = (Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).map((cat) => ({
    cat,
    total: transactions
      .filter(t => t.category === cat && t.type === "expense")
      .reduce((s, t) => s + t.amount, 0),
  })).sort((a, b) => b.total - a.total)

  const topCategory = categoryTotals[0]

  if (!mounted) return (
    <DashboardLayout>
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="rounded-xl border h-24 bg-muted" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border h-80 bg-muted" />
          <div className="rounded-xl border h-80 bg-muted" />
        </div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Visualise your spending patterns.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <h2 className="text-2xl font-bold mt-2 text-green-500">+${totalIncome.toFixed(2)}</h2>
          </div>
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <h2 className="text-2xl font-bold mt-2 text-red-500">-${totalExpenses.toFixed(2)}</h2>
          </div>
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <h2 className={`text-2xl font-bold mt-2 ${Number(savingsRate) >= 0 ? "text-primary" : "text-red-500"}`}>
              {savingsRate}%
            </h2>
          </div>
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Top Category</p>
            <h2 className="text-2xl font-bold mt-2">
              {topCategory?.total > 0 ? `${CATEGORIES[topCategory.cat].emoji} ${topCategory.cat}` : "—"}
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <SpendingPieChart transactions={transactions} />
          <MonthlyChart transactions={transactions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border p-6 space-y-3"
        >
          <h2 className="text-lg font-bold">Spending by Category</h2>
          <div className="space-y-3">
            {categoryTotals.filter(c => c.total > 0).map(({ cat, total }) => {
              const pct = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0
              const config = CATEGORIES[cat]
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{config.emoji} {cat}</span>
                    <span className="font-medium">${total.toFixed(2)} <span className="text-muted-foreground">({pct.toFixed(1)}%)</span></span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                </div>
              )
            })}
            {categoryTotals.every(c => c.total === 0) && (
              <p className="text-sm text-muted-foreground text-center py-6">No expense data yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}