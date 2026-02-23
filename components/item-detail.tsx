"use client"

import { ClothingImage } from "@/components/clothing-image"
import {
  ChevronLeft,
  Plus,
  Minus,
  Pencil,
  Trash2,
  Store,
  DollarSign,
  Calendar,
  Droplets,
  Save,
  X,
  Camera,
  StickyNote,
  Check,
  Loader2,
} from "lucide-react"
import type { ClothingItem, Category } from "@/lib/data"
import { CATEGORIES } from "@/lib/data"
import { format } from "date-fns"
import { useState, useRef } from "react"
import Image from "next/image"

interface ItemDetailProps {
  item: ClothingItem
  onBack: () => void
  onWearCountChange: (id: string, count: number) => void
  onWashCountChange: (id: string, count: number) => void
  onUpdateItem: (id: string, updates: Partial<ClothingItem> | FormData) => Promise<ClothingItem>
  onDelete: (id: string) => void
}

export function ItemDetail({
  item,
  onBack,
  onWearCountChange,
  onWashCountChange,
  onUpdateItem,
  onDelete,
}: ItemDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Editable fields
  const [editName, setEditName] = useState(item.name)
  const [editBoughtFrom, setEditBoughtFrom] = useState(item.boughtFrom)
  const [editPrice, setEditPrice] = useState(String(item.price))
  const [editPurchaseDate, setEditPurchaseDate] = useState(item.purchaseDate)
  const [editCategory, setEditCategory] = useState<Category>(item.category)
  const [editNotes, setEditNotes] = useState(item.notes || "")
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const category = CATEGORIES.find((c) => c.id === item.category)

  const startEditing = () => {
    setEditName(item.name)
    setEditBoughtFrom(item.boughtFrom)
    setEditPrice(String(item.price))
    setEditPurchaseDate(item.purchaseDate)
    setEditCategory(item.category)
    setEditNotes(item.notes || "")
    setEditImageFile(null)
    setEditImagePreview(null)
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setEditImageFile(null)
    setEditImagePreview(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setEditImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setEditImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!editName.trim() || saving) return
    setSaving(true)
    try {
      if (editImageFile) {
        // Use FormData when there's a new image
        const formData = new FormData()
        formData.append("name", editName.trim())
        formData.append("boughtFrom", editBoughtFrom.trim() || "Unknown")
        formData.append("price", String(parseFloat(editPrice) || 0))
        formData.append("purchaseDate", editPurchaseDate)
        formData.append("category", editCategory)
        formData.append("notes", editNotes.trim())
        formData.append("image", editImageFile)
        await onUpdateItem(item.id, formData)
      } else {
        // Use JSON for text-only updates
        await onUpdateItem(item.id, {
          name: editName.trim(),
          boughtFrom: editBoughtFrom.trim() || "Unknown",
          price: parseFloat(editPrice) || 0,
          purchaseDate: editPurchaseDate,
          category: editCategory,
          notes: editNotes.trim(),
        })
      }
      setEditing(false)
      setEditImageFile(null)
      setEditImagePreview(null)
    } catch {
      // stay in edit mode on error
    } finally {
      setSaving(false)
    }
  }

  const displayImage = editImagePreview || item.image

  return (
    <div className="pb-28 lg:pb-10">
      {/* Hidden file input for edit mode */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Desktop: Back button row */}
      <div className="hidden lg:flex items-center gap-3 px-10 pt-10 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm border border-border hover:bg-secondary transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-sm font-medium text-muted-foreground">
          Back to wardrobe
        </h2>
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="lg:flex lg:gap-8 lg:px-10 lg:pb-10">
        {/* Image Section */}
        <div className="relative h-80 lg:h-auto lg:w-[45%] lg:rounded-2xl lg:overflow-hidden lg:sticky lg:top-10 lg:self-start bg-secondary lg:aspect-[3/4] flex-shrink-0">
          {editImagePreview ? (
            <Image
              src={editImagePreview}
              alt="New preview"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <ClothingImage
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          )}
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
            {editing ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                aria-label="Change photo"
              >
                <Camera className="w-4 h-4 text-primary-foreground" />
              </button>
            ) : (
              <>
                <button
                  onClick={startEditing}
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
              </>
            )}
          </div>

          {/* Edit mode: Change photo overlay on desktop */}
          {editing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="hidden lg:flex absolute inset-0 items-center justify-center bg-foreground/30 transition-opacity hover:bg-foreground/40"
              aria-label="Change photo"
            >
              <div className="flex flex-col items-center gap-2">
                <Camera className="w-8 h-8 text-card" />
                <span className="text-sm font-medium text-card">
                  Change Photo
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-5 -mt-8 relative lg:mt-0 lg:px-0 lg:flex-1 lg:min-w-0">
          {/* Main Card */}
          <div className="bg-card rounded-2xl p-5 lg:p-7 shadow-lg lg:shadow-sm border border-border mb-5">
            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                {editing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xl lg:text-2xl font-bold text-foreground bg-secondary rounded-xl px-3 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setEditCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            editCategory === cat.id
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-secondary text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight text-balance">
                      {item.name}
                    </h1>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-0.5">
                      {category?.label}
                    </p>
                  </>
                )}
              </div>
              {/* Desktop: Actions */}
              <div className="hidden lg:flex items-center gap-2 ml-4 flex-shrink-0">
                {editing ? (
                  <>
                    <button
                      onClick={cancelEditing}
                      className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                      aria-label="Cancel editing"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!editName.trim() || saving}
                      className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40"
                      aria-label="Save changes"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startEditing}
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
                  </>
                )}
              </div>
            </div>

            {/* Wear + Wash Counters - side by side */}
            <div className="grid grid-cols-2 gap-4 py-4 lg:py-6">
              {/* Wear Counter */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 lg:gap-4">
                  <button
                    onClick={() =>
                      onWearCountChange(
                        item.id,
                        Math.max(0, item.wearCount - 1)
                      )
                    }
                    disabled={editing}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-secondary flex items-center justify-center active:scale-90 lg:hover:bg-accent transition-all disabled:opacity-40"
                    aria-label="Decrease wear count"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <div className="text-center">
                    <p className="text-4xl lg:text-5xl font-bold text-primary font-mono tabular-nums">
                      {item.wearCount}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onWearCountChange(item.id, item.wearCount + 1)
                    }
                    disabled={editing}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/30 active:scale-90 lg:hover:shadow-lg lg:hover:shadow-primary/40 transition-all disabled:opacity-40"
                    aria-label="Increase wear count"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 font-medium uppercase tracking-wider">
                  times worn
                </p>
              </div>

              {/* Wash Counter */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 lg:gap-4">
                  <button
                    onClick={() =>
                      onWashCountChange(
                        item.id,
                        Math.max(0, (item.washCount ?? 0) - 1)
                      )
                    }
                    disabled={editing}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-secondary flex items-center justify-center active:scale-90 lg:hover:bg-accent transition-all disabled:opacity-40"
                    aria-label="Decrease wash count"
                  >
                    <Minus className="w-4 h-4 text-foreground" />
                  </button>
                  <div className="text-center">
                    <p className="text-4xl lg:text-5xl font-bold text-chart-3 font-mono tabular-nums">
                      {item.washCount ?? 0}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onWashCountChange(item.id, (item.washCount ?? 0) + 1)
                    }
                    disabled={editing}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-chart-3 text-card flex items-center justify-center shadow-md shadow-chart-3/30 active:scale-90 lg:hover:shadow-lg transition-all disabled:opacity-40"
                    aria-label="Increase wash count"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 font-medium uppercase tracking-wider">
                  times washed
                </p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-card rounded-2xl p-5 lg:p-7 shadow-sm border border-border space-y-4">
            <h2 className="text-sm lg:text-base font-semibold text-foreground">
              Details
            </h2>

            {/* Bought From */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Store className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Bought From
                </p>
                {editing ? (
                  <input
                    type="text"
                    value={editBoughtFrom}
                    onChange={(e) => setEditBoughtFrom(e.target.value)}
                    className="w-full text-sm font-medium text-foreground bg-secondary rounded-lg px-2 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mt-0.5"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {item.boughtFrom}
                  </p>
                )}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Price */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Price
                </p>
                {editing ? (
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full text-sm font-medium text-foreground bg-secondary rounded-lg px-2 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mt-0.5"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    ${item.price.toFixed(2)}
                  </p>
                )}
              </div>
              {!editing && (
                <div className="ml-auto text-right flex-shrink-0">
                  <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Cost per wear
                  </p>
                  <p className="text-sm font-bold text-primary">
                    $
                    {item.wearCount > 0
                      ? (item.price / item.wearCount).toFixed(2)
                      : item.price.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Wash ratio (read-only stat) */}
            {!editing && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Wear-to-wash ratio
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {(item.washCount ?? 0) > 0
                        ? `${(item.wearCount / (item.washCount ?? 1)).toFixed(1)} wears per wash`
                        : "Not washed yet"}
                    </p>
                  </div>
                  <div className="ml-auto text-right flex-shrink-0">
                    <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Cost per wash
                    </p>
                    <p className="text-sm font-bold text-chart-3">
                      $
                      {(item.washCount ?? 0) > 0
                        ? (item.price / (item.washCount ?? 1)).toFixed(2)
                        : item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-border" />
              </>
            )}

            {/* Purchase Date */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Purchase Date
                </p>
                {editing ? (
                  <input
                    type="date"
                    value={editPurchaseDate}
                    onChange={(e) => setEditPurchaseDate(e.target.value)}
                    className="w-full text-sm font-medium text-foreground bg-secondary rounded-lg px-2 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mt-0.5"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(item.purchaseDate), "MMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Notes */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <StickyNote className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Notes
                </p>
                {editing ? (
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={3}
                    placeholder="Add notes about this item..."
                    className="w-full text-sm font-medium text-foreground bg-secondary rounded-lg px-2 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary mt-0.5 resize-none"
                  />
                ) : (
                  <p className="text-sm text-foreground">
                    {item.notes || (
                      <span className="text-muted-foreground italic">
                        No notes
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile: Edit Save/Cancel Bar */}
          {editing && (
            <div className="flex gap-3 mt-5 lg:hidden">
              <button
                onClick={cancelEditing}
                className="flex-1 py-3.5 rounded-xl bg-secondary text-foreground font-semibold text-sm active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editName.trim() || saving}
                className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          )}
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
              This will permanently remove {`"${item.name}"`} from your
              wardrobe.
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
