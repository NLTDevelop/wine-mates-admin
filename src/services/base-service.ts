import { API_CONFIG } from '@/config'

import axios from 'axios'

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status

    if (status === 422) {
      error.validationData = error.response.data.errors
    }

    if (status === 409) {
      error.conflictData = error.response.data
    }

    if (status === 429) {
      error.retryAfter = error.response.headers['retry-after']
    }

    const apiError = error instanceof Error ? error : new Error(error.message)
    Object.assign(apiError, error)

    return Promise.reject(apiError)
  }
)
