import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { SAMPLE_ITEMS } from "@/lib/data"

// POST /api/clothing/seed - Seed the database with sample items
export async function POST() {
  try {
    // Check if data already exists
    const existingCount = await redis.zcard("clothing:ids")
    if (existingCount > 0) {
      return NextResponse.json({
        message: "Database already seeded",
        count: existingCount,
      })
    }

    // Seed each sample item
    const pipeline = redis.pipeline()
    for (const item of SAMPLE_ITEMS) {
      pipeline.set(`clothing:item:${item.id}`, JSON.stringify(item))
      pipeline.zadd("clothing:ids", {
        score: new Date(item.purchaseDate).getTime(),
        member: item.id,
      })
    }
    await pipeline.exec()

    return NextResponse.json({
      message: "Database seeded successfully",
      count: SAMPLE_ITEMS.length,
    })
  } catch (error) {
    console.error("Failed to seed database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
