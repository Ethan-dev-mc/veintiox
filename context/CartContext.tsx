'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from '@/data/products'

export interface CartItem {
  product: Product
  quantity: number
  size: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string } }
  | { type: 'REMOVE_ITEM'; payload: { id: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.product.id === action.payload.product.id && i.size === action.payload.size
      )
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.product.id === action.payload.product.id && i.size === action.payload.size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { product: action.payload.product, quantity: 1, size: action.payload.size }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i.product.id === action.payload.id && i.size === action.payload.size)
        ),
      }
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !(i.product.id === action.payload.id && i.size === action.payload.size)
          ),
        }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.payload.id && i.size === action.payload.size
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (product: Product, size: string) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  const total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (product, size) => dispatch({ type: 'ADD_ITEM', payload: { product, size } }),
        removeItem: (id, size) => dispatch({ type: 'REMOVE_ITEM', payload: { id, size } }),
        updateQuantity: (id, size, quantity) =>
          dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        openCart: () => dispatch({ type: 'OPEN_CART' }),
        closeCart: () => dispatch({ type: 'CLOSE_CART' }),
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
