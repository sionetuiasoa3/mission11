import { useCallback, useEffect, useMemo, useState } from 'react'

type Book = {
  bookID: number
  title: string
  author: string
  publisher: string
  isbn: string
  classification: string
  category: string
  pageCount: number
  price: number
}

type PagedBooksResult = {
  items: Book[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const

async function fetchBooks(
  page: number,
  pageSize: number,
  sortDirection: 'asc' | 'desc',
): Promise<PagedBooksResult> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortDirection,
  })
  const res = await fetch(`/api/books?${params}`)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json() as Promise<PagedBooksResult>
}

export default function BookList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [data, setData] = useState<PagedBooksResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchBooks(page, pageSize, sortDirection)
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, sortDirection])

  useEffect(() => {
    void load()
  }, [load])

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

  return (
    <div className="container py-4">
      <header className="mb-4 pb-3 border-bottom">
        <h1 className="h2 mb-1">Online Bookstore</h1>
        <p className="text-body-secondary mb-0">
          Books from the Mission 11 database, sorted by title.
        </p>
      </header>

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
            <ul className="pagination mb-0">
              <li className={`page-item ${data.page <= 1 ? 'disabled' : ''}`}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={data.page <= 1}
                >
                  Previous
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  Page {data.page} of {Math.max(data.totalPages, 1)}
                </span>
              </li>
              <li
                className={`page-item ${
                  data.page >= data.totalPages ? 'disabled' : ''
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() =>
                    setPage((p) =>
                      data.totalPages ? Math.min(data.totalPages, p + 1) : p,
                    )
                  }
                  disabled={data.page >= data.totalPages || data.totalPages === 0}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  )
}
