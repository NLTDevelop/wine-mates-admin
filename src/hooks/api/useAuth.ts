import { authService } from '@/services'
import { useAuthStore } from '@/stores/auth-store'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useLogin = () => {
  const { login, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: authService.login,
    onMutate: () => setLoading(true),
    onSuccess: data => {
      login(data.user, data.token)
    },
    onError: () => {
      setLoading(false)
    },
    onSettled: () => {
      setLoading(false)
    },
  })
}

export const useLogout = () => {
  const { logout } = useAuthStore()

  return () => {
    authService.logout()
    logout()
  }
}

export const useValidateToken = () => {
  return useQuery({
    queryKey: ['validate-token'],
    queryFn: authService.validateToken,
    enabled: false,
    retry: false,
  })
}
