import { ADMIN_TOKEN, ADMIN_USER } from '@/constatnts/locale-storage'
import { User } from '@/modules/autorization/entities/types'
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
    localStorage.setItem(ADMIN_TOKEN, token)
    localStorage.setItem(ADMIN_USER, JSON.stringify(user))
    set({ user, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    localStorage.removeItem(ADMIN_TOKEN)
    localStorage.removeItem(ADMIN_USER)
    set({ user: null, isAuthenticated: false, isLoading: false })
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))

const storedToken = localStorage.getItem(ADMIN_TOKEN)
const storedUser = localStorage.getItem(ADMIN_USER)

if (storedToken && storedUser) {
  useAuthStore.setState({
    user: JSON.parse(storedUser),
    isAuthenticated: true,
  })
}
