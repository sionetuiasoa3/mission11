Folder structure:
frontend/src/
  pages/          -- full page components (BookListPage, CartPage, DonatePage)
  components/     -- reusable UI pieces (CategoryFilter, BookList, CartSummary)
  types/          -- TypeScript interfaces (CartItem, CartContextType)
  context/        -- CartProvider and useCart hook
API Endpoints:

GET /api/books?categories=X&categories=Y&pageNum=1&pageSize=10 -- returns filtered paginated books
GET /api/books/categories -- returns distinct category list as string array

Data flow:

selectedCategories state lives in BookListPage, passed down to CategoryFilter and BookList as props
CartProvider wraps all Routes in App.tsx so cart state is globally accessible
CartPage and BookListPage both consume useCart() for cart data

CartItem interface:
bookId: number
name: string
price: number
quantity: number
CartContextType interface:
cart: CartItem[]
addToCart: (item: CartItem) => void
removeFromCart: (bookId: number) => void
clearCart: () => void
addToCart logic:

Use .find() to check if bookId already exists in cart
If yes: use .map() to return updated cart with incremented quantity and updated subtotal
If no: use spread operator to append new item to cart array
