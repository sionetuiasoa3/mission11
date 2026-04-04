import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  addBook,
  fetchDistinctCategories,
  fetchDistinctClassifications,
  type NewBookPayload,
} from '../api/booksApi'

const emptyForm: NewBookPayload = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
}

type NewBookFormProps = {
  onSuccess: () => void
  onCancel: () => void
}

export default function NewBookForm({ onSuccess, onCancel }: NewBookFormProps) {
  const [formData, setFormData] = useState<NewBookPayload>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [classifications, setClassifications] = useState<string[]>([])
  const [listsError, setListsError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, cls] = await Promise.all([
          fetchDistinctCategories(),
          fetchDistinctClassifications(),
        ])
        setCategories(cats)
        setClassifications(cls)
        setListsError(null)
      } catch {
        setListsError('Could not load category or classification lists.')
      }
    }
    void load()
  }, [])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    if (name === 'pageCount' || name === 'price') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await addBook(formData)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Add New Book</h2>
        <form onSubmit={handleSubmit}>
          {listsError && (
            <div className="alert alert-warning" role="alert">
              {listsError}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-title">
                Title
              </label>
              <input
                id="new-title"
                className="form-control"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-author">
                Author
              </label>
              <input
                id="new-author"
                className="form-control"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-publisher">
                Publisher
              </label>
              <input
                id="new-publisher"
                className="form-control"
                name="publisher"
                type="text"
                value={formData.publisher}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-isbn">
                ISBN
              </label>
              <input
                id="new-isbn"
                className="form-control"
                name="isbn"
                type="text"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-classification">
                Classification
              </label>
              <select
                id="new-classification"
                className="form-select"
                name="classification"
                value={formData.classification}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select classification…
                </option>
                {classifications.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-category">
                Category
              </label>
              <select
                id="new-category"
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select category…
                </option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="new-pageCount">
                Page count
              </label>
              <input
                id="new-pageCount"
                className="form-control"
                name="pageCount"
                type="number"
                min={1}
                value={formData.pageCount || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="new-price">
                Price
              </label>
              <input
                id="new-price"
                className="form-control"
                name="price"
                type="number"
                min={0}
                step={0.01}
                value={formData.price || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button
              type="submit"
              className="btn btn-success"
              disabled={submitting}
            >
              {submitting ? 'Adding…' : 'Add Book'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
