"use client"

import { Transaction } from "../../types/transaction"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"

type Props = {
  transactions: Transaction[]
}

// Builds last 6 months of income vs expense data
function buildMonthlyData(transactions: Transaction[]) {
  const months: { month: string; income: number; expenses: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)

    const monthLabel = date.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    })

    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return (
        tDate.getMonth() === date.getMonth() &&
        tDate.getFullYear() === date.getFullYear()
      )
    })

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    months.push({ month: monthLabel, income, expenses })
  }

  return months
}

export function MonthlyChart({ transactions }: Props) {
  const data = buildMonthlyData(transactions)

  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-xl font-bold mb-4">Last 6 Months</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => typeof value === "number" ? `$${value.toFixed(2)}` : value} />
          <Legend />
          <Bar dataKey="income"   name="Income"   fill="#22c55e" radius={[4,4,0,0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}