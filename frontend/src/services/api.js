import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.')
    }
    throw error
  }
)

export const askAI = async (question) => {
  try {
    const response = await api.post('/ask', { question })
    return response.data.response
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail)
    }
    throw new Error(error.message || 'Failed to connect to AI service')
  }
}

export const checkHealth = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    throw new Error('Health check failed')
  }
}