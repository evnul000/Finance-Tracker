import { ReactNode } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"

type Props = {
  children: ReactNode
}

export function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}