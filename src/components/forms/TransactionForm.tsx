"use client"

import { useState } from "react"
import { Transaction, Category } from "../../types/transaction"
import { CATEGORIES } from "../../config/categories"

type Props = {
  onAddTransaction: (transaction: Transaction) => void
}

export function TransactionForm({ onAddTransaction }: Props) {
  const [title, setTitle]       = useState("")
  const [amount, setAmount]     = useState("")
  const [category, setCategory] = useState<Category>("Food")
  const [type, setType]         = useState<"expense" | "income">("expense")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !amount) return

    const newTransaction: Transaction = {
      id:       crypto.randomUUID(),
      title,
      amount:   Number(amount),
      category,
      date:     new Date().toISOString(),
      type,
    }

    onAddTransaction(newTransaction)
    setTitle("")
    setAmount("")
    setCategory("Food")
    setType("expense")
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-4">
      <h2 className="text-xl font-bold">Add Transaction</h2>

      {/* Income / Expense toggle */}
      <div className="flex gap-2">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 py-2 rounded-md text-sm font-medium border transition
              ${type === t
                ? t === "expense"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-green-500 text-white border-green-500"
                : "bg-background text-foreground"
              }`}
          >
            {t === "expense" ? "Expense" : "Income"}
          </button>
        ))}
      </div>

      {/* Title */}
      <div>
        <label className="text-sm font-medium">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md p-2 mt-1 bg-background"
          placeholder="Groceries"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="text-sm font-medium">Amount ($)</label>
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-md p-2 mt-1 bg-background"
          placeholder="50"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full border rounded-md p-2 mt-1 bg-background"
        >
          {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORIES[cat].emoji} {CATEGORIES[cat].label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white rounded-md px-4 py-2 dark:bg-white dark:text-black"
      >
        Add Transaction
      </button>
    </form>
  )
}