export type Category = "top" | "upper" | "lower" | "underwear"

export interface ClothingItem {
  id: string
  name: string
  category: Category
  image: string
  wearCount: number
  boughtFrom: string
  price: number
  purchaseDate: string
}

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "top", label: "Tops", icon: "shirt" },
  { id: "upper", label: "Upper", icon: "jacket" },
  { id: "lower", label: "Lower", icon: "pants" },
  { id: "underwear", label: "Underwear", icon: "layers" },
]

export const SAMPLE_ITEMS: ClothingItem[] = [
  {
    id: "1",
    name: "Classic White Tee",
    category: "top",
    image: "/images/white-tshirt.jpg",
    wearCount: 12,
    boughtFrom: "Uniqlo",
    price: 19.9,
    purchaseDate: "2025-03-15",
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    category: "lower",
    image: "/images/blue-jeans.jpg",
    wearCount: 8,
    boughtFrom: "Levi's",
    price: 89.0,
    purchaseDate: "2025-01-20",
  },
  {
    id: "3",
    name: "Cozy Knit Sweater",
    category: "upper",
    image: "/images/beige-sweater.jpg",
    wearCount: 5,
    boughtFrom: "H&M",
    price: 34.99,
    purchaseDate: "2025-02-10",
  },
  {
    id: "4",
    name: "Utility Jacket",
    category: "upper",
    image: "/images/olive-jacket.jpg",
    wearCount: 3,
    boughtFrom: "Zara",
    price: 79.9,
    purchaseDate: "2024-11-05",
  },
  {
    id: "5",
    name: "Black Midi Dress",
    category: "top",
    image: "/images/black-dress.jpg",
    wearCount: 6,
    boughtFrom: "& Other Stories",
    price: 59.0,
    purchaseDate: "2025-04-01",
  },
  {
    id: "6",
    name: "Gray Hoodie",
    category: "upper",
    image: "/images/gray-hoodie.jpg",
    wearCount: 15,
    boughtFrom: "Nike",
    price: 65.0,
    purchaseDate: "2024-09-12",
  },
]
