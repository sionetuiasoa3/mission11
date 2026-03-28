import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartContextType, CartItem } from '../types/cart'

const CartContext = createContext<CartContextType | null>(null)

const CART_STORAGE_KEY = 'bookstore-cart-v1'

function isCartItem(x: unknown): x is CartItem {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  if (typeof o.bookId !== 'number' || !Number.isFinite(o.bookId)) return false
  if (typeof o.name !== 'string') return false
  if (typeof o.price !== 'number' || !Number.isFinite(o.price)) return false
  if (
    typeof o.quantity !== 'number' ||
    !Number.isInteger(o.quantity) ||
    o.quantity < 1
  ) {
    return false
  }
  return true
}

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isCartItem)
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(loadCartFromStorage)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      /* ignore quota / private mode */
    }
  }, [cart])

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.bookId === item.bookId)
      if (existing) {
        return prev.map((line) =>
          line.bookId === item.bookId
            ? { ...line, quantity: line.quantity + item.quantity }
            : line,
        )
      }
      return [...prev, item]
    })
  }, [])

  const removeFromCart = useCallback((bookId: number) => {
    setCart((prev) => prev.filter((line) => line.bookId !== bookId))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearCart,
    }),
    [cart, addToCart, removeFromCart, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
