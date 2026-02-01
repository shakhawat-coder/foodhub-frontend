
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
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...fetchOptions.headers,
    },
    credentials: "include",
    ...fetchOptions,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {} as any;
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.error || `API request failed: ${response.statusText}`,
    );
  }

  return data as T;
}

// ============== UPLOAD API ==============
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiRequest<{ url: string }>("/upload", {
      method: "POST",
      body: formData,
    });
  },
};

// ============== MEALS API ==============
export const mealsAPI = {
  // Get all meals
  getAll: (options?: RequestOptions) => apiRequest("/meal", { method: "GET", ...options }),


  // Get single meal by ID
  getById: (id: string) => apiRequest(`/meal/${id}`, { method: "GET" }),

  // Create meal (admin only)
  create: (data: any) =>
    apiRequest("/meal", { method: "POST", body: JSON.stringify(data) }),

  // Update meal
  update: (id: string, data: any) =>
    apiRequest(`/meal/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete meal
  delete: (id: string) => apiRequest(`/meal/delete/${id}`, { method: "DELETE" }),
};

// ============== CATEGORIES API ==============
export const categoriesAPI = {
  // Get all categories
  getAll: (options?: RequestOptions) => apiRequest("/categories", { method: "GET", ...options }),


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
  addItem: (data: { mealId: string; quantity: number }) =>
    apiRequest("/cart", { method: "POST", body: JSON.stringify(data) }),

  // Update cart item
  updateItem: (data: { mealId: string; quantity: number }) =>
    apiRequest(`/cart/update`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Remove item from cart
  removeItem: (mealId: string) =>
    apiRequest(`/cart/remove`, {
      method: "POST",
      body: JSON.stringify({ mealId }),
    }),

  // Clear cart
  clearCart: () => apiRequest("/cart/clear", { method: "POST" }),
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
  getAll: (options?: RequestOptions) => apiRequest("/order", { method: "GET", ...options }),

  // Get single order
  getById: (id: string) => apiRequest(`/order/${id}`, { method: "GET" }),

  // Update order status
  updateStatus: (id: string, status: string) =>
    apiRequest(`/order/status/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// ============== REVIEWS API ==============
export const reviewsAPI = {
  // Create review
  create: (data: { rating: number; comment: string; mealId: string }) =>
    apiRequest("/review", { method: "POST", body: JSON.stringify(data) }),

  // Get meal reviews
  getByMeal: (mealId: string) =>
    apiRequest(`/review/${mealId}`, { method: "GET" }),
};

// ============== PROVIDER API ==============
export const providersAPI = {
  getAll: () => apiRequest("/provider", { method: "GET" }),

  getById: (id: string) => apiRequest(`/provider/${id}`, { method: "GET" }),

  getByEmail: (email: string) => apiRequest(`/provider/email/${email}`, { method: "GET" }),
  syncFromUsers: () => apiRequest("/provider/sync/from-users", { method: "POST" }),
  update: (id: string, data: any) => apiRequest(`/provider/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};



// ============== USERS API ==============
export const usersAPI = {
  // Get all users (admin only)
  getAll: (options?: RequestOptions) => apiRequest<{ data: any[] }>("/users", { method: "GET", ...options }),

  // Toggle user status (admin only)
  toggleStatus: (id: string) =>
    apiRequest(`/users/${id}/status`, { method: "PATCH" }),

  // Update user profile
  updateProfile: (id: string, data: any) =>
    apiRequest(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

export default apiRequest;
