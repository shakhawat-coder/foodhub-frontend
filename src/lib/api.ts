// API utility functions for communicating with the backend

// Use relative path for client-side requests to enable the Next.js proxy/rewrite
// This is critical for session cookies on Vercel
const API_BASE_URL = typeof window !== 'undefined' ? "/api" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options;

 
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ).toString();
    url += `?${queryString}`;
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    credentials: "include",
    ...fetchOptions,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error || `API request failed: ${response.statusText}`,
    );
  }

  return response.json();
}

// ============== MEALS API ==============
export const mealsAPI = {
  // Get all meals
  getAll: () => apiRequest("/meal", { method: "GET" }),

  // Get single meal by ID
  getById: (id: string) => apiRequest(`/meal/${id}`, { method: "GET" }),

  // Create meal (admin only)
  create: (data: {
    name: string;
    price: number;
    description: string;
    providerId: string;
    categoryId: string;
  }) => apiRequest("/meal", { method: "POST", body: JSON.stringify(data) }),

  // Update meal
  update: (id: string, data: any) =>
    apiRequest(`/meal/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete meal
  delete: (id: string) => apiRequest(`/meal/${id}`, { method: "DELETE" }),
};

// ============== CATEGORIES API ==============
export const categoriesAPI = {
  // Get all categories
  getAll: () => apiRequest("/categories", { method: "GET" }),

  // Get single category
  getById: (id: string) => apiRequest(`/categories/${id}`, { method: "GET" }),

  // Create category
  create: (data: any) =>
    apiRequest("/categories", { method: "POST", body: JSON.stringify(data) }),

  // Update category
  update: (id: string, data: any) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete category
  delete: (id: string) => apiRequest(`/categories/${id}`, { method: "DELETE" }),
};

// ============== CART API ==============
export const cartAPI = {
  // Get cart items
  getCart: () => apiRequest("/cart", { method: "GET" }),

  // Add item to cart
  addItem: (data: { mealId: string; quantity: number; price: number }) =>
    apiRequest("/cart", { method: "POST", body: JSON.stringify(data) }),

  // Update cart item
  updateItem: (id: string, data: any) =>
    apiRequest(`/cart/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Remove item from cart
  removeItem: (id: string) => apiRequest(`/cart/${id}`, { method: "DELETE" }),

  // Clear cart
  clearCart: () => apiRequest("/cart/clear", { method: "DELETE" }),
};

// ============== ORDERS API ==============
export const ordersAPI = {
  // Create order
  create: (data: any) =>
    apiRequest("/order", { method: "POST", body: JSON.stringify(data) }),

  // Get user orders
  getUserOrders: () => apiRequest("/order/user", { method: "GET" }),

  // Get provider orders
  getProviderOrders: (params?: { type?: "incoming" | "history" }) =>
    apiRequest("/order/provider", { method: "GET", params }),

  // Get all orders (admin)
  getAll: () => apiRequest("/order", { method: "GET" }),

  // Get single order
  getById: (id: string) => apiRequest(`/order/${id}`, { method: "GET" }),

  // Update order status
  updateStatus: (id: string, status: string) =>
    apiRequest(`/order/status/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

export default apiRequest;
