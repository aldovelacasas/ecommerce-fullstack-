import { apiUrl } from "../config/api";

const API_URL = apiUrl("/api/products");

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};
};

export const getProducts = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }

  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    throw new Error("No se pudo crear el producto");
  }

  return response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders()
    },
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    throw new Error("No se pudo actualizar el producto");
  }

  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar el producto");
  }

  return response.json();
};
