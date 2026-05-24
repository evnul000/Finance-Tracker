export type BillFrequency = "weekly" | "biweekly" | "monthly" | "yearly"

export type BillCategory =
  | "Electricity"
  | "Water"
  | "Internet"
  | "Phone"
  | "Rent"
  | "Insurance"
  | "Streaming"
  | "Gym"
  | "Other"

export type Bill = {
  id: string
  name: string
  amount: number
  category: BillCategory
  frequency: BillFrequency
  startDate: string
  endDate?: string          // optional — when the bill finishes
  lastPaid?: string         // optional — last payment date
  autopay: boolean
  notes?: string
}