import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export const useAuthInit = () => {
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    localStorage.getItem('admin-token')
    localStorage.getItem('admin-user')
  }, [isAuthenticated])
}
