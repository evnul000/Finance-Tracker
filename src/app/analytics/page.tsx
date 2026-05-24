import { DashboardLayout } from "@/components/layout/Dashboard"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Visualise your spending patterns.</p>
      </div>
    </DashboardLayout>
  )
}