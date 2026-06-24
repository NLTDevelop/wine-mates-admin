import { API_CONFIG } from '@/config'
import { ADMIN_TOKEN } from '@/constatnts/locale-storage'

import axios from 'axios'

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem(ADMIN_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    let hasFiles = false
    for (const value of config.data.values()) {
      if (value instanceof File) {
        hasFiles = true
        break
      }
    }

    if (hasFiles) {
      delete config.headers['Content-Type']
    }
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
