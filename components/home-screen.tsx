"use client"

import Image from "next/image"
import { TrendingUp, Shirt } from "lucide-react"
import type { ClothingItem } from "@/lib/data"

interface HomeScreenProps {
  items: ClothingItem[]
  onItemClick: (item: ClothingItem) => void
}

export function HomeScreen({ items, onItemClick }: HomeScreenProps) {
  const totalWearsThisWeek = items.reduce((acc, item) => acc + Math.min(item.wearCount, 3), 0)
  const mostWorn = [...items].sort((a, b) => b.wearCount - a.wearCount).slice(0, 4)
  const recentlyWorn = items.slice(0, 5)

  return (
    <div className="px-5 pt-14 pb-28 space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
            Recount
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your wardrobe at a glance
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Shirt className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              This Week
            </p>
            <p className="text-2xl font-bold text-foreground">
              {totalWearsThisWeek} wears
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{items.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Total Items</p>
          </div>
          <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">{mostWorn[0]?.wearCount ?? 0}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Most Worn</p>
          </div>
          <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-foreground">
              {items.reduce((a, b) => a + b.wearCount, 0)}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">All Time</p>
          </div>
        </div>
      </div>

      {/* Recently Worn */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Recently Worn</h2>
          <span className="text-xs text-muted-foreground">{recentlyWorn.length} items</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {recentlyWorn.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              className="flex-shrink-0 w-28 group"
            >
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-secondary mb-2 shadow-sm">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-active:scale-105 transition-transform"
                />
                <div className="absolute bottom-1.5 right-1.5 bg-card/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <span className="text-[10px] font-bold text-foreground">
                    {item.wearCount}x
                  </span>
                </div>
              </div>
              <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
              <p className="text-[10px] text-muted-foreground">{item.boughtFrom}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Most Worn */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">Most Worn</h2>
        <div className="space-y-2.5">
          {mostWorn.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              className="w-full flex items-center gap-3 bg-card rounded-2xl p-3 shadow-sm border border-border active:scale-[0.98] transition-transform"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.boughtFrom}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-xs text-muted-foreground">#{index + 1}</span>
                <div className="bg-primary/10 rounded-full px-2.5 py-1">
                  <span className="text-xs font-bold text-primary">{item.wearCount}x</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
