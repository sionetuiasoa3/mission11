import { Link } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchBooks } from '../api/booksApi'
import { useCart } from '../context/CartProvider'
import type { PagedBooksResult } from '../types/book'

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const

type BookListProps = {
  selectedCategories: string[]
}

export default function BookList({ selectedCategories }: BookListProps) {
  const { addToCart } = useCart()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [data, setData] = useState<PagedBooksResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPage(1)
  }, [selectedCategories])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchBooks(
        page,
        pageSize,
        sortDirection,
        selectedCategories,
      )
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sortDirection, selectedCategories])

  useEffect(() => {
    void load()
  }, [load, selectedCategories])

  const onPageSizeChange = (next: number) => {
    setPage(1)
    setPageSize(next)
  }

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }),
    [],
  )

  /** One-based page numbers for pagination links (length = total pages in the dataset). */
  const pageLinkNumbers = useMemo(() => {
    if (!data || data.totalPages < 1) {
      return []
    }
    return Array.from({ length: data.totalPages }, (_, i) => i + 1)
  }, [data])

  return (
    <div>
      <div className="row g-3 align-items-end mb-3">
        <div className="col-sm-6 col-md-4">
          <label htmlFor="pageSize" className="form-label">
            Results per page
          </label>
          <select
            id="pageSize"
            className="form-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-6 col-md-4">
          <label htmlFor="sortTitle" className="form-label">
            Sort by title
          </label>
          <select
            id="sortTitle"
            className="form-select"
            value={sortDirection}
            onChange={(e) =>
              setSortDirection(e.target.value as 'asc' | 'desc')
            }
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="alert alert-secondary" role="status">
          Loading books…
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="table-responsive shadow-sm rounded border bg-body">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Author</th>
                  <th scope="col">Publisher</th>
                  <th scope="col">ISBN</th>
                  <th scope="col">Classification</th>
                  <th scope="col">Category</th>
                  <th scope="col" className="text-end">
                    Pages
                  </th>
                  <th scope="col" className="text-end">
                    Price
                  </th>
                  <th scope="col">Cart</th>
                  <th scope="col">Donate</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((b) => (
                  <tr key={b.bookID}>
                    <td className="fw-medium">{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.publisher}</td>
                    <td>
                      <code className="small">{b.isbn}</code>
                    </td>
                    <td>{b.classification}</td>
                    <td>{b.category}</td>
                    <td className="text-end">{b.pageCount}</td>
                    <td className="text-end">{currency.format(b.price)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          addToCart({
                            bookId: b.bookID,
                            name: b.title,
                            price: b.price,
                            quantity: 1,
                          })
                        }
                      >
                        Add to cart
                      </button>
                    </td>
                    <td>
                      <Link
                        className="btn btn-sm btn-outline-secondary"
                        to={`/donate/${b.bookID}/${encodeURIComponent(b.title)}`}
                      >
                        Donate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav
            className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3"
            aria-label="Book pagination"
          >
            <p className="small text-body-secondary mb-0">
              Showing{' '}
              {data.totalCount === 0
                ? '0'
                : `${(data.page - 1) * data.pageSize + 1}–${Math.min(
                    data.page * data.pageSize,
                    data.totalCount,
                  )}`}{' '}
              of {data.totalCount} books
            </p>
            <ul className="pagination mb-0 flex-wrap">
              <li
                className={`page-item ${data.page <= 1 || data.totalPages === 0 ? 'disabled' : ''}`}
              >
                <a
                  className="page-link"
                  href="#"
                  aria-label="Previous page"
                  onClick={(e) => {
                    e.preventDefault()
                    if (data.page > 1) {
                      setPage((p) => Math.max(1, p - 1))
                    }
                  }}
                >
                  Previous
                </a>
              </li>
              {pageLinkNumbers.map((pageNum) => (
                <li
                  key={pageNum}
                  className={`page-item ${data.page === pageNum ? 'active' : ''}`}
                >
                  <a
                    className="page-link"
                    href="#"
                    aria-label={`Page ${pageNum}`}
                    aria-current={data.page === pageNum ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(pageNum)
                    }}
                  >
                    {pageNum}
                  </a>
                </li>
              ))}
              <li
                className={`page-item ${
                  data.page >= data.totalPages || data.totalPages === 0
                    ? 'disabled'
                    : ''
                }`}
              >
                <a
                  className="page-link"
                  href="#"
                  aria-label="Next page"
                  onClick={(e) => {
                    e.preventDefault()
                    if (data.page < data.totalPages) {
                      setPage((p) => Math.min(data.totalPages, p + 1))
                    }
                  }}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  )
}
