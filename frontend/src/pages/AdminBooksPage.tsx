/**
 * Admin: view all books, add (NewBookForm), edit (EditBookForm), delete.
 * Routed at /adminbooks — see App.tsx.
 */
import { useCallback, useEffect, useState } from 'react'
import type { Book } from '../types/book'
import { deleteBook, fetchBooks } from '../api/booksApi'
import NewBookForm from '../components/NewBookForm'
import EditBookForm from '../components/EditBookForm'

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  const loadBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBooks(1, 100, 'asc', [])
      setBooks(data.items)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadBooks()
  }, [loadBooks])

  const handleDelete = async (bookId: number) => {
    if (!window.confirm('Delete this book permanently?')) {
      return
    }
    try {
      await deleteBook(bookId)
      setBooks((prev) => prev.filter((b) => b.bookID !== bookId))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4">Admin — Manage Books</h1>

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

      {!showAddForm && editingBook === null && (
        <button
          type="button"
          className="btn btn-success mb-3"
          onClick={() => setShowAddForm(true)}
        >
          Add Book
        </button>
      )}

      {showAddForm && (
        <NewBookForm
          onSuccess={() => {
            setShowAddForm(false)
            void loadBooks()
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingBook !== null && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            setEditingBook(null)
            void loadBooks()
          }}
          onCancel={() => setEditingBook(null)}
        />
      )}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Publisher</th>
                <th scope="col">ISBN</th>
                <th scope="col">Classification</th>
                <th scope="col">Category</th>
                <th scope="col">Pages</th>
                <th scope="col">Price</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.bookID}>
                  <td>{b.bookID}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.publisher}</td>
                  <td>
                    <code className="small">{b.isbn}</code>
                  </td>
                  <td>{b.classification}</td>
                  <td>{b.category}</td>
                  <td>{b.pageCount}</td>
                  <td>{b.price.toFixed(2)}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setEditingBook(b)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => void handleDelete(b.bookID)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
