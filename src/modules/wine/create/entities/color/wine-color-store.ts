import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineColorCategory, WineColor } from '../types/color'

interface WineColorStoreState {
  categories: WineColorCategory[]
  currentCategory: WineColorCategory | null
  currentColor: WineColor | null

  setCategories: (categories: WineColorCategory[]) => void
  setCurrentCategory: (category: WineColorCategory | null) => void
  setCurrentColor: (color: WineColor | null) => void
  addCategory: (category: WineColorCategory) => void
  updateCategory: (categoryId: string, updatedCategory: Partial<WineColorCategory>) => void
  deleteCategory: (categoryId: string) => void
  addColorToCategory: (categoryId: string, color: WineColor) => void
  updateColorInCategory: (categoryId: string, colorId: string, updatedColor: Partial<WineColor>) => void
  deleteColorFromCategory: (categoryId: string, colorId: string) => void

  getCategoryById: (categoryId: string) => WineColorCategory | undefined
  getColorById: (categoryId: string, colorId: string) => WineColor | undefined
}

export const useWineColorStore = createStoreDevToolsWrapper<WineColorStoreState>(
  (set, get) => ({
    categories: [],
    currentCategory: null,
    currentColor: null,

    setCategories: categories => set({ categories }, false, 'wineColors/setCategories'),

    setCurrentCategory: category => set({ currentCategory: category }, false, 'wineColors/setCurrentCategory'),

    setCurrentColor: color => set({ currentColor: color }, false, 'wineColors/setCurrentColor'),

    addCategory: category =>
      set(
        (state: WineColorStoreState) => ({
          categories: [...state.categories, category],
        }),
        false,
        'wineColors/addCategory'
      ),

    updateCategory: (categoryId, updatedCategory) =>
      set(
        (state: WineColorStoreState) => ({
          categories: state.categories.map(category => (category.id === categoryId ? { ...category, ...updatedCategory } : category)),
          currentCategory: state.currentCategory?.id === categoryId ? { ...state.currentCategory, ...updatedCategory } : state.currentCategory,
        }),
        false,
        'wineColors/updateCategory'
      ),

    deleteCategory: categoryId =>
      set(
        (state: WineColorStoreState) => ({
          categories: state.categories.filter(category => category.id !== categoryId),
          currentCategory: state.currentCategory?.id === categoryId ? null : state.currentCategory,
        }),
        false,
        'wineColors/deleteCategory'
      ),

    addColorToCategory: (categoryId, color) =>
      set(
        (state: WineColorStoreState) => ({
          categories: state.categories.map(category =>
            category.id === categoryId
              ? {
                  ...category,
                  colors: [...(category.colors || []), color],
                }
              : category
          ),
          currentCategory:
            state.currentCategory?.id === categoryId
              ? {
                  ...state.currentCategory,
                  colors: [...(state.currentCategory.colors || []), color],
                }
              : state.currentCategory,
        }),
        false,
        'wineColors/addColorToCategory'
      ),

    updateColorInCategory: (categoryId, colorId, updatedColor) =>
      set(
        (state: WineColorStoreState) => ({
          categories: state.categories.map(category =>
            category.id === categoryId
              ? {
                  ...category,
                  colors: category.colors?.map(color => (color.id === colorId ? { ...color, ...updatedColor } : color)),
                }
              : category
          ),
          currentCategory:
            state.currentCategory?.id === categoryId
              ? {
                  ...state.currentCategory,
                  colors: state.currentCategory.colors?.map(color => (color.id === colorId ? { ...color, ...updatedColor } : color)),
                }
              : state.currentCategory,
          currentColor: state.currentColor?.id === colorId ? { ...state.currentColor, ...updatedColor } : state.currentColor,
        }),
        false,
        'wineColors/updateColorInCategory'
      ),

    deleteColorFromCategory: (categoryId, colorId) =>
      set(
        (state: WineColorStoreState) => ({
          categories: state.categories.map(category =>
            category.id === categoryId
              ? {
                  ...category,
                  colors: category.colors?.filter(color => color.id !== colorId),
                }
              : category
          ),
          currentCategory:
            state.currentCategory?.id === categoryId
              ? {
                  ...state.currentCategory,
                  colors: state.currentCategory.colors?.filter(color => color.id !== colorId),
                }
              : state.currentCategory,
          currentColor: state.currentColor?.id === colorId ? null : state.currentColor,
        }),
        false,
        'wineColors/deleteColorFromCategory'
      ),

    getCategoryById: categoryId => {
      return get().categories.find((category: WineColorCategory) => category.id === categoryId)
    },

    getColorById: (categoryId, colorId) => {
      const category = get().categories.find((cat: WineColorCategory) => cat.id === categoryId)
      return category?.colors?.find((color: WineColor) => color.id === colorId)
    },
  }),
  'WineColorStore'
)
