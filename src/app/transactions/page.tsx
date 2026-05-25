"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/Dashboard"
import { TransactionTable } from "@/components/dashboard/TransactionTable"
import { Transaction } from "@/types/transaction"
import { apiClient } from "@/lib/apiClient"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    apiClient.get<{ transactions: Transaction[] }>("/api/transactions")
      .then(data => setTransactions(data.transactions))
      .catch(() => {})
      .finally(() => setMounted(true))
  }, [])

  async function deleteTransaction(id: string) {
    const target = transactions.find((t) => t.id === id)
    await apiClient.delete(`/api/transactions?id=${id}`)
    setTransactions(prev => prev.filter(t => t.id !== id))
    if (target) toast.error(`Deleted "${target.title}"`)
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-48 rounded-lg bg-muted" />
          <div className="h-64 rounded-xl bg-muted" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-1">View and manage all your transactions.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Total</p>
            <h2 className="text-3xl font-bold mt-2">{transactions.length}</h2>
            <p className="text-xs text-muted-foreground mt-1">transactions</p>
          </div>
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <h2 className="text-3xl font-bold mt-2 text-green-500">+${totalIncome.toFixed(2)}</h2>
          </div>
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <h2 className="text-3xl font-bold mt-2 text-red-500">-${totalExpenses.toFixed(2)}</h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <TransactionTable
            transactions={transactions}
            onDelete={deleteTransaction}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  )
}