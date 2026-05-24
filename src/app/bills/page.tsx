"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/Dashboard"
import { useBills } from "@/hooks/useBills"
import { Bill, BillCategory, BillFrequency } from "@/types/bill"
import { getDaysUntilDue, BILL_CATEGORY_EMOJI, isFinished } from "@/lib/billUtils"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, CheckCircle, Plus, X } from "lucide-react"

const CATEGORIES: BillCategory[] = [
  "Electricity", "Water", "Internet", "Phone",
  "Rent", "Insurance", "Streaming", "Gym", "Other"
]

const FREQUENCIES: { value: BillFrequency; label: string }[] = [
  { value: "weekly",   label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly",  label: "Monthly" },
  { value: "yearly",   label: "Yearly" },
]

export default function BillsPage() {
  const { bills, addBill, deleteBill, markPaid } = useBills()
  const [showForm, setShowForm] = useState(false)

  const [name, setName]           = useState("")
  const [amount, setAmount]       = useState("")
  const [category, setCategory]   = useState<BillCategory>("Electricity")
  const [frequency, setFrequency] = useState<BillFrequency>("monthly")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate]     = useState("")
  const [autopay, setAutopay]     = useState(false)
  const [notes, setNotes]         = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !amount || !startDate) return

    const newBill: Bill = {
      id: crypto.randomUUID(),
      name,
      amount: Number(amount),
      category,
      frequency,
      startDate,
      endDate: endDate || undefined,
      autopay,
      notes: notes || undefined,
    }

    addBill(newBill)
    setName(""); setAmount(""); setStartDate("")
    setEndDate(""); setNotes(""); setAutopay(false)
    setCategory("Electricity"); setFrequency("monthly")
    setShowForm(false)
  }

  const activeBills   = bills.filter((b) => !isFinished(b))
  const finishedBills = bills.filter((b) => isFinished(b))

  const totalMonthly = activeBills.reduce((sum, b) => {
    const multipliers: Record<BillFrequency, number> = {
      weekly: 4.33, biweekly: 2.17, monthly: 1, yearly: 1 / 12,
    }
    return sum + b.amount * multipliers[b.frequency]
  }, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Bills</h1>
            <p className="text-muted-foreground mt-1">
              Track your recurring bills and payments.
            </p>
          </div>
          <button
            onClick={() => setShowForm((p) => !p)}
            className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add Bill"}
          </button>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Active Bills</p>
            <h2 className="text-3xl font-bold mt-2">{activeBills.length}</h2>
          </div>
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Est. Monthly Cost</p>
            <h2 className="text-3xl font-bold mt-2 text-red-400">
              ${totalMonthly.toFixed(2)}
            </h2>
          </div>
          <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">Autopay Active</p>
            <h2 className="text-3xl font-bold mt-2 text-primary">
              {activeBills.filter((b) => b.autopay).length}
            </h2>
          </div>
        </motion.div>

        {/* Add bill form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="rounded-xl border p-6 space-y-4 overflow-hidden"
            >
              <h2 className="text-lg font-bold">New Bill</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Bill Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Netflix, Electricity..."
                    className="w-full border rounded-md p-2 mt-1 bg-background text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Amount ($)</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="29.99"
                    className="w-full border rounded-md p-2 mt-1 bg-background text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as BillCategory)}
                    className="w-full border rounded-md p-2 mt-1 bg-background text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {BILL_CATEGORY_EMOJI[c]} {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as BillFrequency)}
                    className="w-full border rounded-md p-2 mt-1 bg-background text-sm"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded-md p-2 mt-1 bg-background text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    End Date <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded-md p-2 mt-1 bg-background text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Notes <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any extra details..."
                  className="w-full border rounded-md p-2 mt-1 bg-background text-sm"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  checked={autopay}
                  onChange={(e) => setAutopay(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">Autopay enabled</span>
              </label>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90 transition"
              >
                Add Bill
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Active bills list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border p-6 space-y-3"
        >
          <h2 className="text-lg font-bold">Active Bills</h2>

          {activeBills.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No active bills. Add one above.
            </p>
          )}

          <AnimatePresence>
            {activeBills.map((bill) => {
              const daysUntil = getDaysUntilDue(bill)
              const isUrgent  = daysUntil <= 3
              const isWarning = daysUntil <= 7 && !isUrgent

              return (
                <motion.div
                  key={bill.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{BILL_CATEGORY_EMOJI[bill.category]}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{bill.name}</p>
                        {bill.autopay && (
                          <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                            Autopay
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {bill.category} · {bill.frequency} · ${bill.amount.toFixed(2)}
                      </p>
                      {bill.notes && (
                        <p className="text-xs text-muted-foreground italic mt-0.5">
                          {bill.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      isUrgent
                        ? "bg-red-500/20 text-red-400"
                        : isWarning
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-primary/20 text-primary"
                    }`}>
                      {daysUntil === 0 ? "Due today!" : `${daysUntil}d left`}
                    </span>
                    <button
                      onClick={() => markPaid(bill.id)}
                      className="text-muted-foreground hover:text-green-500 transition"
                      title="Mark as paid"
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => deleteBill(bill.id)}
                      className="text-muted-foreground hover:text-red-500 transition"
                      title="Delete bill"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Finished bills */}
        {finishedBills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-xl border p-6 space-y-3 opacity-60"
          >
            <h2 className="text-lg font-bold">Finished Bills</h2>
            {finishedBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl grayscale">{BILL_CATEGORY_EMOJI[bill.category]}</span>
                  <div>
                    <p className="font-medium text-sm line-through">{bill.name}</p>
                    <p className="text-xs text-muted-foreground">{bill.category} · ${bill.amount.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteBill(bill.id)}
                  className="text-muted-foreground hover:text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </DashboardLayout>
  )
}