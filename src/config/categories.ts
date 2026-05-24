import { Category } from "../types/transaction"

export type CategoryConfig = {
  label: string
  color: string
  emoji: string
}

export const CATEGORIES: Record<Category, CategoryConfig> = {
  Food:     { label: "Food",     color: "#f97316", emoji: "🍔" },
  Rent:     { label: "Rent",     color: "#6366f1", emoji: "🏠" },
  Gaming:   { label: "Gaming",   color: "#8b5cf6", emoji: "🎮" },
  Shopping: { label: "Shopping", color: "#ec4899", emoji: "🛍️" },
  Bills:    { label: "Bills",    color: "#14b8a6", emoji: "📄" },
  Other:    { label: "Other",    color: "#94a3b8", emoji: "📦" },
}