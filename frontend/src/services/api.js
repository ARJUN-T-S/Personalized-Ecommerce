import axios from 'axios';

// Ensure backend URL is properly formatted whether VITE_API_BASE_URL is set or defaults to /api
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const getNormalizedBaseURL = (url) => {
  let trimmed = url.trim().replace(/\/+$/, '');
  if (trimmed.startsWith('http') && !trimmed.endsWith('/api')) {
    trimmed += '/api';
  }
  return trimmed;
};

const baseURL = getNormalizedBaseURL(rawBaseURL);

const API = axios.create({ baseURL });

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const admin = JSON.parse(localStorage.getItem('admin') || 'null');

  // Determine if request is admin-specific or page is under /admin
  const isAdminRoute =
    config.url?.includes('/admin') ||
    config.url === '/categories' ||
    (config.url === '/products' && config.method !== 'get') ||
    config.url === '/orders/store' ||
    config.url === '/ratings/store' ||
    window.location.pathname.startsWith('/admin');

  const token = isAdminRoute
    ? (admin?.token || user?.token)
    : (user?.token || admin?.token);

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/user/register', data);
export const loginUser = (data) => API.post('/auth/user/login', data);
export const registerAdmin = (data) => API.post('/auth/admin/register', data);
export const loginAdmin = (data) => API.post('/auth/admin/login', data);

// Users
export const updateUserProfile = (data) => API.put('/users/profile', data);
export const deleteUserProfile = () => API.delete('/users/profile');

// Admins / Stores
export const getAllAdmins = () => API.get('/admins');
export const getAdminById = (id) => API.get(`/admins/${id}`);
export const updateAdminProfile = (data) => API.put('/admins/profile', data);

// Categories
export const getCategoriesByStore = (adminId) => API.get(`/categories/store/${adminId}`);
export const getMyCategories = () => API.get('/categories');
export const createCategory = (data) => API.post('/categories', data);
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Products
export const getProductsByStore = (adminId, categoryId) =>
  API.get(`/products/store/${adminId}`, { params: categoryId ? { category: categoryId } : {} });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getMyProducts = () => API.get('/products');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Cart
export const getCart = (adminId) => API.get(`/carts/${adminId}`);
export const getMyCarts = () => API.get('/carts');
export const addToCart = (data) => API.post('/carts', data);
export const updateCartItem = (adminId, productId, quantity) =>
  API.put(`/carts/${adminId}/items/${productId}`, { quantity });
export const removeCartItem = (adminId, productId) => API.delete(`/carts/${adminId}/items/${productId}`);
export const clearCart = (adminId) => API.delete(`/carts/${adminId}`);

// Orders
export const placeOrder = (adminId) => API.post('/orders', { adminId });
export const getMyOrders = () => API.get('/orders/my');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getStoreOrders = () => API.get('/orders/store');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// Ratings
export const getProductRatings = (productId) => API.get(`/ratings/product/${productId}`);
export const createRating = (data) => API.post('/ratings', data);
export const updateRating = (id, data) => API.put(`/ratings/${id}`, data);
export const deleteRating = (id) => API.delete(`/ratings/${id}`);
export const getStoreRatings = () => API.get('/ratings/store');

export default API;
