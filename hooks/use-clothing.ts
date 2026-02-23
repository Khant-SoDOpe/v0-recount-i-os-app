import useSWR from "swr"
import type { ClothingItem } from "@/lib/data"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useClothing() {
  const { data, error, isLoading, mutate } = useSWR<ClothingItem[]>(
    "/api/clothing",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  )

  const items = data ?? []
  const isSeeded = items.length > 0

  // Seed the database if it's empty
  async function seed() {
    await fetch("/api/clothing/seed", { method: "POST" })
    await mutate()
  }

  // Add a new clothing item with image upload
  async function addItem(formData: FormData): Promise<ClothingItem> {
    const res = await fetch("/api/clothing", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      throw new Error("Failed to add item")
    }
    const newItem: ClothingItem = await res.json()
    await mutate([newItem, ...items], { revalidate: false })
    return newItem
  }

  // Update wear count
  async function updateWearCount(id: string, wearCount: number) {
    // Optimistic update
    const optimistic = items.map((item) =>
      item.id === id ? { ...item, wearCount } : item
    )
    mutate(optimistic, { revalidate: false })

    try {
      await fetch(`/api/clothing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wearCount }),
      })
    } catch {
      // Revert on failure
      await mutate()
    }
  }

  // Delete an item
  async function deleteItem(id: string) {
    // Optimistic update
    const optimistic = items.filter((item) => item.id !== id)
    mutate(optimistic, { revalidate: false })

    try {
      await fetch(`/api/clothing/${id}`, { method: "DELETE" })
    } catch {
      await mutate()
    }
  }

  return {
    items,
    isLoading,
    isSeeded,
    error,
    seed,
    addItem,
    updateWearCount,
    deleteItem,
    mutate,
  }
}
