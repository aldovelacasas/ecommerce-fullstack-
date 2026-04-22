import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { checkout } from "../services/orderService";
import PaymentForm from "../components/PaymentForm";

const FALLBACK_IMAGE = "https://via.placeholder.com/120x100?text=Producto";

function Checkout() {
  const { cartItems, totalPrice, refreshCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const normalizedItems = cartItems.map((item, index) => {
    const product = item?.product ?? item ?? {};
    const price = Number(product.price ?? item?.price ?? 0);

    return {
      id: item?.id ?? `item-${index}`,
      name: product.name ?? item?.name ?? "Producto",
      imageUrl: product.imageUrl ?? item?.imageUrl ?? FALLBACK_IMAGE,
      quantity: Number(item?.quantity ?? 0),
      price
    };
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");

    try {
      await checkout();
      await refreshCart();
      navigate("/orders", { state: { success: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Error al procesar el pago");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section>
        <h1>Pago</h1>
        <p>
          Tu carrito esta vacio. <a href="/products">Ir a productos</a>
        </p>
      </section>
    );
  }

  return (
    <section className="checkout">
      <h1>Pago</h1>

      <div className="checkout-container">
        <div className="order-summary">
          <h2>Resumen de compra</h2>
          <div className="checkout-items">
            {normalizedItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio: ${item.price.toFixed(2)}</p>
                  <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
          </div>
        </div>

        <div className="payment-section">
          <h2>Informacion de pago</h2>
          {error && <div className="error-message">{error}</div>}
          <PaymentForm onSubmit={handlePayment} isProcessing={isProcessing} />
        </div>
      </div>
    </section>
  );
}

export default Checkout;
