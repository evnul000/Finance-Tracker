"use client"
import { DashboardLayout } from "../components/layout/Dashboard"
import { useEffect, useState } from "react"
import { TransactionForm } from "../components/forms/TransactionForm"
import { TransactionTable } from "../components/dashboard/TransactionTable"
import { Transaction } from "../types/transaction"

export default function HomePage() {

  // ----------------------------
  // STATE — the app's "memory"
  // ----------------------------
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
  if (typeof window === "undefined") return []
  const storedTransactions = localStorage.getItem("transactions")
  return storedTransactions ? JSON.parse(storedTransactions) : []
})

  // ----------------------------
  // ADD a new transaction
  // ----------------------------
  function addTransaction(transaction: Transaction) {
    setTransactions((prev) => [transaction, ...prev])
    // [transaction, ...prev] puts the newest one at the TOP of the list
  }

  // ----------------------------
  // DELETE a transaction by id
  // ----------------------------
  function deleteTransaction(id: string) {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
      // filter() keeps everything EXCEPT the one with the matching id
    )
  }

  // ----------------------------
  // LOAD from localStorage on first render
  // ----------------------------
  // The empty [] means: run this ONCE when the page loads, never again

  // ----------------------------
  // SAVE to localStorage whenever transactions change
  // ----------------------------
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])
  // [transactions] means: re-run this every time transactions updates

  // ----------------------------
  // CALCULATE totals for the summary cards
  // ----------------------------
  const totalSpending = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  )

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your expenses and spending.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <h2 className="text-3xl font-bold mt-2">
              {transactions.length}
            </h2>
          </div>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Total Spending</p>
            <h2 className="text-3xl font-bold mt-2">
              ${totalSpending.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Latest Category</p>
            <h2 className="text-3xl font-bold mt-2">
              {transactions.length > 0 ? transactions[0].category : "—"}
            </h2>
          </div>

        </div>

        {/* Form + Table side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionForm onAddTransaction={addTransaction} />
          <TransactionTable
            transactions={transactions}
            onDelete={deleteTransaction}
          />
        </div>

      </div>
    </DashboardLayout>
  )
}