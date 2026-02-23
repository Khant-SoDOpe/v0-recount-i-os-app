"use client"

import { ClothingImage } from "@/components/clothing-image"
import { ChevronRight, Shirt, Wind, Footprints, Layers, Droplets } from "lucide-react"
import type { ClothingItem, Category } from "@/lib/data"
import { CATEGORIES } from "@/lib/data"
import { useState } from "react"

interface CategoriesScreenProps {
  items: ClothingItem[]
  onItemClick: (item: ClothingItem) => void
}

const categoryIcons: Record<Category, React.ReactNode> = {
  top: <Shirt className="w-6 h-6" />,
  upper: <Wind className="w-6 h-6" />,
  lower: <Footprints className="w-6 h-6" />,
  underwear: <Layers className="w-6 h-6" />,
}

const categoryColors: Record<Category, string> = {
  top: "bg-primary/10 text-primary",
  upper: "bg-chart-5/20 text-chart-5",
  lower: "bg-chart-3/20 text-chart-3",
  underwear: "bg-chart-4/20 text-chart-4",
}

export function CategoriesScreen({
  items,
  onItemClick,
}: CategoriesScreenProps) {
  const [openCategory, setOpenCategory] = useState<Category | null>(null)

  const getCategoryItems = (category: Category) =>
    items.filter((item) => item.category === category)

  if (openCategory) {
    const categoryItems = getCategoryItems(openCategory)
    const catInfo = CATEGORIES.find((c) => c.id === openCategory)

    return (
      <div className="px-5 pt-14 pb-28 lg:px-10 lg:pt-10 lg:pb-10">
        <button
          onClick={() => setOpenCategory(null)}
          className="flex items-center gap-1 text-sm text-primary font-medium mb-5"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to categories
        </button>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 tracking-tight">
          {catInfo?.label}
        </h1>
        <p className="text-sm text-muted-foreground mb-5 lg:mb-7">
          {categoryItems.length}{" "}
          {categoryItems.length === 1 ? "item" : "items"}
        </p>
        {categoryItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${categoryColors[openCategory]}`}
            >
              {categoryIcons[openCategory]}
            </div>
            <p className="text-sm text-muted-foreground">
              No items yet in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {categoryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item)}
                className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border active:scale-[0.97] lg:hover:shadow-md transition-all text-left"
              >
                <div className="relative aspect-square">
                  <ClothingImage
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    <span className="bg-card/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-bold text-foreground">
                      {item.wearCount}x
                    </span>
                    {(item.washCount ?? 0) > 0 && (
                      <span className="bg-chart-3/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-bold text-chart-3 flex items-center gap-0.5">
                        <Droplets className="w-2.5 h-2.5" />
                        {item.washCount}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] lg:text-xs text-muted-foreground">
                    ${item.price.toFixed(0)} - {item.boughtFrom}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="px-5 pt-14 pb-28 lg:px-10 lg:pt-10 lg:pb-10">
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-1">
        Wardrobe
      </h1>
      <p className="text-sm lg:text-base text-muted-foreground mb-6 lg:mb-8">
        Browse your clothing by category
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {CATEGORIES.map((category) => {
          const count = getCategoryItems(category.id).length
          const categoryValue = getCategoryItems(category.id).reduce(
            (a, b) => a + b.price,
            0
          )
          const previewItems = getCategoryItems(category.id).slice(0, 2)

          return (
            <button
              key={category.id}
              onClick={() => setOpenCategory(category.id)}
              className="bg-card rounded-2xl p-4 lg:p-5 shadow-sm border border-border text-left active:scale-[0.97] lg:hover:shadow-md transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${categoryColors[category.id]}`}
              >
                {categoryIcons[category.id]}
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-foreground mb-0.5">
                {category.label}
              </h3>
              <p className="text-xs text-muted-foreground mb-1">
                {count} {count === 1 ? "item" : "items"}
              </p>
              {count > 0 && (
                <p className="text-xs font-medium text-primary mb-3">
                  ${categoryValue.toFixed(0)} total
                </p>
              )}
              {previewItems.length > 0 && (
                <div className="flex -space-x-2">
                  {previewItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-card"
                    >
                      <ClothingImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {count > 2 && (
                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center">
                      <span className="text-[9px] font-bold text-muted-foreground">
                        +{count - 2}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* All Items */}
      <div className="mt-7 lg:mt-10">
        <h2 className="text-base lg:text-lg font-semibold text-foreground mb-3 lg:mb-4">
          All Items
        </h2>
        <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              className="w-full flex items-center gap-3 bg-card rounded-2xl p-3 lg:p-4 shadow-sm border border-border active:scale-[0.98] lg:hover:shadow-md transition-all"
            >
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                <ClothingImage
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm lg:text-base font-semibold text-foreground truncate">
                  {item.name}
                </p>
                <p className="text-[10px] lg:text-xs text-muted-foreground">
                  ${item.price.toFixed(0)} -{" "}
                  {CATEGORIES.find((c) => c.id === item.category)?.label}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-primary/10 rounded-full px-2.5 py-1">
                    <span className="text-xs font-bold text-primary">
                      {item.wearCount}x
                    </span>
                  </div>
                  {(item.washCount ?? 0) > 0 && (
                    <div className="flex items-center gap-1 text-chart-3">
                      <Droplets className="w-3 h-3" />
                      <span className="text-[10px] font-bold">
                        {item.washCount}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
