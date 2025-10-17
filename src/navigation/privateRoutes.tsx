import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { JSX } from 'react'

export const PrivateRoutes = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const location = useLocation()

  const token = localStorage.getItem('admin-token')

  return isAuthenticated && token ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}
