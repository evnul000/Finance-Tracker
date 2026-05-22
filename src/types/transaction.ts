export type Category = "Food" | "Rent" | "Gaming" | "Shopping" | "Bills" | "Other"

export type Transaction = {
  id: string
  title: string
  amount: number
  category: Category
  date: string
  type: "expense" | "income"
}