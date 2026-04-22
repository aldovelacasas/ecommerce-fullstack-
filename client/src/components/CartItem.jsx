function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <article className="cart-item">
      <img
        src={item.imageUrl || "https://via.placeholder.com/120x100"}
        alt={item.name}
        className="cart-item__image"
      />

      <div className="cart-item__content">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p>Precio: ${Number(item.price).toFixed(2)}</p>
        <p>Cantidad: {item.quantity}</p>
        <p>Stock disponible: {item.stock}</p>
        <p>Subtotal: ${(Number(item.price) * item.quantity).toFixed(2)}</p>


        <div className="cart-item__actions">
          <button onClick={() => onIncrease(item.id)}>+</button>
          <button onClick={() => onDecrease(item.id)}>-</button>
          <button className="danger-btn" onClick={() => onRemove(item.id)}>
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}

export default CartItem;