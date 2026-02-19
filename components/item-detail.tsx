"use client"

import Image from "next/image"
import { ChevronLeft, Plus, Minus, Pencil, Trash2, Store, DollarSign, Calendar } from "lucide-react"
import type { ClothingItem } from "@/lib/data"
import { CATEGORIES } from "@/lib/data"
import { format } from "date-fns"
import { useState } from "react"

interface ItemDetailProps {
  item: ClothingItem
  onBack: () => void
  onWearCountChange: (id: string, count: number) => void
  onDelete: (id: string) => void
}

export function ItemDetail({ item, onBack, onWearCountChange, onDelete }: ItemDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const category = CATEGORIES.find((c) => c.id === item.category)

  return (
    <div className="pb-28 lg:pb-10">
      {/* Desktop: Back button row */}
      <div className="hidden lg:flex items-center gap-3 px-10 pt-10 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm border border-border hover:bg-secondary transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-sm font-medium text-muted-foreground">Back to wardrobe</h2>
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="lg:flex lg:gap-8 lg:px-10 lg:pb-10">
        {/* Image Section */}
        <div className="relative h-80 lg:h-auto lg:w-[45%] lg:rounded-2xl lg:overflow-hidden lg:sticky lg:top-10 lg:self-start bg-secondary lg:aspect-[3/4] flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent lg:hidden" />

          {/* Mobile: Back button */}
          <button
            onClick={onBack}
            className="absolute top-12 left-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform lg:hidden"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Mobile: Actions */}
          <div className="absolute top-12 right-4 flex gap-2 lg:hidden">
            <button
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              aria-label="Edit item"
            >
              <Pencil className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              aria-label="Delete item"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 -mt-8 relative lg:mt-0 lg:px-0 lg:flex-1 lg:min-w-0">
          {/* Wear Count Card */}
          <div className="bg-card rounded-2xl p-5 lg:p-7 shadow-lg lg:shadow-sm border border-border mb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight text-balance">
                  {item.name}
                </h1>
                <p className="text-xs lg:text-sm text-muted-foreground mt-0.5">
                  {category?.label}
                </p>
              </div>
              {/* Desktop: Actions */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                  aria-label="Edit item"
                >
                  <Pencil className="w-4 h-4 text-foreground" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive/10 transition-colors"
                  aria-label="Delete item"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>

            {/* Wear Counter */}
            <div className="flex items-center justify-center gap-6 lg:gap-8 py-4 lg:py-6">
              <button
                onClick={() => onWearCountChange(item.id, Math.max(0, item.wearCount - 1))}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-secondary flex items-center justify-center active:scale-90 lg:hover:bg-accent transition-all"
                aria-label="Decrease wear count"
              >
                <Minus className="w-5 h-5 text-foreground" />
              </button>
              <div className="text-center">
                <p className="text-5xl lg:text-6xl font-bold text-primary font-mono tabular-nums">
                  {item.wearCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                  times worn
                </p>
              </div>
              <button
                onClick={() => onWearCountChange(item.id, item.wearCount + 1)}
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/30 active:scale-90 lg:hover:shadow-lg lg:hover:shadow-primary/40 transition-all"
                aria-label="Increase wear count"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-card rounded-2xl p-5 lg:p-7 shadow-sm border border-border space-y-4">
            <h2 className="text-sm lg:text-base font-semibold text-foreground">Details</h2>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Store className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Bought From
                </p>
                <p className="text-sm font-medium text-foreground">{item.boughtFrom}</p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Price
                </p>
                <p className="text-sm font-medium text-foreground">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="ml-auto">
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Cost per wear
                </p>
                <p className="text-sm font-bold text-primary">
                  ${item.wearCount > 0 ? (item.price / item.wearCount).toFixed(2) : item.price.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Purchase Date
                </p>
                <p className="text-sm font-medium text-foreground">
                  {format(new Date(item.purchaseDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
            role="presentation"
          />
          <div className="relative w-full max-w-[430px] lg:max-w-md bg-card rounded-t-3xl lg:rounded-2xl p-5 pb-10 lg:pb-5 shadow-xl">
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5 lg:hidden" />
            <h3 className="text-lg font-bold text-foreground text-center mb-2">
              Delete this item?
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              This will permanently remove {`"${item.name}"`} from your wardrobe.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3.5 rounded-xl bg-secondary text-foreground font-semibold text-sm active:scale-[0.98] lg:hover:bg-accent transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(item.id)
                  setShowDeleteConfirm(false)
                }}
                className="flex-1 py-3.5 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
