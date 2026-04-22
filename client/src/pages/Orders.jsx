import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserOrders } from "../services/orderService";

const FALLBACK_IMAGE = "https://via.placeholder.com/120x100?text=Producto";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        setError("Error al cargar las ordenes");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Cargando ordenes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <section>
      <h1>Mis compras</h1>

      {location.state?.success && (
        <div className="success-message">
          Compra realizada exitosamente.
        </div>
      )}

      {orders.length === 0 ? (
        <p>No has realizado ninguna compra aun.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Orden #{order.id}</h3>
                <span className={`order-status status-${String(order.status).toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
              <p className="order-date">
                Fecha: {new Date(order.createdAt).toLocaleDateString("es-MX")}
              </p>
              <div className="order-items">
                {(order.orderItems ?? []).map((item) => (
                  <div key={item.id} className="order-item">
                    <img
                      src={item?.product?.imageUrl ?? FALLBACK_IMAGE}
                      alt={item?.product?.name ?? "Producto sin datos"}
                    />
                    <div className="item-info">
                      <h4>{item?.product?.name ?? "Producto no disponible"}</h4>
                      <p>Cantidad: {item.quantity}</p>
                      <p>Precio: ${Number(item.price ?? 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <strong>Total: ${Number(order.total ?? 0).toFixed(2)}</strong>
              </div>
              <div>
                <Link className="btn btn-ghost" to={`/orders/${order.id}`}>
                  Ver detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;
