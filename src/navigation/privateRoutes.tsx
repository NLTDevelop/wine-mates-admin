import { Navigate, useLocation } from 'react-router-dom'
// import { useShallow } from '@/stores/useShallowStore'
import { useAuthStore } from '@/modules/autorization/entities/auth-store'
import { JSX } from 'react'
import { ADMIN_TOKEN } from '@/constatnts/locale-storage'

export const PrivateRoutes = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore()
  // const { isAuthenticated } = useShallow(useAuthStore, (state) => ({
  //   isAuthenticated: state.isAuthenticated,
  // }))

  const location = useLocation()

  const token = localStorage.getItem(ADMIN_TOKEN)

  return isAuthenticated && token ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}
