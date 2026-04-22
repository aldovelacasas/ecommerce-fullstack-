import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product, onEdit, onDelete }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  return (
    <article className="product-card">
      <img
        src={product.imageUrl || "https://via.placeholder.com/300x200"}
        alt={product.name}
        className="product-card__image"
      />

      <div className="product-card__content">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="product-card__price">${product.price}</p>
        <p className="product-card__stock">Stock: {product.stock}</p>

        {!onEdit && !onDelete && user && (
          <button onClick={() => addToCart(product)}>
            Agregar al carrito
          </button>
        )}

        {onEdit && onDelete && (
          <div className="product-card__actions">
            <button onClick={() => onEdit(product)}>Editar</button>
            <button className="danger-btn" onClick={() => onDelete(product.id)}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;