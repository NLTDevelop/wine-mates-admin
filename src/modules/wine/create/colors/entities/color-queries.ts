// import { wineColorService } from './color-service'
// import { CreateCategoryParams, UpdateCategoryParams, CreateColorParams, UpdateColorParams } from './types/color'

// export const wineColorQueries = {
//   // === КАТЕГОРИИ ===
//   categories: {
//     list: () => ({
//       queryKey: ['wine-color-categories', 'list'],
//       queryFn: () => wineColorService.listCategories(),
//     }),

//     detail: (categoryId: string) => ({
//       queryKey: ['wine-color-categories', 'detail', categoryId],
//       queryFn: () => wineColorService.getCategory(categoryId),
//     }),

//     create: () => ({
//       mutationKey: ['wine-color-categories', 'create'],
//       mutationFn: (params: CreateCategoryParams) => wineColorService.createCategory(params),
//     }),

//     update: () => ({
//       mutationKey: ['wine-color-categories', 'update'],
//       mutationFn: (params: UpdateCategoryParams) => wineColorService.updateCategory(params),
//     }),

//     delete: () => ({
//       mutationKey: ['wine-color-categories', 'delete'],
//       mutationFn: (categoryId: string) => wineColorService.deleteCategory(categoryId),
//     }),
//   },

//   // === ЦВЕТА (подкатегории) ===
//   colors: {
//     list: (categoryId: string) => ({
//       queryKey: ['wine-colors', 'list', categoryId],
//       queryFn: () => wineColorService.getCategoryColors(categoryId),
//     }),

//     detail: (categoryId: string, colorId: string) => ({
//       queryKey: ['wine-colors', 'detail', categoryId, colorId],
//       queryFn: () => wineColorService.getColor(categoryId, colorId),
//     }),

//     create: () => ({
//       mutationKey: ['wine-colors', 'create'],
//       mutationFn: (params: CreateColorParams) => wineColorService.addColor(params),
//     }),

//     update: () => ({
//       mutationKey: ['wine-colors', 'update'],
//       mutationFn: (params: UpdateColorParams) => wineColorService.updateColor(params),
//     }),

//     delete: () => ({
//       mutationKey: ['wine-colors', 'delete'],
//       mutationFn: ({ categoryId, colorId }: { categoryId: string; colorId: string }) => wineColorService.deleteColor(categoryId, colorId),
//     }),
//   },
// }
import { colorService } from './color-service'
import { CreateWineColorParams, UpdateWineColorParams } from './types/color'

export const colorQueries = {
  list: () => ({
    queryKey: ['colors', 'list'],
    queryFn: () => colorService.list(),
  }),

  create: () => ({
    mutationKey: ['colors', 'create'],
    mutationFn: (color: CreateWineColorParams) => colorService.create(color),
  }),

  update: () => ({
    mutationKey: ['colors', 'update'],
    mutationFn: (params: UpdateWineColorParams) => colorService.update(params),
  }),

  delete: () => ({
    mutationKey: ['colors', 'delete'],
    mutationFn: (colorId: string) => colorService.delete(colorId),
  }),

  listShades: (colorId?: string) => ({
    queryKey: colorId ? ['colors', colorId, 'shades'] : ['shades', 'list'],
    queryFn: () => colorService.listShades(colorId),
  }),

  createShade: () => ({
    mutationKey: ['shades', 'create'],
    mutationFn: ({ colorId, shade }: { colorId: string; shade: CreateWineColorParams }) => 
      colorService.createShade(colorId, shade),
  }),
}