import { api } from '@/services'
import { buildUrl } from '@/lib/utils'
import { WineColorCategory, WineColor, CreateCategoryParams, UpdateCategoryParams, CreateColorParams, UpdateColorParams } from '../types/color'
import { WINE_COLORS_ENDPOINTS } from './wine-colors-endpoints'

export const wineColorService = {
  listCategories: (): Promise<WineColorCategory[]> => api.get(WINE_COLORS_ENDPOINTS.CATEGORIES).then(response => response.data),

  getCategory: (categoryId: string): Promise<WineColorCategory> => api.get(buildUrl(WINE_COLORS_ENDPOINTS.CATEGORY_DETAIL, { categoryId })).then(response => response.data),

  createCategory: (params: CreateCategoryParams): Promise<WineColorCategory> => api.post(WINE_COLORS_ENDPOINTS.CREATE_CATEGORY, params).then(response => response.data),

  updateCategory: ({ categoryId, data }: UpdateCategoryParams): Promise<WineColorCategory> =>
    api.patch(buildUrl(WINE_COLORS_ENDPOINTS.UPDATE_CATEGORY, { categoryId }), data).then(response => response.data),

  deleteCategory: (categoryId: string): Promise<void> => api.delete(buildUrl(WINE_COLORS_ENDPOINTS.DELETE_CATEGORY, { categoryId })),

  getCategoryColors: (categoryId: string): Promise<WineColor[]> => api.get(buildUrl(WINE_COLORS_ENDPOINTS.CATEGORY_COLORS, { categoryId })).then(response => response.data),

  addColor: ({ categoryId, data }: CreateColorParams): Promise<WineColor> => api.post(buildUrl(WINE_COLORS_ENDPOINTS.ADD_COLOR, { categoryId }), data).then(response => response.data),

  getColor: (categoryId: string, colorId: string): Promise<WineColor> => api.get(buildUrl(WINE_COLORS_ENDPOINTS.COLOR_DETAIL, { categoryId, colorId })).then(response => response.data),

  updateColor: ({ categoryId, colorId, data }: UpdateColorParams): Promise<WineColor> =>
    api.patch(buildUrl(WINE_COLORS_ENDPOINTS.UPDATE_COLOR, { categoryId, colorId }), data).then(response => response.data),

  deleteColor: (categoryId: string, colorId: string): Promise<void> => api.delete(buildUrl(WINE_COLORS_ENDPOINTS.DELETE_COLOR, { categoryId, colorId })),
}
