import { Bill, BillFrequency } from "@/types/bill"

export function getNextDueDate(bill: Bill): Date {
  const start = new Date(bill.startDate)
  const now = new Date()
  const next = new Date(start)

  const frequencyDays: Record<BillFrequency, number> = {
    weekly: 7,
    biweekly: 14,
    monthly: 30,
    yearly: 365,
  }

  const days = frequencyDays[bill.frequency]

  // Advance until we find the next due date after today
  while (next <= now) {
    next.setDate(next.getDate() + days)
  }

  return next
}

export function getDaysUntilDue(bill: Bill): number {
  const next = getNextDueDate(bill)
  const now = new Date()
  const diff = next.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function isOverdue(bill: Bill): boolean {
  return getDaysUntilDue(bill) < 0
}

export function getUpcomingBills(bills: Bill[], withinDays = 14) {
  return bills
    .map((bill) => ({ bill, daysUntil: getDaysUntilDue(bill) }))
    .filter(({ daysUntil }) => daysUntil <= withinDays)
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

export function isFinished(bill: Bill): boolean {
  if (!bill.endDate) return false
  return new Date(bill.endDate) < new Date()
}

export const BILL_CATEGORY_EMOJI: Record<string, string> = {
  Electricity: "⚡",
  Water: "💧",
  Internet: "🌐",
  Phone: "📱",
  Rent: "🏠",
  Insurance: "🛡️",
  Streaming: "🎬",
  Gym: "💪",
  Other: "📄",
}