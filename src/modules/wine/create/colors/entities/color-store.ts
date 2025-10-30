// import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
// import { WineColorCategory, WineColor } from './types/color'

// interface WineColorStoreState {
//   categories: WineColorCategory[]
//   currentCategory: WineColorCategory | null
//   currentColor: WineColor | null

//   setCategories: (categories: WineColorCategory[]) => void
//   setCurrentCategory: (category: WineColorCategory | null) => void
//   setCurrentColor: (color: WineColor | null) => void
//   addCategory: (category: WineColorCategory) => void
//   updateCategory: (categoryId: string, updatedCategory: Partial<WineColorCategory>) => void
//   deleteCategory: (categoryId: string) => void
//   addColorToCategory: (categoryId: string, color: WineColor) => void
//   updateColorInCategory: (categoryId: string, colorId: string, updatedColor: Partial<WineColor>) => void
//   deleteColorFromCategory: (categoryId: string, colorId: string) => void

//   getCategoryById: (categoryId: string) => WineColorCategory | undefined
//   getColorById: (categoryId: string, colorId: string) => WineColor | undefined
// }

// export const useWineColorStore = createStoreDevToolsWrapper<WineColorStoreState>(
//   (set, get) => ({
//     categories: [],
//     currentCategory: null,
//     currentColor: null,

//     setCategories: categories => set({ categories }, false, 'wineColors/setCategories'),

//     setCurrentCategory: category => set({ currentCategory: category }, false, 'wineColors/setCurrentCategory'),

//     setCurrentColor: color => set({ currentColor: color }, false, 'wineColors/setCurrentColor'),

//     addCategory: category =>
//       set(
//         (state: WineColorStoreState) => ({
//           categories: [...state.categories, category],
//         }),
//         false,
//         'wineColors/addCategory'
//       ),

//     updateCategory: (categoryId, updatedCategory) =>
//       set(
//         (state: WineColorStoreState) => ({
//           categories: state.categories.map(category => (category.id === categoryId ? { ...category, ...updatedCategory } : category)),
//           currentCategory: state.currentCategory?.id === categoryId ? { ...state.currentCategory, ...updatedCategory } : state.currentCategory,
//         }),
//         false,
//         'wineColors/updateCategory'
//       ),

//     deleteCategory: categoryId =>
//       set(
//         (state: WineColorStoreState) => ({
//           categories: state.categories.filter(category => category.id !== categoryId),
//           currentCategory: state.currentCategory?.id === categoryId ? null : state.currentCategory,
//         }),
//         false,
//         'wineColors/deleteCategory'
//       ),

//     addColorToCategory: (categoryId, color) =>
//       set(
//         (state: WineColorStoreState) => ({
//           categories: state.categories.map(category =>
//             category.id === categoryId
//               ? {
//                   ...category,
//                   colors: [...(category.colors || []), color],
//                 }
//               : category
//           ),
//           currentCategory:
//             state.currentCategory?.id === categoryId
//               ? {
//                   ...state.currentCategory,
//                   colors: [...(state.currentCategory.colors || []), color],
//                 }
//               : state.currentCategory,
//         }),
//         false,
//         'wineColors/addColorToCategory'
//       ),

//     updateColorInCategory: (categoryId, colorId, updatedColor) =>
//       set(
//         (state: WineColorStoreState) => ({
//           categories: state.categories.map(category =>
//             category.id === categoryId
//               ? {
//                   ...category,
//                   colors: category.colors?.map(color => (color.id === colorId ? { ...color, ...updatedColor } : color)),
//                 }
//               : category
//           ),
//           currentCategory:
//             state.currentCategory?.id === categoryId
//               ? {
//                   ...state.currentCategory,
//                   colors: state.currentCategory.colors?.map(color => (color.id === colorId ? { ...color, ...updatedColor } : color)),
//                 }
//               : state.currentCategory,
//           currentColor: state.currentColor?.id === colorId ? { ...state.currentColor, ...updatedColor } : state.currentColor,
//         }),
//         false,
//         'wineColors/updateColorInCategory'
//       ),

//     deleteColorFromCategory: (categoryId, colorId) =>
//       set(
//         (state: WineColorStoreState) => ({
//           categories: state.categories.map(category =>
//             category.id === categoryId
//               ? {
//                   ...category,
//                   colors: category.colors?.filter(color => color.id !== colorId),
//                 }
//               : category
//           ),
//           currentCategory:
//             state.currentCategory?.id === categoryId
//               ? {
//                   ...state.currentCategory,
//                   colors: state.currentCategory.colors?.filter(color => color.id !== colorId),
//                 }
//               : state.currentCategory,
//           currentColor: state.currentColor?.id === colorId ? null : state.currentColor,
//         }),
//         false,
//         'wineColors/deleteColorFromCategory'
//       ),

//     getCategoryById: categoryId => {
//       return get().categories.find((category: WineColorCategory) => category.id === categoryId)
//     },

//     getColorById: (categoryId, colorId) => {
//       const category = get().categories.find((cat: WineColorCategory) => cat.id === categoryId)
//       return category?.colors?.find((color: WineColor) => color.id === colorId)
//     },
//   }),
//   'WineColorStore'
// )
import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineColor } from './types/color'

interface ColorStoreState {
  colors: WineColor[]
  searchResults: WineColor[]
  currentColor: WineColor | null
  shades: WineColor[]

  setColors: (colors: WineColor[]) => void
  setCurrentColor: (color: WineColor | null) => void
  addColor: (color: WineColor) => void
  updateColor: (colorId: string, newColor: WineColor) => void
  deleteColor: (colorId: string) => void
  searchColors: (searchTerm: string) => void
  clearSearch: () => void

  setShades: (shades: WineColor[]) => void
  addShade: (shade: WineColor) => void
  updateShade: (shadeId: string, newShade: WineColor) => void
  deleteShade: (shadeId: string) => void

  getColorById: (id: string) => WineColor | undefined
  getColorByValue: (value: string) => WineColor | undefined // НОВЫЙ метод
  hasColor: (id: string) => boolean
  hasColorByValue: (value: string) => boolean // НОВЫЙ метод
  getShadeById: (id: string) => WineColor | undefined
}

export const useColorStore = createStoreDevToolsWrapper<ColorStoreState>(
  (set, get) => ({
    colors: [],
    searchResults: [],
    currentColor: null,
    shades: [],

    setColors: colors => set({ colors }, false, 'colors/setColors'),

    setCurrentColor: color => set({ currentColor: color }, false, 'colors/setCurrentColor'),

    addColor: color =>
      set(
        (state: ColorStoreState) => ({
          colors: [...state.colors, color],
        }),
        false,
        'colors/addColor'
      ),

    updateColor: (colorId, newColor) =>
      set(
        (state: ColorStoreState) => ({
          colors: state.colors.map(c => (c.id === colorId ? newColor : c)),
          currentColor: state.currentColor?.id === colorId ? newColor : state.currentColor,
          searchResults: state.searchResults.map(c => (c.id === colorId ? newColor : c)),
        }),
        false,
        'colors/updateColor'
      ),

    deleteColor: colorId =>
      set(
        (state: ColorStoreState) => ({
          colors: state.colors.filter(c => c.id !== colorId),
          currentColor: state.currentColor?.id === colorId ? null : state.currentColor,
          searchResults: state.searchResults.filter(c => c.id !== colorId),
        }),
        false,
        'colors/deleteColor'
      ),

    searchColors: searchTerm =>
      set(
        (state: ColorStoreState) => ({
          searchResults: state.colors.filter(c => 
            c.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.labelEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.value.toLowerCase().includes(searchTerm.toLowerCase()) // ДОБАВЛЕН поиск по hex значению
          ),
        }),
        false,
        'colors/searchColors'
      ),

    clearSearch: () => set({ searchResults: [] }, false, 'colors/clearSearch'),

    setShades: shades => set({ shades }, false, 'colors/setShades'),

    addShade: shade =>
      set(
        (state: ColorStoreState) => ({
          shades: [...state.shades, shade],
        }),
        false,
        'colors/addShade'
      ),

    updateShade: (shadeId, newShade) =>
      set(
        (state: ColorStoreState) => ({
          shades: state.shades.map(s => (s.id === shadeId ? newShade : s)),
        }),
        false,
        'colors/updateShade'
      ),

    deleteShade: shadeId =>
      set(
        (state: ColorStoreState) => ({
          shades: state.shades.filter(s => s.id !== shadeId),
        }),
        false,
        'colors/deleteShade'
      ),

    getColorById: id => {
      return get().colors.find((c: WineColor) => c.id === id)
    },

    getColorByValue: value => {
      return get().colors.find((c: WineColor) => c.value === value)
    },

    hasColor: id => {
      return get().colors.some((c: WineColor) => c.id === id)
    },

    hasColorByValue: value => {
      return get().colors.some((c: WineColor) => c.value === value)
    },

    getShadeById: id => {
      return get().shades.find((s: WineColor) => s.id === id)
    },
  }),
  'ColorStore'
)