"use client"

import {
  ChevronLeft,
  Camera,
  Check,
  Loader2,
  X,
  ImageIcon,
} from "lucide-react"
import { CATEGORIES, type Category } from "@/lib/data"
import { useState, useRef } from "react"
import Image from "next/image"

interface AddClothingScreenProps {
  onBack: () => void
  onSave: (formData: FormData) => Promise<void>
}

export function AddClothingScreen({ onBack, onSave }: AddClothingScreenProps) {
  const [name, setName] = useState("")
  const [boughtFrom, setBoughtFrom] = useState("")
  const [price, setPrice] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [category, setCategory] = useState<Category>("top")
  const [notes, setNotes] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10MB")
      return
    }

    setError(null)
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!name.trim() || saving) return
    setSaving(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", name.trim())
      formData.append("category", category)
      formData.append("boughtFrom", boughtFrom.trim() || "Unknown")
      formData.append("price", String(parseFloat(price) || 0))
      formData.append(
        "purchaseDate",
        purchaseDate || new Date().toISOString().split("T")[0]
      )
      formData.append("notes", notes.trim())
      if (imageFile) {
        formData.append("image", imageFile)
      }

      await onSave(formData)
      setSaved(true)
      setTimeout(() => {
        onBack()
      }, 800)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save. Please try again."
      )
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">Item added!</p>
        <p className="text-sm text-muted-foreground mt-1">
          Redirecting to your wardrobe...
        </p>
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
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
          Add Clothing
        </h1>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-5 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <X className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Form wrapper */}
      <div className="lg:max-w-2xl lg:flex lg:gap-8">
        {/* Image Picker */}
        <div className="relative w-full lg:w-72 lg:flex-shrink-0 mb-6 lg:mb-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          {imagePreview ? (
            <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-secondary">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 lg:hover:bg-card transition-all"
                aria-label="Remove image"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="w-full aspect-[4/3] lg:aspect-square rounded-2xl bg-card border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer active:bg-secondary lg:hover:bg-secondary/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                <Camera className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Add Photo
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tap to choose or take a photo
                </p>
              </div>
            </label>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex-1 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider"
            >
              Item Name *
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
            <label
              htmlFor="store"
              className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider"
            >
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
              <label
                htmlFor="price"
                className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider"
              >
                Price
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="date"
                className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider"
              >
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

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any notes about this item..."
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Image indicator */}
          {imageFile && (
            <div className="flex items-center gap-2 bg-primary/5 rounded-xl px-4 py-3 border border-primary/10">
              <ImageIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-xs text-foreground truncate flex-1">
                {imageFile.name}
              </p>
              <p className="text-[10px] text-muted-foreground flex-shrink-0">
                {(imageFile.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="w-full mt-3 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/30 active:scale-[0.98] lg:hover:shadow-xl lg:hover:shadow-primary/40 transition-all disabled:opacity-40 disabled:shadow-none disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save Item"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
