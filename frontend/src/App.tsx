import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartProvider'
import BookListPage from './pages/BookListPage'
import CartPage from './pages/CartPage'
import DonatePage from './pages/DonatePage'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<BookListPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/donate/:bookId/:bookName" element={<DonatePage />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
