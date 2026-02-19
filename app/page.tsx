"use client"

import { useState, useCallback } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { HomeScreen } from "@/components/home-screen"
import { CategoriesScreen } from "@/components/categories-screen"
import { ItemDetail } from "@/components/item-detail"
import { AddClothingScreen } from "@/components/add-clothing-screen"
import { SAMPLE_ITEMS, type ClothingItem } from "@/lib/data"

type Screen = "home" | "categories" | "detail" | "add" | "profile"

export default function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [items, setItems] = useState<ClothingItem[]>(SAMPLE_ITEMS)
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)
  const [previousScreen, setPreviousScreen] = useState<Screen>("home")

  const handleItemClick = useCallback(
    (item: ClothingItem) => {
      setSelectedItem(item)
      setPreviousScreen(screen === "detail" ? previousScreen : screen)
      setScreen("detail")
    },
    [screen, previousScreen]
  )

  const handleWearCountChange = useCallback(
    (id: string, count: number) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, wearCount: count } : item))
      )
      setSelectedItem((prev) => (prev && prev.id === id ? { ...prev, wearCount: count } : prev))
    },
    []
  )

  const handleDelete = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id))
      setScreen(previousScreen)
      setSelectedItem(null)
    },
    [previousScreen]
  )

  const handleAddItem = useCallback(
    (newItem: Omit<ClothingItem, "id" | "wearCount">) => {
      const item: ClothingItem = {
        ...newItem,
        id: String(Date.now()),
        wearCount: 0,
      }
      setItems((prev) => [item, ...prev])
    },
    []
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

  return (
    <div className="min-h-screen bg-background">
      {/* iPhone frame wrapper */}
      <div className="mx-auto max-w-[430px] min-h-screen relative overflow-hidden">
        {/* Screen Content */}
        <main className="min-h-screen">
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
          {screen === "profile" && (
            <ProfileScreen items={items} />
          )}
        </main>

        {/* Bottom Navigation */}
        {screen !== "detail" && screen !== "add" && (
          <BottomNav
            activeTab={screen}
            onTabChange={handleTabChange}
            onAddClick={handleAddClick}
          />
        )}
      </div>
    </div>
  )
}

function ProfileScreen({ items }: { items: ClothingItem[] }) {
  const totalWears = items.reduce((a, b) => a + b.wearCount, 0)
  const totalValue = items.reduce((a, b) => a + b.price, 0)
  const avgCostPerWear = totalWears > 0 ? totalValue / totalWears : 0

  return (
    <div className="px-5 pt-14 pb-28">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Profile</h1>
      <p className="text-sm text-muted-foreground mb-7">Your wardrobe stats</p>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-7">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="text-2xl font-bold text-primary">R</span>
        </div>
        <h2 className="text-lg font-bold text-foreground">Recount User</h2>
        <p className="text-xs text-muted-foreground">Tracking since 2025</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <p className="text-2xl font-bold text-primary font-mono">{items.length}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
            Items
          </p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <p className="text-2xl font-bold text-primary font-mono">{totalWears}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
            Total Wears
          </p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <p className="text-2xl font-bold text-foreground font-mono">${totalValue.toFixed(0)}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
            Wardrobe Value
          </p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <p className="text-2xl font-bold text-foreground font-mono">${avgCostPerWear.toFixed(2)}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
            Avg Cost/Wear
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        {[
          { label: "Export Data", desc: "Download your wardrobe as CSV" },
          { label: "Notifications", desc: "Wear reminders and tracking" },
          { label: "About Recount", desc: "Version 1.0.0" },
        ].map((action) => (
          <button
            key={action.label}
            className="w-full flex items-center justify-between py-2.5 text-left"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{action.label}</p>
              <p className="text-[10px] text-muted-foreground">{action.desc}</p>
            </div>
            <svg
              className="w-4 h-4 text-muted-foreground flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
