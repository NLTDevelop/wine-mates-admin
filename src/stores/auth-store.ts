import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: any | null
  setToken: (token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token: string) => set({ token }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)