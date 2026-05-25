"use client"

import { useState, useEffect } from "react"
import { Bill } from "@/types/bill"
import { apiClient } from "@/lib/apiClient"
import { toast } from "sonner"

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<{ bills: Bill[] }>("/api/bills")
      .then(data => setBills(data.bills))
      .catch(() => setBills([]))
      .finally(() => setLoading(false))
  }, [])

  async function addBill(bill: Bill) {
    const data = await apiClient.post<{ bill: Bill }>("/api/bills", bill)
    setBills(prev => [data.bill, ...prev])
    toast.success(`Added "${bill.name}"`)
  }

  async function deleteBill(id: string) {
    const target = bills.find(b => b.id === id)
    await apiClient.delete(`/api/bills?id=${id}`)
    setBills(prev => prev.filter(b => b.id !== id))
    if (target) toast.error(`Removed "${target.name}"`)
  }

  async function markPaid(id: string) {
    await apiClient.patch("/api/bills", { id, lastPaid: new Date().toISOString() })
    setBills(prev => prev.map(b => b.id === id ? { ...b, lastPaid: new Date().toISOString() } : b))
    toast.success("Marked as paid!")
  }

  return { bills, loading, addBill, deleteBill, markPaid }
}