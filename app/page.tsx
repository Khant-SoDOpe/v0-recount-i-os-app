"use client"

import { useState, useCallback, useEffect } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { SidebarNav } from "@/components/sidebar-nav"
import { HomeScreen } from "@/components/home-screen"
import { CategoriesScreen } from "@/components/categories-screen"
import { ItemDetail } from "@/components/item-detail"
import { AddClothingScreen } from "@/components/add-clothing-screen"
import { useClothing } from "@/hooks/use-clothing"
import type { ClothingItem } from "@/lib/data"
import { Loader2 } from "lucide-react"

type Screen = "home" | "categories" | "detail" | "add" | "profile"

export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)
  const [previousScreen, setPreviousScreen] = useState<Screen>("home")

  const {
    items,
    isLoading,
    isSeeded,
    seed,
    addItem,
    updateWearCount,
    deleteItem,
  } = useClothing()

  // Auto-seed on first load if database is empty
  useEffect(() => {
    if (!isLoading && !isSeeded) {
      seed()
    }
  }, [isLoading, isSeeded, seed])

  const handleItemClick = useCallback(
    (item: ClothingItem) => {
      setSelectedItem(item)
      setPreviousScreen(screen === "detail" ? previousScreen : screen)
      setScreen("detail")
    },
    [screen, previousScreen]
  )

  const handleWearCountChange = useCallback(
    async (id: string, count: number) => {
      await updateWearCount(id, count)
      setSelectedItem((prev) =>
        prev && prev.id === id ? { ...prev, wearCount: count } : prev
      )
    },
    [updateWearCount]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteItem(id)
      setScreen(previousScreen)
      setSelectedItem(null)
    },
    [deleteItem, previousScreen]
  )

  const handleAddItem = useCallback(
    async (formData: FormData) => {
      await addItem(formData)
    },
    [addItem]
  )

  const handleTabChange = useCallback((tab: string) => {
    setScreen(tab as Screen)
    setSelectedItem(null)
  }, [])

  const handleAddClick = useCallback(() => {
    setPreviousScreen(screen === "detail" ? previousScreen : screen)
    setScreen("add")
  }, [screen, previousScreen])

  const handleBack = useCallback(() => {
    setScreen(previousScreen)
    setSelectedItem(null)
  }, [previousScreen])

  // Keep selectedItem in sync with items from SWR
  useEffect(() => {
    if (selectedItem) {
      const updated = items.find((i) => i.id === selectedItem.id)
      if (updated && updated.wearCount !== selectedItem.wearCount) {
        setSelectedItem(updated)
      }
    }
  }, [items, selectedItem])

  const showBottomNav = screen !== "detail" && screen !== "add"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading your wardrobe...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      {showBottomNav && (
        <SidebarNav
          activeTab={screen}
          onTabChange={handleTabChange}
          onAddClick={handleAddClick}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 min-h-screen">
        <main className="mx-auto max-w-5xl min-h-screen">
          {screen === "home" && (
            <HomeScreen items={items} onItemClick={handleItemClick} />
          )}
          {screen === "categories" && (
            <CategoriesScreen items={items} onItemClick={handleItemClick} />
          )}
          {screen === "detail" && selectedItem && (
            <ItemDetail
              item={selectedItem}
              onBack={handleBack}
              onWearCountChange={handleWearCountChange}
              onDelete={handleDelete}
            />
          )}
          {screen === "add" && (
            <AddClothingScreen onBack={handleBack} onSave={handleAddItem} />
          )}
          {screen === "profile" && <ProfileScreen items={items} />}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      {showBottomNav && (
        <BottomNav
          activeTab={screen}
          onTabChange={handleTabChange}
          onAddClick={handleAddClick}
        />
      )}
    </div>
  )
}

function ProfileScreen({ items }: { items: ClothingItem[] }) {
  const totalWears = items.reduce((a, b) => a + b.wearCount, 0)
  const totalValue = items.reduce((a, b) => a + b.price, 0)
  const avgCostPerWear = totalWears > 0 ? totalValue / totalWears : 0

  return (
    <div className="px-5 pt-14 pb-28 lg:px-10 lg:pt-10 lg:pb-10">
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-1">
        Profile
      </h1>
      <p className="text-sm text-muted-foreground mb-7">Your wardrobe stats</p>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-7 lg:mb-10">
        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="text-2xl lg:text-3xl font-bold text-primary">R</span>
        </div>
        <h2 className="text-lg lg:text-xl font-bold text-foreground">
          Recount User
        </h2>
        <p className="text-xs text-muted-foreground">Tracking since 2025</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-5 lg:mb-8">
        <div className="bg-card rounded-2xl p-4 lg:p-6 shadow-sm border border-border text-center">
          <p className="text-2xl lg:text-3xl font-bold text-primary font-mono">
            {items.length}
          </p>
          <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
            Items
          </p>
        </div>
        <div className="bg-card rounded-2xl p-4 lg:p-6 shadow-sm border border-border text-center">
          <p className="text-2xl lg:text-3xl font-bold text-primary font-mono">
            {totalWears}
          </p>
          <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
            Total Wears
          </p>
        </div>
        <div className="bg-card rounded-2xl p-4 lg:p-6 shadow-sm border border-border text-center">
          <p className="text-2xl lg:text-3xl font-bold text-foreground font-mono">
            ${totalValue.toFixed(0)}
          </p>
          <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
            Wardrobe Value
          </p>
        </div>
        <div className="bg-card rounded-2xl p-4 lg:p-6 shadow-sm border border-border text-center">
          <p className="text-2xl lg:text-3xl font-bold text-foreground font-mono">
            ${avgCostPerWear.toFixed(2)}
          </p>
          <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
            Avg Cost/Wear
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl p-4 lg:p-6 shadow-sm border border-border space-y-3 max-w-xl">
        <h3 className="text-sm lg:text-base font-semibold text-foreground">
          Quick Actions
        </h3>
        {[
          { label: "Export Data", desc: "Download your wardrobe as CSV" },
          { label: "Notifications", desc: "Wear reminders and tracking" },
          { label: "About Recount", desc: "Version 1.0.0" },
        ].map((action) => (
          <button
            key={action.label}
            className="w-full flex items-center justify-between py-2.5 lg:py-3 text-left hover:bg-secondary/50 rounded-lg px-2 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {action.label}
              </p>
              <p className="text-[10px] lg:text-xs text-muted-foreground">
                {action.desc}
              </p>
            </div>
            <svg
              className="w-4 h-4 text-muted-foreground flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
