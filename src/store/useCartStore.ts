import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export type CartItem = {
  productId: number
  variantId: number
  title: string
  price: number
  quantity: number
  inventory: number
  options: { label: string; variantType: number }[]
  image?: string
  variantUrl: string
}

type CartState = {
  items: CartItem[]
  isOpen: boolean

  openCart: () => void
  closeCart: () => void

  addItem: (item: CartItem) => void
  removeItem: (variantId: number) => void
  updateQuantity: (variantId: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === newItem.variantId)

          //Fusion si déjà présent
          if (existing) {
            const nextQty = Math.min(existing.quantity + newItem.quantity, existing.inventory)

            return {
              items: state.items.map((i) =>
                i.variantId === newItem.variantId ? { ...i, quantity: nextQty } : i,
              ),
            }
          }

          return { items: [...state.items, newItem] }
        }),

      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),

      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.inventory)) }
              : i,
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'ebuildfy-cart-storage', // name of the item in the storage (must be unique)
    },
  ),
)
