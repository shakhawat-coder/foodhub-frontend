const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();
    url += `?${queryString}`;
  }

  const response = await fetch(url, {
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...fetchOptions.headers,
    },
    credentials: "include",
    ...fetchOptions,
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : ({} as any);
  } catch (err) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.error || `API request failed: ${response.statusText}`);
  }

  return data as T;
}

// ============== UPLOAD API ==============
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest<{ data: { url: string } }>("/upload", {
      method: "POST",
      body: formData,
    });
  },
};

// ============== AI SEARCH (proxied to Express POST /ai-search) ==============
export type SearchMealResult = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  categoryId: string;
  categoryName: string;
  providerId: string;
  providerName: string;
};

export type AiSearchResponse = {
  suggestions: string[];
  results: SearchMealResult[];
  didYouMean: string | null;
  mode: "empty" | "db-only" | "ai" | "fallback";
};

export const searchAPI = {
  aiSearch: (query: string, init?: RequestInit) =>
    apiRequest<AiSearchResponse>("/ai-search", {
      method: "POST",
      body: JSON.stringify({ query }),
      ...init,
    }),
};

// ============== MEALS API ==============
export const mealsAPI = {
  getAll: (options?: RequestOptions) =>
    apiRequest("/meal", { method: "GET", cache: "no-store", ...options }),

  getReviewed: (limit: number = 6) =>
    apiRequest<any[]>("/meal/reviewed", {
      method: "GET",
      cache: "no-store",
      params: { limit },
    }),

  getById: (id: string) => apiRequest(`/meal/${id}`, { method: "GET" }),

  create: (data: any) =>
    apiRequest("/meal", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiRequest(`/meal/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/meal/delete/${id}`, { method: "DELETE" }),
};

// ============== CATEGORIES API ==============
export const categoriesAPI = {
  getAll: (options?: RequestOptions) =>
    apiRequest("/categories", { method: "GET", cache: "no-store", ...options }),

  getById: (id: string) => apiRequest(`/categories/${id}`, { method: "GET" }),

  create: (data: any) =>
    apiRequest("/categories", { method: "POST", body: JSON.stringify(data) }),

  update: (id: string, data: any) =>
    apiRequest(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

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
  getAll: (options?: RequestOptions) =>
    apiRequest("/order", { method: "GET", ...options }),

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

  // Get testimonials
  getTestimonials: () =>
    apiRequest<any[]>("/review/testimonials", {
      method: "GET",
      cache: "no-store",
    }),
};

// ============== PROVIDER API ==============
export const providersAPI = {
  getAll: () => apiRequest("/provider", { method: "GET", cache: "no-store" }),

  getById: (id: string) => apiRequest(`/provider/${id}`, { method: "GET" }),

  getByEmail: (email: string) =>
    apiRequest(`/provider/email/${email}`, { method: "GET" }),
  syncFromUsers: () =>
    apiRequest("/provider/sync/from-users", { method: "POST" }),
  update: (id: string, data: any) =>
    apiRequest(`/provider/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ============== USERS API ==============
export const usersAPI = {
  // Get all users (admin only)
  getAll: (options?: RequestOptions) =>
    apiRequest<{ data: any[] }>("/users", { method: "GET", ...options }),

  // Toggle user status (admin only)
  toggleStatus: (id: string) =>
    apiRequest(`/users/${id}/status`, { method: "PATCH" }),

  // Update user profile
  updateProfile: (id: string, data: any) =>
    apiRequest(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

// ============== RIDER API ==============
export const riderAPI = {
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    vehicleType: string;
    address?: string;
    image?: string;
  }) =>
    apiRequest("/auth/rider/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAvailableOrders: () =>
    apiRequest("/rider/available-orders", { method: "GET", cache: "no-store" }),
  getMyOrders: () =>
    apiRequest("/rider/my-orders", { method: "GET", cache: "no-store" }),
  getProfile: () =>
    apiRequest<any>("/rider/profile", { method: "GET", cache: "no-store" }),
  acceptOrder: (orderId: string) =>
    apiRequest(`/rider/accept-order/${orderId}`, { method: "POST" }),
  updateOrderStatus: (
    id: string,
    status: "PICKED_UP" | "ON_THE_WAY" | "DELIVERED"
  ) =>
    apiRequest(`/rider/order/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  updateAvailability: (isAvailable: boolean) =>
    apiRequest("/rider/availability", {
      method: "PATCH",
      body: JSON.stringify({ isAvailable }),
    }),
  getHistory: () =>
    apiRequest("/rider/history", { method: "GET", cache: "no-store" }),
  updateProfile: (data: {
    phone?: string;
    vehicleType?: string;
    lat?: number;
    lng?: number;
  }) =>
    apiRequest("/rider/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ============== MANAGER API ==============
export const managerAPI = {
  getOrders: () =>
    apiRequest("/manager/orders", { method: "GET", cache: "no-store" }),
  getRiders: () =>
    apiRequest("/manager/riders", { method: "GET", cache: "no-store" }),
  updateRiderStatus: (
    id: string,
    status: "PENDING" | "APPROVED" | "BLOCKED" | "REJECTED"
  ) =>
    apiRequest(`/manager/rider/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  assignRider: (orderId: string, riderId: string) =>
    apiRequest("/manager/assign-rider", {
      method: "POST",
      body: JSON.stringify({ orderId, riderId }),
    }),
  getReports: () =>
    apiRequest("/manager/reports", { method: "GET", cache: "no-store" }),
  createManager: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    image?: string;
  }) =>
    apiRequest("/manager/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export type DashboardAnalytics = {
  ordersByDate: Array<{ date: string; count: number }>;
  revenueByDate: Array<{ date: string; revenue: number }>;
  categoryStats: Array<{ category: string; count: number }>;
  deliveryStatusStats: Array<{ status: string; count: number }>;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  peakHour: string;
  bestSellingItem: string;
};

export type PublicStats = {
  customers: number;
  restaurants: number;
  meals: number;
  riders: number;
};

export const analyticsAPI = {
  getAdmin: (days = 7) =>
    apiRequest<DashboardAnalytics>("/analytics/admin", {
      method: "GET",
      cache: "no-store",
      params: { days },
    }),
  getProvider: (days = 7) =>
    apiRequest<DashboardAnalytics>("/analytics/provider", {
      method: "GET",
      cache: "no-store",
      params: { days },
    }),
  getPublic: () =>
    apiRequest<PublicStats>("/analytics/public", {
      method: "GET",
      cache: "no-store",
    }),
};

export const aiInsightsAPI = {
  create: (analyticsData: DashboardAnalytics, role: "ADMIN" | "PROVIDER") =>
    apiRequest<{ insights: string[] }>("/ai-insights", {
      method: "POST",
      body: JSON.stringify({ analyticsData, role }),
    }),
};

// ============== BANNER API ==============
export const bannerAPI = {
  getAll: (options?: RequestOptions) =>
    apiRequest<any[]>("/banner", {
      method: "GET",
      cache: "no-store",
      ...options,
    }),
  getById: (id: string) => apiRequest(`/banner/${id}`, { method: "GET" }),
  create: (data: any) =>
    apiRequest("/banner", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    apiRequest(`/banner/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  updateStatus: (id: string, isActive: boolean) =>
    apiRequest(`/banner/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    }),
  delete: (id: string) => apiRequest(`/banner/${id}`, { method: "DELETE" }),
};

// ============== BLOGS API ==============
export const blogsAPI = {
  getAll: () => apiRequest<{ data: any[] }>("/blogs", { method: "GET", cache: "no-store" }),
  getById: (id: string) => apiRequest<{ data: any }>(`/blogs/${id}`, { method: "GET" }),
  create: (data: { title: string; content: string; image?: string }) =>
    apiRequest("/blogs", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: { title?: string; content?: string; image?: string }) =>
    apiRequest(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/blogs/${id}`, { method: "DELETE" }),
};

// ============== CONTACTS API ==============
export const contactsAPI = {
  create: (data: { name: string; email: string; subject: string; message: string }) =>
    apiRequest("/contacts", { method: "POST", body: JSON.stringify(data) }),
  getAll: () => apiRequest<{ data: any[] }>("/contacts", { method: "GET", cache: "no-store" }),
};

// ============== SUBSCRIBERS API ==============
export const subscribersAPI = {
  subscribe: (email: string) =>
    apiRequest("/subscribers", { method: "POST", body: JSON.stringify({ email }) }),
  getAll: () => apiRequest<{ data: any[] }>("/subscribers", { method: "GET", cache: "no-store" }),
  getStats: () => apiRequest<{ data: any[] }>("/subscribers/stats", { method: "GET", cache: "no-store" }),
};

// ============== COUPONS API ==============
export const couponsAPI = {
  getActive: () => apiRequest<{ data: any[] }>("/coupons/active", { method: "GET", cache: "no-store" }),
  collect: (couponId: string) => apiRequest("/coupons/collect", { method: "POST", body: JSON.stringify({ couponId }) }),
  getMy: () => apiRequest<{ data: any[] }>("/coupons/my", { method: "GET", cache: "no-store" }),
  
  // Manager APIs
  getAll: () => apiRequest<{ data: any[] }>("/coupons", { method: "GET", cache: "no-store" }),
  create: (data: any) => apiRequest("/coupons", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest(`/coupons/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: string) => apiRequest(`/coupons/${id}`, { method: "DELETE" }),
};

export default apiRequest;
