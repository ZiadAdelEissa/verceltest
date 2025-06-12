import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  withCredentials: true, // Your backend base URL
  headers: {
    'Content-Type': 'application/json'
  }
})

// Auth APIs
export const registerUser = (userData) => API.post('/auth/register', userData)
export const loginUser = (credentials) => API.post('/auth/login', credentials)
export const updateUser = (id, userData) => API.put(`/auth/${id}`, userData)
export const deleteUser = (id) => API.delete(`/auth/${id}`)

// Product APIs
export const getProducts = () => API.get('/products')
export const getProductById = (id) => API.get(`/products/${id}`)
export const createProduct = (productData) => API.post('/products', productData)
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData)
export const deleteProduct = (id) => API.delete(`/products/${id}`)

// Package APIs
export const getPackages = () => API.get('/packages')
export const getPackageById = (id) => API.get(`/packages/${id}`)
export const createPackage = (packageData) => API.post('/packages',  packageData)
export const updatePackage = (id, packageData) => API.put(`/packages/${id}`, packageData)
export const deletePackage = (id) => API.delete(`/packages/${id}`)

// Booking APIs
export const getBookings = () => API.get('/bookings')
export const getBookingById = (id) => API.get(`/bookings/${id}`)
export const createBooking = (bookingData) => API.post('/bookings', bookingData)
export const updateBooking = (id, bookingData) => API.put(`/bookings/${id}`, bookingData)
export const deleteBooking = (id) => API.delete(`/bookings/${id}`)
export const scanQR = (bookingId) => API.post(`/bookings/scan/${bookingId}`)

// Add request interceptor for auth tokens if needed
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Add response interceptor for error handling
API.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.status === 401) {
    // Handle unauthorized access
    console.log('Unauthorized access - redirect to login')
  }
  return Promise.reject(error)
})

export default API