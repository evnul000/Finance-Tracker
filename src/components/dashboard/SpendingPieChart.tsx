"use client"

import { Transaction } from "@/types/transaction"
import { CATEGORIES } from "@/config/categories"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

type Props = {
  transactions: Transaction[]
}

export function SpendingPieChart({ transactions }: Props) {
  // Group expenses by category and sum them
  const data = Object.keys(CATEGORIES)
    .map((cat) => {
      const total = transactions
        .filter((t) => t.category === cat && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
      return {
        name: `${CATEGORIES[cat as keyof typeof CATEGORIES].emoji} ${cat}`,
        value: total,
        color: CATEGORIES[cat as keyof typeof CATEGORIES].color,
      }
    })
    .filter((d) => d.value > 0) // only show categories that have spending

  if (data.length === 0) {
    return (
      <div className="rounded-xl border p-6 flex items-center justify-center h-64">
        <p className="text-muted-foreground text-sm">
          Add some expenses to see your spending breakdown.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
         <Tooltip
  formatter={(value) => typeof value === "number" ? [`$${value.toFixed(2)}`, "Spent"] : value}
/>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}