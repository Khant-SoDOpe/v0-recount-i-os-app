import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { uploadImage } from "@/lib/cloudinary"
import type { ClothingItem } from "@/lib/data"

// GET /api/clothing/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const raw = await redis.get(`clothing:item:${id}`)

    if (!raw) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const item: ClothingItem = typeof raw === "string" ? JSON.parse(raw) : raw
    return NextResponse.json({
      ...item,
      washCount: item.washCount ?? 0,
      lastWornDate: item.lastWornDate ?? null,
      notes: item.notes ?? "",
    })
  } catch (error) {
    console.error("Failed to fetch clothing item:", error)
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    )
  }
}

// PATCH /api/clothing/[id] - Update a clothing item
// Supports both JSON body and multipart/form-data (for image re-upload)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const raw = await redis.get(`clothing:item:${id}`)

    if (!raw) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const existing: ClothingItem =
      typeof raw === "string" ? JSON.parse(raw) : raw

    const contentType = request.headers.get("content-type") || ""
    let updates: Partial<ClothingItem> = {}

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const imageFile = formData.get("image") as File | null

      // Extract text fields from formData
      const name = formData.get("name") as string | null
      const category = formData.get("category") as string | null
      const boughtFrom = formData.get("boughtFrom") as string | null
      const priceStr = formData.get("price") as string | null
      const purchaseDate = formData.get("purchaseDate") as string | null
      const wearCountStr = formData.get("wearCount") as string | null
      const washCountStr = formData.get("washCount") as string | null
      const notes = formData.get("notes") as string | null

      if (name !== null) updates.name = name.trim()
      if (category !== null)
        updates.category = category as ClothingItem["category"]
      if (boughtFrom !== null) updates.boughtFrom = boughtFrom.trim()
      if (priceStr !== null) updates.price = parseFloat(priceStr) || 0
      if (purchaseDate !== null) updates.purchaseDate = purchaseDate
      if (wearCountStr !== null) updates.wearCount = parseInt(wearCountStr) || 0
      if (washCountStr !== null) updates.washCount = parseInt(washCountStr) || 0
      if (notes !== null) updates.notes = notes.trim()

      // Upload new image if provided
      if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        updates.image = await uploadImage(buffer, "recount")
      }
    } else {
      updates = await request.json()
    }

    const updated: ClothingItem = {
      ...existing,
      washCount: existing.washCount ?? 0,
      lastWornDate: existing.lastWornDate ?? null,
      notes: existing.notes ?? "",
      ...updates,
      id, // ensure id is never overwritten
    }

    await redis.set(`clothing:item:${id}`, JSON.stringify(updated))

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update clothing item:", error)
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    )
  }
}

// DELETE /api/clothing/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await redis.del(`clothing:item:${id}`)
    await redis.zrem("clothing:ids", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete clothing item:", error)
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    )
  }
}
