import { useReorderList } from './useReorderList'

export const useReorderListColors = () => useReorderList({ queryKey: ['colors'] })

export const useReorderListFlavors = () => useReorderList({ queryKey: ['flavors'] })

export const useReorderListTastes = () => useReorderList({ queryKey: ['tastes'] })

export const useReorderListTasteCharacteristics = () => useReorderList({ queryKey: ['taste-characteristics'] })

export const useReorderListWineTypes = () => useReorderList({ queryKey: ['wine-types'] })
