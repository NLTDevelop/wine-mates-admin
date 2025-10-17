import { User } from '@/entities/auth'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user?: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: (token: string, user?: User) => {
    localStorage.setItem('admin-token', token)
    localStorage.setItem('admin-user', JSON.stringify(user))
    set({ user, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    localStorage.removeItem('admin-token')
    localStorage.removeItem('admin-user')
    set({ user: null, isAuthenticated: false, isLoading: false })
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))

const storedToken = localStorage.getItem('admin-token')
const storedUser = localStorage.getItem('admin-user')

if (storedToken && storedUser) {
  useAuthStore.setState({
    user: JSON.parse(storedUser),
    isAuthenticated: true,
  })
}
