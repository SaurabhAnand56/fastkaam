// src/stores/cartStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  cardType: string
  cardName: string
  frontImageUrl: string
  backImageUrl: string
  frontPreview: string
  backPreview: string
  quantity: number
  unitPrice: number
}

interface CartStore {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      totalAmount: 0,

      addItem: (item) => {
        const id = crypto.randomUUID()
        set((state) => {
          const items = [...state.items, { ...item, id }]
          return {
            items,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
            totalAmount: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
          }
        })
      },

      removeItem: (id) => {
        set((state) => {
          const items = state.items.filter((i) => i.id !== id)
          return {
            items,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
            totalAmount: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
          }
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return get().removeItem(id)
        set((state) => {
          const items = state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
          return {
            items,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
            totalAmount: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
          }
        })
      },

      clearCart: () => set({ items: [], itemCount: 0, totalAmount: 0 }),
    }),
    {
      name: 'fastkaam-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
