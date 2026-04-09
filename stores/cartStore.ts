import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItemData } from '@/components/molecules/CartItem'

interface CartState {
  items: CartItemData[]
  open: boolean

  // Actions
  addItem: (item: Omit<CartItemData, 'id'> & { productoId: string }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed
  totalItems: () => number
  subtotal: () => number
  envio: (minimo?: number, costo?: number) => number
  total: (minimo?: number, costo?: number) => number
}

function generateId() {
  return Math.random().toString(36).slice(2, 9)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,

      addItem: (newItem) => {
        const { productoId, talla, ...rest } = newItem
        set((state) => {
          const existing = state.items.find(
            (i) => i.productoId === productoId && i.talla === talla
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id ? { ...i, cantidad: i.cantidad + (rest.cantidad ?? 1) } : i
              ),
              open: true,
            }
          }
          return {
            items: [
              ...state.items,
              { ...rest, id: generateId(), productoId, talla },
            ],
            open: true,
          }
        })
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, cantidad) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, cantidad } : i)),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ open: true }),
      closeCart: () => set({ open: false }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),

      subtotal: () => get().items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),

      envio: (minimo = 999, costo = 150) => {
        const sub = get().subtotal()
        return sub >= minimo ? 0 : costo
      },

      total: (minimo = 999, costo = 150) => get().subtotal() + get().envio(minimo, costo),
    }),
    {
      name: 'veintiox-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
