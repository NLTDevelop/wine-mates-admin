import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const createStoreDevToolsWrapper = <T>(store: (set: any, get: any) => T, name?: string) => {
  return create<T>()(
    devtools(store, {
      name: name || 'Zustand Store',
      enabled: process.env.NODE_ENV !== 'production',
    })
  )
}
