import { apiUrl } from "../config/api";

const API_URL = apiUrl("/api/orders");

const getToken = () => localStorage.getItem("token");

export const checkout = async () => {
  const response = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to checkout");
  }
  return response.json();
};

export const getUserOrders = async () => {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

export const getOrderById = async (orderId) => {
  const response = await fetch(`${API_URL}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  return response.json();
};
