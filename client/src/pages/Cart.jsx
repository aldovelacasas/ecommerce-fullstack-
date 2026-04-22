import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    refreshCart
  } = useCart();

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <section>
      <h1>Carrito de compras</h1>

      {cartItems.length === 0 ? (
        <p>Tu carrito esta vacio.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: ${totalPrice.toFixed(2)}</h2>
            <div className="cart-actions">
              <button type="button" onClick={clearCart} className="danger-btn">
                Vaciar carrito
              </button>
              <Link to="/checkout" className="primary-btn">
                Ir a pagar
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
