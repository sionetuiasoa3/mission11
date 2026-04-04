import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import type { Book } from '../types/book'
import { updateBook } from '../api/booksApi'

type EditBookFormProps = {
  book: Book
  onSuccess: () => void
  onCancel: () => void
}

export default function EditBookForm({
  book,
  onSuccess,
  onCancel,
}: EditBookFormProps) {
  const [formData, setFormData] = useState<Book>({ ...book })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormData({ ...book })
  }, [book])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      await updateBook(formData.bookID, formData)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card mb-4 border-primary">
      <div className="card-body">
        <h2 className="card-title h4 mb-3">Edit Book — {book.title}</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-title">
                Title
              </label>
              <input
                id="edit-title"
                className="form-control"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-author">
                Author
              </label>
              <input
                id="edit-author"
                className="form-control"
                name="author"
                type="text"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-publisher">
                Publisher
              </label>
              <input
                id="edit-publisher"
                className="form-control"
                name="publisher"
                type="text"
                value={formData.publisher}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-isbn">
                ISBN
              </label>
              <input
                id="edit-isbn"
                className="form-control"
                name="isbn"
                type="text"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-classification">
                Classification
              </label>
              <input
                id="edit-classification"
                className="form-control"
                name="classification"
                type="text"
                value={formData.classification}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-category">
                Category
              </label>
              <input
                id="edit-category"
                className="form-control"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="edit-pageCount">
                Page count
              </label>
              <input
                id="edit-pageCount"
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
              <label className="form-label" htmlFor="edit-price">
                Price
              </label>
              <input
                id="edit-price"
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
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Update Book'}
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
