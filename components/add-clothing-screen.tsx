"use client"

import { ChevronLeft, Camera, Check } from "lucide-react"
import { CATEGORIES, type Category, type ClothingItem } from "@/lib/data"
import { useState } from "react"

interface AddClothingScreenProps {
  onBack: () => void
  onSave: (item: Omit<ClothingItem, "id" | "wearCount">) => void
}

export function AddClothingScreen({ onBack, onSave }: AddClothingScreenProps) {
  const [name, setName] = useState("")
  const [boughtFrom, setBoughtFrom] = useState("")
  const [price, setPrice] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [category, setCategory] = useState<Category>("top")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      category,
      image: "/images/white-tshirt.jpg",
      boughtFrom: boughtFrom.trim() || "Unknown",
      price: parseFloat(price) || 0,
      purchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
    })
    setSaved(true)
    setTimeout(() => {
      onBack()
    }, 800)
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">Item added!</p>
        <p className="text-sm text-muted-foreground mt-1">Redirecting to your wardrobe...</p>
      </div>
    )
  }

  return (
    <div className="px-5 pt-14 pb-28 lg:px-10 lg:pt-10 lg:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm border border-border active:scale-95 lg:hover:bg-secondary transition-all"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">Add Clothing</h1>
      </div>

      {/* Form wrapper - constrained on desktop */}
      <div className="lg:max-w-2xl lg:flex lg:gap-8">
        {/* Image Picker */}
        <button className="w-full lg:w-72 lg:flex-shrink-0 aspect-[4/3] lg:aspect-square rounded-2xl bg-card border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 mb-6 lg:mb-0 active:bg-secondary lg:hover:bg-secondary/50 transition-colors">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
            <Camera className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Add Photo</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tap to choose an image</p>
          </div>
        </button>

        {/* Form Fields */}
        <div className="flex-1 space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
              Item Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Classic White Tee"
              className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label htmlFor="store" className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
              Bought From
            </label>
            <input
              id="store"
              type="text"
              value={boughtFrom}
              onChange={(e) => setBoughtFrom(e.target.value)}
              placeholder="e.g. Uniqlo"
              className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="price" className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                Price
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="date" className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                Purchase Date
              </label>
              <input
                id="date"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`py-3 rounded-xl text-xs font-semibold text-center transition-all active:scale-95 ${
                    category === cat.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card border border-border text-foreground lg:hover:bg-secondary"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full mt-3 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/30 active:scale-[0.98] lg:hover:shadow-xl lg:hover:shadow-primary/40 transition-all disabled:opacity-40 disabled:shadow-none disabled:active:scale-100"
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  )
}
