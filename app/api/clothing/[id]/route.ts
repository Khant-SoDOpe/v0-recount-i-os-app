import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import type { ClothingItem } from "@/lib/data"

// GET /api/clothing/[id] - Fetch a single clothing item
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
    return NextResponse.json(item)
  } catch (error) {
    console.error("Failed to fetch clothing item:", error)
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
  }
}

// PATCH /api/clothing/[id] - Update a clothing item (e.g. wear count)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    const raw = await redis.get(`clothing:item:${id}`)

    if (!raw) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const existing: ClothingItem =
      typeof raw === "string" ? JSON.parse(raw) : raw
    const updated: ClothingItem = { ...existing, ...updates, id }

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

// DELETE /api/clothing/[id] - Delete a clothing item
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Remove from Redis
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
