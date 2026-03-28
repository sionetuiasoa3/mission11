import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartProvider'

export default function CartPage() {
  const { cart, clearCart } = useCart()

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }),
    [],
  )

  const runningTotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [cart],
  )

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4">Shopping cart</h1>

      {cart.length === 0 ? (
        <p className="text-body-secondary mb-3">Your cart is empty.</p>
      ) : (
        <>
          <div className="table-responsive shadow-sm rounded border bg-body mb-3">
            <table className="table table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col" className="text-end">
                    Quantity
                  </th>
                  <th scope="col" className="text-end">
                    Price
                  </th>
                  <th scope="col" className="text-end">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {cart.map((line) => {
                  const subtotal = line.price * line.quantity
                  return (
                    <tr key={line.bookId}>
                      <td className="fw-medium">{line.name}</td>
                      <td className="text-end">{line.quantity}</td>
                      <td className="text-end">
                        {currency.format(line.price)}
                      </td>
                      <td className="text-end">
                        {currency.format(subtotal)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="fs-5 mb-3">
            <span className="text-body-secondary">Total: </span>
            <strong>{currency.format(runningTotal)}</strong>
          </p>

          <button
            type="button"
            className="btn btn-outline-danger me-2"
            onClick={() => clearCart()}
          >
            Clear cart
          </button>
        </>
      )}

      <Link to="/" className="btn btn-outline-primary">
        Back to books
      </Link>
    </div>
  )
}
