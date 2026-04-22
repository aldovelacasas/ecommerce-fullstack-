import { apiUrl } from "../config/api";

const API_URL = apiUrl("/api/cart");

const getToken = () => localStorage.getItem("token");

export const getCartItems = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el carrito");
  }

  return response.json();
};

export const addItemToCart = async (productId) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ productId })
  });

  if (!response.ok) {
    throw new Error("No se pudo agregar al carrito");
  }

  return response.json();
};

export const updateCartItem = async (id, quantity) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ quantity })
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el carrito");
  }

  return response.json();
};

export const removeCartItemRequest = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el item");
  }

  return response.json();
};

export const clearCartRequest = async () => {
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    throw new Error("No se pudo vaciar el carrito");
  }

  return response.json();
};
