"use client"

import { Home, Grid3X3, Plus, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onAddClick: () => void
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "categories", label: "Wardrobe", icon: Grid3X3 },
  { id: "add", label: "Add", icon: Plus },
  { id: "profile", label: "Profile", icon: User },
]

export function BottomNav({ activeTab, onTabChange, onAddClick }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card/80 backdrop-blur-xl border-t border-border lg:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2 pb-6 pt-2">
        {navItems.map((item) => {
          if (item.id === "add") {
            return (
              <button
                key={item.id}
                onClick={onAddClick}
                className="flex items-center justify-center w-12 h-12 -mt-6 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                aria-label="Add new clothing"
              >
                <Plus className="w-6 h-6" />
              </button>
            )
          }
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
