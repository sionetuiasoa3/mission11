import { useNavigate, useParams } from 'react-router-dom'

export default function DonatePage() {
  const { bookId, bookName } = useParams<{
    bookId: string
    bookName: string
  }>()
  const navigate = useNavigate()

  const id = Number(bookId)
  const title = bookName ? decodeURIComponent(bookName) : ''

  return (
    <div className="container py-4">
      <h1 className="h2 mb-3">Donate</h1>
      <p className="mb-1">
        <span className="text-body-secondary">Book ID:</span>{' '}
        {Number.isFinite(id) ? id : bookId}
      </p>
      <p className="mb-4">
        <span className="text-body-secondary">Title:</span> {title}
      </p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => navigate(-1)}
      >
        Continue Shopping
      </button>
    </div>
  )
}
