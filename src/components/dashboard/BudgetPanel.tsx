"use client"

import { useState } from "react"
import { Budget } from "@/types/budget"
import { Transaction, Category } from "@/types/transaction"
import { CATEGORIES } from "@/config/categories"

type Props = {
  budgets: Budget[]
  transactions: Transaction[]
  onAddBudget: (category: Category, limit: number) => void
  onDeleteBudget: (id: string) => void
}

export function BudgetPanel({
  budgets,
  transactions,
  onAddBudget,
  onDeleteBudget,
}: Props) {
  const [category, setCategory] = useState<Category>("Food")
  const [limit, setLimit] = useState("")

  const currentMonth = new Date().toISOString().slice(0, 7)

  // How much has been spent in this category this month
  function getSpent(cat: Category) {
    return transactions
      .filter((t) => {
        const tMonth = t.date.slice(0, 7)
        return t.category === cat && t.type === "expense" && tMonth === currentMonth
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!limit) return
    onAddBudget(category, Number(limit))
    setLimit("")
  }

  // Only show budgets for the current month
  const thisMonthBudgets = budgets.filter((b) => b.month === currentMonth)

  return (
    <div className="rounded-xl border p-6 space-y-6">
      <h2 className="text-xl font-bold">Monthly Budgets</h2>

      {/* Add budget form */}
      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="border rounded-md p-2 bg-background text-sm"
        >
          {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORIES[cat].emoji} {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="Budget limit ($)"
          className="border rounded-md p-2 bg-background text-sm flex-1 min-w-32"
        />

        <button
          type="submit"
          className="bg-black text-white dark:bg-white dark:text-black rounded-md px-4 py-2 text-sm"
        >
          Set Budget
        </button>
      </form>

      {/* Budget progress bars */}
      <div className="space-y-4">
        {thisMonthBudgets.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No budgets set for this month.
          </p>
        )}

        {thisMonthBudgets.map((budget) => {
          const spent = getSpent(budget.category)
          const percent = Math.min((spent / budget.limit) * 100, 100)
          const isOver = spent > budget.limit
          const isWarning = percent >= 80 && !isOver
          const config = CATEGORIES[budget.category]

          return (
            <div key={budget.id} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">
                  {config.emoji} {budget.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className={isOver ? "text-red-500 font-bold" : "text-muted-foreground"}>
                    ${spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onDeleteBudget(budget.id)}
                    className="text-xs text-muted-foreground hover:text-red-500 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: isOver
                      ? "#ef4444"
                      : isWarning
                      ? "#f97316"
                      : config.color,
                  }}
                />
              </div>

              {/* Alert messages */}
              {isOver && (
                <p className="text-xs text-red-500 font-medium">
                  ⚠️ Over budget by ${(spent - budget.limit).toFixed(2)}
                </p>
              )}
              {isWarning && (
                <p className="text-xs text-orange-500 font-medium">
                  🔶 {Math.round(percent)}% of budget used — almost there!
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}