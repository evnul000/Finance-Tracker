"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "../components/layout/Dashboard"
import { TransactionForm } from "../components/forms/TransactionForm"
import { TransactionTable } from "../components/dashboard/TransactionTable"
import { Transaction } from "../types/transaction"
import { SpendingPieChart } from "../components/dashboard/SpendingPieChart"
import { MonthlyChart } from "../components/dashboard/MonthlyChart"
import { useBudgets } from "@/hooks/useBudgets"
import { BudgetPanel } from "@/components/dashboard/BudgetPanel"
import { Skeleton } from "@/components/ui/Skeleton"
import { FadeIn } from "@/components/ui/FadeIn"
import { toast } from "sonner"

export default function HomePage() {

  // ----------------------------
  // MOUNTED — prevents hydration mismatch
  // ----------------------------
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ----------------------------
  // BUDGETS — custom hook
  // ----------------------------
  const { budgets, addBudget, deleteBudget } = useBudgets()

  // ----------------------------
  // STATE — transactions loaded from localStorage
  // ----------------------------
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("transactions")
    return stored ? JSON.parse(stored) : []
  })

  // ----------------------------
  // ADD a new transaction
  // ----------------------------
  function addTransaction(transaction: Transaction) {
    setTransactions((prev) => [transaction, ...prev])
    toast.success(`Added "${transaction.title}"`, {
      description: `$${transaction.amount.toFixed(2)} · ${transaction.category}`,
    })
  }

  // ----------------------------
  // DELETE a transaction by id
  // ----------------------------
  function deleteTransaction(id: string) {
    const target = transactions.find((t) => t.id === id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    if (target) {
      toast.error(`Deleted "${target.title}"`)
    }
  }

  // ----------------------------
  // SAVE to localStorage whenever transactions change
  // ----------------------------
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])

  // ----------------------------
  // CALCULATIONS
  // ----------------------------
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  // ----------------------------
  // LOADING SKELETON
  // ----------------------------
  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl border p-6 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border p-6 space-y-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="rounded-xl border p-6 space-y-4">
              <Skeleton className="h-6 w-36" />
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page Header */}
        <FadeIn delay={0}>
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your expenses and spending.
            </p>
          </div>
        </FadeIn>

        {/* Summary Cards — 3 clean cards, no duplicates */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="rounded-xl border p-6">
              <p className="text-sm text-muted-foreground">Balance</p>
              <h2 className={`text-3xl font-bold mt-2 ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>
                ${balance.toFixed(2)}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <h2 className="text-3xl font-bold mt-2 text-green-500">
                +${totalIncome.toFixed(2)}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {transactions.filter(t => t.type === "income").length} income entries
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <h2 className="text-3xl font-bold mt-2 text-red-500">
                -${totalExpenses.toFixed(2)}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {transactions.filter(t => t.type === "expense").length} expense entries
              </p>
            </div>

          </div>
        </FadeIn>

        {/* Form + Table */}
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionForm onAddTransaction={addTransaction} />
            <TransactionTable
              transactions={transactions}
              onDelete={deleteTransaction}
            />
          </div>
        </FadeIn>

        {/* Charts */}
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingPieChart transactions={transactions} />
            <MonthlyChart transactions={transactions} />
          </div>
        </FadeIn>

        {/* Budget Goals */}
        <FadeIn delay={0.4}>
          <BudgetPanel
            budgets={budgets}
            transactions={transactions}
            onAddBudget={addBudget}
            onDeleteBudget={deleteBudget}
          />
        </FadeIn>

      </div>
    </DashboardLayout>
  )
}