"use client"

import { Home, Grid3X3, Plus, User, Shirt } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onAddClick: () => void
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "categories", label: "Wardrobe", icon: Grid3X3 },
  { id: "profile", label: "Profile", icon: User },
]

export function SidebarNav({ activeTab, onTabChange, onAddClick }: SidebarNavProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shirt className="w-5 h-5 text-primary" />
        </div>
        <span className="text-lg font-bold text-foreground tracking-tight">Recount</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4" role="navigation" aria-label="Main navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Add Button */}
      <div className="px-4 pb-6">
        <button
          onClick={onAddClick}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Clothing
        </button>
      </div>
    </aside>
  )
}
