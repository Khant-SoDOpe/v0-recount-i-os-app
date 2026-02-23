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

  async function seed() {
    await fetch("/api/clothing/seed", { method: "POST" })
    await mutate()
  }

  // Add a new clothing item with image upload (FormData)
  async function addItem(formData: FormData): Promise<ClothingItem> {
    const res = await fetch("/api/clothing", {
      method: "POST",
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed to add item" }))
      throw new Error(err.error || "Failed to add item")
    }
    const newItem: ClothingItem = await res.json()
    await mutate([newItem, ...items], { revalidate: false })
    return newItem
  }

  // Update an item - supports both JSON patches and FormData (for image re-upload)
  async function updateItem(
    id: string,
    updates: Partial<ClothingItem> | FormData
  ): Promise<ClothingItem> {
    const isFormData = updates instanceof FormData

    // Optimistic update for JSON patches
    if (!isFormData) {
      const optimistic = items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
      mutate(optimistic, { revalidate: false })
    }

    try {
      const res = await fetch(`/api/clothing/${id}`, {
        method: "PATCH",
        ...(isFormData
          ? { body: updates }
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updates),
            }),
      })
      if (!res.ok) {
        throw new Error("Failed to update item")
      }
      const updated: ClothingItem = await res.json()

      // Update local cache with server response
      mutate(
        items.map((item) => (item.id === id ? updated : item)),
        { revalidate: false }
      )

      return updated
    } catch {
      await mutate() // Revert on failure
      throw new Error("Failed to update item")
    }
  }

  // Convenience: update wear count
  async function updateWearCount(id: string, wearCount: number) {
    return updateItem(id, { wearCount })
  }

  // Convenience: update wash count
  async function updateWashCount(id: string, washCount: number) {
    return updateItem(id, { washCount })
  }

  // Delete an item
  async function deleteItem(id: string) {
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
    updateItem,
    updateWearCount,
    updateWashCount,
    deleteItem,
    mutate,
  }
}
