import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";

const FALLBACK_IMAGE = "https://via.placeholder.com/120x100?text=Producto";

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOrderById(id);
        setOrder(data);
      } catch (fetchError) {
        setError("No fue posible cargar el detalle de la orden.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <section><p>Cargando detalle de orden...</p></section>;
  if (error) return <section><p className="error-message">{error}</p></section>;
  if (!order) return <section><p>No se encontro la orden.</p></section>;

  return (
    <section>
      <div className="order-header">
        <h1>Detalle de orden #{order.id}</h1>
        <span className={`order-status status-${String(order.status).toLowerCase()}`}>
          {order.status}
        </span>
      </div>
      <p className="order-date">
        Fecha: {new Date(order.createdAt).toLocaleDateString("es-MX")}
      </p>
      <div className="orders-list">
        <div className="order-card">
          <h2>Productos</h2>
          <div className="order-items">
            {(order.orderItems ?? []).map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={item?.product?.imageUrl ?? FALLBACK_IMAGE}
                  alt={item?.product?.name ?? "Producto"}
                />
                <div className="item-info">
                  <h4>{item?.product?.name ?? "Producto no disponible"}</h4>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio unitario: ${Number(item.price ?? 0).toFixed(2)}</p>
                  <p>Subtotal: ${(Number(item.price ?? 0) * Number(item.quantity ?? 0)).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <strong>Total pagado: ${Number(order.total ?? 0).toFixed(2)}</strong>
          </div>
          <div className="home-hero__actions">
            <Link className="btn btn-ghost" to="/orders">
              Volver a mis compras
            </Link>
            <Link className="btn btn-primary" to="/products">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;
