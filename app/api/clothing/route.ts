import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { uploadImage } from "@/lib/cloudinary"
import type { ClothingItem } from "@/lib/data"

// GET /api/clothing - Fetch all clothing items
export async function GET() {
  try {
    const ids: string[] = await redis.zrange("clothing:ids", 0, -1, {
      rev: true,
    })

    if (!ids || ids.length === 0) {
      return NextResponse.json([])
    }

    const pipeline = redis.pipeline()
    for (const id of ids) {
      pipeline.get(`clothing:item:${id}`)
    }
    const results = await pipeline.exec()

    const items: ClothingItem[] = results
      .map((raw) => {
        if (!raw) return null
        const item: ClothingItem = typeof raw === "string" ? JSON.parse(raw) : raw
        // Backfill missing fields for old items
        return {
          ...item,
          washCount: item.washCount ?? 0,
          lastWornDate: item.lastWornDate ?? null,
          notes: item.notes ?? "",
        }
      })
      .filter((item): item is ClothingItem => item !== null)

    return NextResponse.json(items)
  } catch (error) {
    console.error("Failed to fetch clothing items:", error)
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    )
  }
}

// POST /api/clothing - Create a new clothing item (with image upload)
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""

    let name: string
    let category: string
    let boughtFrom: string
    let price: number
    let purchaseDate: string
    let notes: string
    let imageUrl = "/images/white-tshirt.jpg"

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const imageFile = formData.get("image") as File | null

      name = formData.get("name") as string
      category = formData.get("category") as string
      boughtFrom = (formData.get("boughtFrom") as string) || "Unknown"
      price = parseFloat(formData.get("price") as string) || 0
      purchaseDate =
        (formData.get("purchaseDate") as string) ||
        new Date().toISOString().split("T")[0]
      notes = (formData.get("notes") as string) || ""

      if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        imageUrl = await uploadImage(buffer, "recount")
      }
    } else {
      const body = await request.json()
      name = body.name
      category = body.category
      boughtFrom = body.boughtFrom || "Unknown"
      price = body.price || 0
      purchaseDate =
        body.purchaseDate || new Date().toISOString().split("T")[0]
      notes = body.notes || ""
      imageUrl = body.image || imageUrl
    }

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const id = String(Date.now())
    const item: ClothingItem = {
      id,
      name: name.trim(),
      category: category as ClothingItem["category"],
      image: imageUrl,
      wearCount: 0,
      washCount: 0,
      boughtFrom: boughtFrom?.trim() || "Unknown",
      price,
      purchaseDate,
      lastWornDate: null,
      notes: notes?.trim() || "",
    }

    await redis.set(`clothing:item:${id}`, JSON.stringify(item))
    await redis.zadd("clothing:ids", { score: Date.now(), member: id })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("Failed to create clothing item:", error)
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    )
  }
}
