export const WINE_COLORS_ENDPOINTS = {
  // === КАТЕГОРИИ ЦВЕТОВ ===
  CATEGORIES: '/wine-color-categories',
  CATEGORY_DETAIL: '/wine-color-categories/:categoryId',
  CREATE_CATEGORY: '/wine-color-categories',
  UPDATE_CATEGORY: '/wine-color-categories/:categoryId',
  DELETE_CATEGORY: '/wine-color-categories/:categoryId',

  // === ЦВЕТА В КАТЕГОРИЯХ ===
  CATEGORY_COLORS: '/wine-color-categories/:categoryId/colors',
  ADD_COLOR: '/wine-color-categories/:categoryId/colors',
  COLOR_DETAIL: '/wine-color-categories/:categoryId/colors/:colorId',
  UPDATE_COLOR: '/wine-color-categories/:categoryId/colors/:colorId',
  DELETE_COLOR: '/wine-color-categories/:categoryId/colors/:colorId',
} as const
