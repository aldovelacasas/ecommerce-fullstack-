const fallbackApiBaseUrl = "http://localhost:4000";

const rawApiBaseUrl = import.meta.env.VITE_API_URL || fallbackApiBaseUrl;

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
