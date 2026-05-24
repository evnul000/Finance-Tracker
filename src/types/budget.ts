import { Category } from "./transaction"

export type Budget = {
  id: string
  category: Category
  limit: number        // the monthly spending limit they set
  month: string        // format: "2026-05" — year and month only
}