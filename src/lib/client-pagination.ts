import { DEFAULT_PAGINATION_LIMIT } from '@/constatnts/navigation'
import { DataResponse } from '@/modules/wine/create/general/entities/types'

export interface FiltersParams {
  search?: string
  limit?: number
  offset?: number
  include?: string[]
  searchFields?: string[]
}

export const applyClientPagination = <T extends object>(data: T[], filters: FiltersParams = {}): DataResponse<T> => {
  if (!Array.isArray(data)) {
    return { rows: [], count: 0 }
  }

  let filteredData = data

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()

    filteredData = data.filter(item => {
      if (filters.searchFields && filters.searchFields.length > 0) {
        return filters.searchFields.some(field => {
          const value = item[field as keyof T]
          return value?.toString().toLowerCase().includes(searchLower)
        })
      }

      const itemAny = item as any
      return (
        (itemAny.nameUa && itemAny.nameUa.toLowerCase().includes(searchLower)) ||
        (itemAny.nameEn && itemAny.nameEn.toLowerCase().includes(searchLower)) ||
        (itemAny.name && itemAny.name.toLowerCase().includes(searchLower))
      )
    })
  }

  const start = filters.offset || 0
  const end = start + (filters.limit || DEFAULT_PAGINATION_LIMIT)
  const paginatedData = filteredData.slice(start, end)

  return {
    rows: paginatedData,
    count: filteredData.length,
  }
}

export const applyWineTypePagination = (data: any[], filters: FiltersParams = {}) => {
  return applyClientPagination(data, {
    ...filters,
    searchFields: ['nameUa', 'nameEn'],
  })
}

export const applyColorPagination = (data: any[], filters: FiltersParams = {}) => {
  return applyClientPagination(data, {
    ...filters,
    searchFields: ['nameUa', 'nameEn', 'colorHex'], 
  })
}
export const applyAromaPagination = (data: any[], filters: FiltersParams = {}) => {
  return applyClientPagination(data, {
    ...filters,
    searchFields: ['nameUa', 'nameEn', 'colorHex'], 
  })
}
