"use client"

import { useState } from "react"
import { Transaction, Category } from "@/types/transaction"
import { CATEGORIES } from "@/config/categories"

type Props = {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionTable({ transactions, onDelete }: Props) {
  const [filter, setFilter]   = useState<Category | "All">("All")
  const [search, setSearch]   = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo]   = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")

  const filtered = transactions
    // category filter
    .filter((t) => filter === "All" || t.category === filter)
    // type filter
    .filter((t) => typeFilter === "all" || t.type === typeFilter)
    // search filter — matches title or category
    .filter((t) => {
      if (!search) return true
      return (
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      )
    })
    // date range filter
    .filter((t) => {
      const tDate = new Date(t.date)
      if (dateFrom && tDate < new Date(dateFrom)) return false
      if (dateTo && tDate > new Date(dateTo + "T23:59:59")) return false
      return true
    })

  const hasActiveFilters = filter !== "All" || search || dateFrom || dateTo || typeFilter !== "all"

  function clearFilters() {
    setFilter("All")
    setSearch("")
    setDateFrom("")
    setDateTo("")
    setTypeFilter("all")
  }

  return (
    <div className="rounded-xl border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Transactions</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Search bar */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search transactions..."
        className="w-full border rounded-md p-2 bg-background text-sm"
      />

      {/* Type filter */}
      <div className="flex gap-2">
        {(["all", "income", "expense"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`flex-1 py-1 rounded-md text-xs font-medium border transition
              ${typeFilter === t
                ? t === "income"
                  ? "bg-green-500 text-white border-green-500"
                  : t === "expense"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-black text-white dark:bg-white dark:text-black"
                : "bg-background"
              }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Date range */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full border rounded-md p-2 bg-background text-sm mt-1"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full border rounded-md p-2 bg-background text-sm mt-1"
          />
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        {(["All", ...Object.keys(CATEGORIES)] as (Category | "All")[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition
              ${filter === cat
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-background"
              }`}
          >
            {cat === "All" ? "All" : `${CATEGORIES[cat].emoji} ${cat}`}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {transactions.length} transactions
      </p>

      {/* Transaction list */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No transactions match your filters.
          </p>
        )}

        {filtered.map((transaction) => {
          const config = CATEGORIES[transaction.category]
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: config.color }}
                />
                <div>
                  <p className="font-medium text-sm">{transaction.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {config.emoji} {transaction.category} ·{" "}
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className={`font-bold text-sm ${
                  transaction.type === "income" ? "text-green-500" : "text-red-500"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </p>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-xs text-muted-foreground hover:text-red-500 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}