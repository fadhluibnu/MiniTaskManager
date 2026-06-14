import axios from 'axios'
import env from '@/config/env'

const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor — attach auth token if available
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — global error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling can be extended here
    return Promise.reject(error)
  }
)

export default httpClient
