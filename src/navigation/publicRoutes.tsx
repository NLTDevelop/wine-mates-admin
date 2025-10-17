import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { JSX } from 'react'
import { PATHS } from './paths'

export const PublicRoutes = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const location = useLocation()
  const from = location.state?.from?.pathname || PATHS.HOME

  const token = localStorage.getItem('admin-token')

  return isAuthenticated && token ? <Navigate to={from} replace /> : children
}
