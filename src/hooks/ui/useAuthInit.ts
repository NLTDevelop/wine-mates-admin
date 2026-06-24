import { useEffect } from 'react'
import { useAuthStore } from '@/modules/autorization/entities/auth-store'
import { ADMIN_TOKEN, ADMIN_USER } from '@/constatnts/locale-storage'

export const useAuthInit = () => {
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    localStorage.getItem(ADMIN_TOKEN)
    localStorage.getItem(ADMIN_USER)
  }, [isAuthenticated])
}
