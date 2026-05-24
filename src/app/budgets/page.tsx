import { DashboardLayout } from "@/components/layout/Dashboard"

export default function BudgetsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold">Budgets</h1>
        <p className="text-muted-foreground mt-1">Manage your monthly budget goals.</p>
      </div>
    </DashboardLayout>
  )
}