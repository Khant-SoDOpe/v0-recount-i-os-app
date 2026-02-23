import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { uploadImage } from "@/lib/cloudinary"
import type { ClothingItem } from "@/lib/data"

// GET /api/clothing - Fetch all clothing items
export async function GET() {
  try {
    // Get all item IDs from the sorted set (newest first)
    const ids: string[] = await redis.zrange("clothing:ids", 0, -1, { rev: true })

    if (!ids || ids.length === 0) {
      return NextResponse.json([])
    }

    // Fetch all items in parallel
    const keys = ids.map((id) => `clothing:item:${id}`)
    const pipeline = redis.pipeline()
    for (const key of keys) {
      pipeline.get(key)
    }
    const results = await pipeline.exec()

    const items: ClothingItem[] = results
      .filter((item): item is ClothingItem => item !== null)

    return NextResponse.json(items)
  } catch (error) {
    console.error("Failed to fetch clothing items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

// POST /api/clothing - Create a new clothing item (with image upload)
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File | null
    const name = formData.get("name") as string
    const category = formData.get("category") as string
    const boughtFrom = formData.get("boughtFrom") as string
    const price = parseFloat(formData.get("price") as string) || 0
    const purchaseDate =
      (formData.get("purchaseDate") as string) ||
      new Date().toISOString().split("T")[0]

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Upload image to Cloudinary if provided
    let imageUrl = "/images/white-tshirt.jpg" // fallback
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      imageUrl = await uploadImage(buffer, "recount")
    }

    const id = String(Date.now())
    const item: ClothingItem = {
      id,
      name: name.trim(),
      category: category as ClothingItem["category"],
      image: imageUrl,
      wearCount: 0,
      boughtFrom: boughtFrom?.trim() || "Unknown",
      price,
      purchaseDate,
    }

    // Store in Redis: JSON string at key, and add to sorted set
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
