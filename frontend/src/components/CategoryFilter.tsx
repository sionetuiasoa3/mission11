import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type CategoryFilterProps = {
  selectedCategories: string[]
  setSelectedCategories: Dispatch<SetStateAction<string[]>>
}

export default function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/books/categories')
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`)
        }
        const data = (await res.json()) as string[]
        setCategories(data)
        setError(null)
      } catch {
        setError('Could not load categories.')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  return (
    <aside className="border rounded p-3 bg-body-secondary bg-opacity-25">
      <h2 className="h6 mb-3">Categories</h2>

      {loading && <p className="small text-body-secondary mb-0">Loading…</p>}
      {error && <p className="small text-danger mb-0">{error}</p>}

      {!loading && !error && (
        <ul className="list-unstyled mb-3">
          {categories.map((category) => (
            <li key={category} className="mb-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`cat-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() =>
                    setSelectedCategories(
                      selectedCategories.includes(category)
                        ? selectedCategories.filter((c) => c !== category)
                        : [...selectedCategories, category],
                    )
                  }
                />
                <label
                  className="form-check-label"
                  htmlFor={`cat-${category}`}
                >
                  {category}
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* MISSION12 Bootstrap feature: Accordion — collapsible “How filters work” help panel (Bootstrap accordion component). */}
      <div className="accordion accordion-flush" id="categoryFilterAccordion">
        <div className="accordion-item">
          <h3 className="accordion-header">
            <button
              className="accordion-button collapsed py-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#categoryFilterHelp"
              aria-expanded="false"
              aria-controls="categoryFilterHelp"
            >
              How filters work
            </button>
          </h3>
          <div
            id="categoryFilterHelp"
            className="accordion-collapse collapse"
            data-bs-parent="#categoryFilterAccordion"
          >
            <div className="accordion-body small py-2">
              Check one or more categories to narrow the book list. Pagination
              and counts update to match only the books in the selected
              categories.
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
