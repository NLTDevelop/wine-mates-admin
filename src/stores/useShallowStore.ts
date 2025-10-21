import { shallow } from 'zustand/shallow'

type StoreHook<T> = {
  <U>(selector: (state: T) => U, equals?: (a: U, b: U) => boolean): U
}

export function useShallow<T, U>(store: StoreHook<T>, selector: (state: T) => U): U {
  return store(selector, shallow)
}
