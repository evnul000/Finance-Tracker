import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Wallet
} from "lucide-react"

const links = [
  {
    name: "Dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Transactions",
    icon: Receipt
  },
  {
    name: "Budgets",
    icon: Wallet
  },
  {
    name: "Analytics",
    icon: PieChart
  }
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 border-r bg-background p-4 flex-col gap-2">
      {links.map((link) => {
        const Icon = link.icon

        return (
          <button
            key={link.name}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted transition"
          >
            <Icon size={18} />
            <span>{link.name}</span>
          </button>
        )
      })}
    </aside>
  )
}