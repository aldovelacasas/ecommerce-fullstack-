import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getCartItems,
  addItemToCart,
  updateCartItem,
  removeCartItemRequest,
  clearCartRequest
} from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  const refreshCart = async () => {
    if (!user || !token) {
      setCartItems([]);
      return;
    }

    try {
      const data = await getCartItems();
      setCartItems(data);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user, token]);

  useEffect(() => {
    const handleFocus = () => {
      refreshCart();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, token]);

  const addToCart = async (product) => {
    if (!user || !token) return;

    try {
      await addItemToCart(product.id);
      await refreshCart();
    } catch (error) {
  console.error("Error al agregar al carrito:", error);
  alert("No se pudo agregar el producto. Puede que ya no tenga stock.");
  await refreshCart();
}
  };

  const increaseQuantity = async (id) => {
    try {
      const currentItem = cartItems.find((item) => item.id === id);
      if (!currentItem) return;

      await updateCartItem(id, currentItem.quantity + 1);
      await refreshCart();
    } catch (error) {
  console.error("Error al aumentar cantidad:", error);
  alert("No se pudo aumentar la cantidad. Revisa el stock disponible.");
  await refreshCart();
}
  };

  const decreaseQuantity = async (id) => {
    try {
      const currentItem = cartItems.find((item) => item.id === id);
      if (!currentItem) return;

      if (currentItem.quantity <= 1) {
        await removeCartItemRequest(id);
      } else {
        await updateCartItem(id, currentItem.quantity - 1);
      }

      await refreshCart();
    } catch (error) {
  console.error("Error al disminuir cantidad:", error);
  alert("No se pudo disminuir la cantidad. Revisa el stock disponible.");
  await refreshCart();
}
  };

  const removeFromCart = async (id) => {
    try {
      await removeCartItemRequest(id);
      await refreshCart();
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartRequest();
      setCartItems([]);
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
    }
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}