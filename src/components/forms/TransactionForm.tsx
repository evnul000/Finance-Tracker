"use client"

import { useState } from "react"
import { Transaction } from "@/types/transaction"

type Props = {
  onAddTransaction: (transaction: Transaction) => void
}

export function TransactionForm({ onAddTransaction }: Props) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("Food")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      title,
      amount: Number(amount),
      category,
      date: new Date().toISOString()
    }

    onAddTransaction(newTransaction)

    setTitle("")
    setAmount("")
    setCategory("Food")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border p-6 space-y-4"
    >
      <h2 className="text-xl font-bold">
        Add Transaction
      </h2>

      <div>
        <label className="text-sm font-medium">
          Title
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md p-2 mt-1"
          placeholder="Groceries"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Amount
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded-md p-2 mt-1"
          placeholder="50"
        />
      </div>

      <div>
        <label className="text-sm font-medium">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-md p-2 mt-1"
        >
          <option>Food</option>
          <option>Gaming</option>
          <option>Bills</option>
          <option>Shopping</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-black text-white rounded-md px-4 py-2"
      >
        Add Transaction
      </button>
    </form>
  )
}