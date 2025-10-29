import { createWithEqualityFn } from 'zustand/traditional'
import { devtools } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'

export const createStoreDevToolsWrapper = <T>(store: (set: any, get: any) => T, name?: string) => {
  return createWithEqualityFn<T>()(
    devtools(store, {
      name: name || 'Zustand Store',
      enabled: process.env.NODE_ENV !== 'production',
    }),
    shallow
  )
}
