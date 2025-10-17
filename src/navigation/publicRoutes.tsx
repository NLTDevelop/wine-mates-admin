import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/modules/autorization/entities/auth-store'
import { JSX } from 'react'
import { PATHS } from './paths'
import { ADMIN_TOKEN } from '@/constatnts/locale-storage'

export const PublicRoutes = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const location = useLocation()
  const from = location.state?.from?.pathname || PATHS.HOME

  const token = localStorage.getItem(ADMIN_TOKEN)

  return isAuthenticated && token ? <Navigate to={from} replace /> : children
}
