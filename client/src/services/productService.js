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

const getErrorMessage = async (response, fallbackMessage) => {
  try {
    const data = await response.json();
    return data?.message || fallbackMessage;
  } catch (error) {
    return fallbackMessage;
  }
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
    throw new Error(await getErrorMessage(response, "No se pudo crear el producto"));
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
    throw new Error(await getErrorMessage(response, "No se pudo actualizar el producto"));
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
    throw new Error(await getErrorMessage(response, "No se pudo eliminar el producto"));
  }

  return response.json();
};
