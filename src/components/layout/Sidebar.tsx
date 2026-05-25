"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LayoutDashboard, Receipt, PieChart,
  Wallet, FileText, Settings, Menu, X
} from "lucide-react"


const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions",  icon: Receipt },
  { name: "Budgets",      href: "/budgets",       icon: Wallet },
  { name: "Analytics",    href: "/analytics",     icon: PieChart },
  { name: "Bills",        href: "/bills",         icon: FileText },
  { name: "Settings",     href: "/settings",      icon: Settings },
]

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  const router   = useRouter()
  const pathname = usePathname()

  function handleClick(href: string) {
    router.push(href)
    onNavigate?.()
  }

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const Icon     = link.icon
        const isActive = pathname === link.href

        return (
          <button
            key={link.name}
            onClick={() => handleClick(link.href)}
            className={`
              flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium w-full text-left transition-all
              ${isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            <Icon size={18} />
            <span>{link.name}</span>
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />
            )}
          </button>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full p-4 shadow-lg shadow-primary/40"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`
        md:hidden fixed top-0 left-0 z-50 h-full w-64
        bg-background border-r p-4 space-y-4
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-lg">💰 Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarLinks onNavigate={() => setOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 border-r bg-background p-4 flex-col gap-2">
        <SidebarLinks />
      </aside>
    </>
  )
}