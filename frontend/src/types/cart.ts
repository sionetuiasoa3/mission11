export interface CartItem {
  bookId: number
  name: string
  price: number
  quantity: number
}

export interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (bookId: number) => void
  clearCart: () => void
}
