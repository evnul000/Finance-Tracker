"use client"

import { useState } from "react"
import { Bill } from "@/types/bill"
import { toast } from "sonner"

export function useBills() {
  const [bills, setBills] = useState<Bill[]>(() => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("bills")
    return stored ? JSON.parse(stored) : []
  })

  function saveBills(updated: Bill[]) {
    setBills(updated)
    localStorage.setItem("bills", JSON.stringify(updated))
  }

  function addBill(bill: Bill) {
    const updated = [bill, ...bills]
    saveBills(updated)
    toast.success(`Added "${bill.name}"`, {
      description: `$${bill.amount.toFixed(2)} · ${bill.frequency}`,
    })
  }

  function deleteBill(id: string) {
    const target = bills.find((b) => b.id === id)
    saveBills(bills.filter((b) => b.id !== id))
    if (target) toast.error(`Removed "${target.name}"`)
  }

  function markPaid(id: string) {
    const updated = bills.map((b) =>
      b.id === id ? { ...b, lastPaid: new Date().toISOString() } : b
    )
    saveBills(updated)
    toast.success("Marked as paid!")
  }

  return { bills, addBill, deleteBill, markPaid }
}