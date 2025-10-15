import { User } from '@/entities/auth'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: (user: User, token: string) => {
    localStorage.setItem('admin-token', token)
    localStorage.setItem('admin-user', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-user')
    set({ user: null, isAuthenticated: false })
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))

const storedUser = localStorage.getItem('admin-user')
if (storedUser) {
  useAuthStore.setState({
    user: JSON.parse(storedUser),
    isAuthenticated: true,
  })
}
