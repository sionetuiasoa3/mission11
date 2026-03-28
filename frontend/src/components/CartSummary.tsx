import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartProvider'

export default function CartSummary() {
  const { cart } = useCart()

  const totalItems = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  )

  const totalPrice = useMemo(
    () => cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [cart],
  )

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
      }),
    [],
  )

  return (
    <div className="alert alert-light border mb-3 mb-md-0 py-2 px-3 small">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <span>
          <span className="text-body-secondary">Quantity: </span>
          <strong>{totalItems}</strong>
          <span className="text-body-secondary mx-1">·</span>
          <span className="text-body-secondary">Total: </span>
          <strong>{currency.format(totalPrice)}</strong>
        </span>
        <Link to="/cart" className="btn btn-sm btn-primary">
          View cart
        </Link>
      </div>
    </div>
  )
}
