import { authService } from '@/services'
import { useAuthStore } from '@/stores/auth-store'
import { useMutation } from '@tanstack/react-query'

export const useLogin = () => {
  const { login, setLoading } = useAuthStore()

  return useMutation({
    mutationFn: authService.login,
    onMutate: () => setLoading(true),
    onSuccess: data => {
      login(data.accessToken, data.user)
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
