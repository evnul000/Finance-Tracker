"use client"

import { useState } from "react"
import { Budget } from "../types/budget"
import { Category } from "../types/transaction"
import { toast } from "sonner"
export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(() => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("budgets")
    return stored ? JSON.parse(stored) : []
  })

  function saveBudgets(updated: Budget[]) {
    setBudgets(updated)
    localStorage.setItem("budgets", JSON.stringify(updated))
  }

  function addBudget(category: Category, limit: number) {
    const month = new Date().toISOString().slice(0, 7) // "2026-05"
    // inside addBudget(), after saveBudgets():
        toast.success(`Budget set for ${category}`, {
        description: `$${limit} monthly limit`,
        })
    // If a budget for this category+month already exists, update it
    const exists = budgets.find(
      (b) => b.category === category && b.month === month
    )

    if (exists) {
      saveBudgets(
        budgets.map((b) =>
          b.id === exists.id ? { ...b, limit } : b
        )
      )
    } else {
      const newBudget: Budget = {
        id: crypto.randomUUID(),
        category,
        limit,
        month,
      }
      saveBudgets([...budgets, newBudget])
    }
  }

  function deleteBudget(id: string) {
    saveBudgets(budgets.filter((b) => b.id !== id))
  }

  return { budgets, addBudget, deleteBudget }
}