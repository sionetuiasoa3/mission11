import { useState } from 'react'
import { Link } from 'react-router-dom'
import BookList from '../components/BookList'
import CartSummary from '../components/CartSummary'
import CategoryFilter from '../components/CategoryFilter'

export default function BookListPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  return (
    <div className="container py-4">
      <header className="mb-4 pb-3 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div>
          <h1 className="h2 mb-1">Online Bookstore</h1>
          <p className="text-body-secondary mb-0">
            Books from the Mission 11 database, sorted by title.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <CartSummary />
          <button
            className="btn btn-outline-secondary"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#storeNavOffcanvas"
            aria-controls="storeNavOffcanvas"
          >
            Menu
          </button>
          <Link to="/cart" className="btn btn-outline-primary">
            Cart
          </Link>
        </div>
      </header>

      {/* MISSION12 Bootstrap feature: Offcanvas — slide-in navigation panel (Bootstrap offcanvas component). */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="storeNavOffcanvas"
        aria-labelledby="storeNavOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h2 className="offcanvas-title h5" id="storeNavOffcanvasLabel">
            Store menu
          </h2>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body d-flex flex-column gap-2">
          <Link to="/" className="btn btn-light text-start" data-bs-dismiss="offcanvas">
            Book list
          </Link>
          <Link to="/cart" className="btn btn-light text-start" data-bs-dismiss="offcanvas">
            Shopping cart
          </Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
        <div className="col-md-9">
          <BookList selectedCategories={selectedCategories} />
        </div>
      </div>
    </div>
  )
}
