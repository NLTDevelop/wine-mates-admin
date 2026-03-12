import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import i18n from 'i18next'
import { NameDescriptionDictionary, NameDictionary } from '@/modules/wine/create/general/entities/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const buildUrl = (url: string, params?: Record<string, string | number>): string => {
  if (!params) return url

  return Object.entries(params).reduce((result, [key, value]) => {
    const regex = new RegExp(`[\\{:]${key}\\}?`, 'g')
    return result.replace(regex, String(value))
  }, url)
}

export const buildUrlWithDate = (url: string, params?: Record<string, string | number>): string => {
  if (!params) return url

  let result = url

  if (params.id) {
    const idRegex = new RegExp(`[\\{:]id\\}?`, 'g')
    result = result.replace(idRegex, String(params.id))
  }

  if (params.date) {
    const dateRegex = new RegExp(`[\\{:]date\\}?`, 'g')
    result = result.replace(dateRegex, String(params.date))
  }

  return result
}

export const getCategoryLabel = (category: string): string => {
  const categoryLabels = {
    lover: i18n.t('users:lover'),
    expert: i18n.t('users:expert'),
    creator: i18n.t('users:creator'),
  }

  return categoryLabels[category as keyof typeof categoryLabels] || category
}

export const isDarkColor = (hexColor: string): boolean => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

export interface SortableColorItem {
  id: string
  value: string
  [key: string]: any
}

export const getColorBrightness = (hexColor: string): number => {
  try {
    if (!hexColor) return 255

    let hex = hexColor.trim().replace('#', '')

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    if (hex.length !== 6) {
      console.warn(`Invalid hex color: ${hexColor}`)
      return 255
    }

    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      console.warn(`Invalid RGB values in color: ${hexColor}`)
      return 255
    }

    return (r * 299 + g * 587 + b * 114) / 1000
  } catch (error) {
    console.warn(`Error processing color ${hexColor}:`, error)
    return 255
  }
}

export const sortColorsByBrightness = <T extends SortableColorItem>(items: T[], colorField: keyof T = 'value'): T[] => {
  if (!items || items.length === 0) return []

  const sorted = [...items]
    .map(item => {
      const colorValue = String(item[colorField] || '#ffffff')
      const brightness = getColorBrightness(colorValue)
      return { item, brightness }
    })
    .sort((a, b) => b.brightness - a.brightness)
    .map(({ item }) => item)

  return sorted
}

export const lightenColor = (hexColor: string, percent: number): string => {
  try {
    let hex = hexColor.replace('#', '')

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    if (hex.length !== 6) return hexColor

    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    const lighten = (channel: number) => Math.max(0, Math.min(255, Math.floor(channel + (255 - channel) * (percent / 100))))

    const lightenedR = lighten(r)
    const lightenedG = lighten(g)
    const lightenedB = lighten(b)

    const toHex = (channel: number) => channel.toString(16).padStart(2, '0')

    return `#${toHex(lightenedR)}${toHex(lightenedG)}${toHex(lightenedB)}`
  } catch {
    return hexColor
  }
}

export const isFile = (value: unknown): value is File => {
  return value instanceof File
}

export const isImageUrl = (value: unknown): value is string => {
  return typeof value === 'string' && value.length > 0
}

export const validateImageField = (value: unknown): value is File | string => {
  return isFile(value) || isImageUrl(value)
}

export const adaptFetchOptions = (fetchFn: (search?: string) => Promise<any[]>) => {
  return async (search?: string) => {
    const data = await fetchFn(search)
    return data.map(item => {
      let label = item.label

      if (!label) {
        const { nameUa } = getDisplayNames(item.translations || [])
        label = nameUa || item.nameUa || item.name
      }

      return {
        value: item.id || item.value,
        label: label,
      }
    })
  }
}

export interface DisplayNames {
  nameUa: string
  nameEn: string
}

export const getDisplayNames = (translations: NameDictionary[]): DisplayNames => {
  if (!translations || !Array.isArray(translations)) {
    return { nameUa: '', nameEn: '' }
  }

  const nameUa = translations.find(t => t.language === 'uk')?.name || ''
  const nameEn = translations.find(t => t.language === 'en')?.name || ''

  return { nameUa, nameEn }
}

export interface DisplayNameDescription extends DisplayNames {
  descriptionUa?: string
  descriptionEn?: string
}

export const getDisplayNameDescription = (translationsGroups?: NameDescriptionDictionary[][]): DisplayNameDescription => {
  if (!translationsGroups || !Array.isArray(translationsGroups)) {
    return { nameUa: '', nameEn: '', descriptionUa: '', descriptionEn: '' }
  }

  const allTranslations = translationsGroups.flat()

  let nameUa = ''
  let nameEn = ''
  let descriptionUa = ''
  let descriptionEn = ''

  for (const item of allTranslations) {
    if ('name' in item) {
      if (item.language === 'uk') nameUa = item.name
      if (item.language === 'en') nameEn = item.name
    } else if ('description' in item) {
      if (item.language === 'uk') descriptionUa = item.description
      if (item.language === 'en') descriptionEn = item.description
    }
  }

  return { nameUa, nameEn, descriptionUa, descriptionEn }
}

export const createTranslations = (nameUa: string, nameEn: string, prev?: NameDictionary[]): NameDictionary[] => {
  const ukPrev = prev?.find(t => t.language === 'uk')
  const enPrev = prev?.find(t => t.language === 'en')

  return [
    { id: ukPrev?.id, name: nameUa, language: 'uk' },
    { id: enPrev?.id, name: nameEn, language: 'en' },
  ]
}

export const arraysEqual = <T>(a: T[], b: T[], comparator?: (itemA: T, itemB: T) => boolean): boolean => {
  if (a.length !== b.length) return false

  if (comparator) {
    const sortedA = [...a].sort((x, y) => {
      const xId = (x as any).id ?? ''
      const yId = (y as any).id ?? ''
      return String(xId).localeCompare(String(yId))
    })
    const sortedB = [...b].sort((x, y) => {
      const xId = (x as any).id ?? ''
      const yId = (y as any).id ?? ''
      return String(xId).localeCompare(String(yId))
    })
    return sortedA.every((item, index) => comparator(item, sortedB[index]))
  }

  const sortedA = [...a].sort((x, y) => {
    const xId = (x as any).id ?? ''
    const yId = (y as any).id ?? ''
    return String(xId).localeCompare(String(yId))
  })

  const sortedB = [...b].sort((x, y) => {
    const xId = (x as any).id ?? ''
    const yId = (y as any).id ?? ''
    return String(xId).localeCompare(String(yId))
  })

  return sortedA.every((item, index) => {
    const other = sortedB[index]

    if (typeof item === 'object' && item !== null && typeof other === 'object' && other !== null) {
      if ('id' in item && 'id' in other) {
        return String((item as any).id) === String((other as any).id)
      }
      const itemStr = JSON.stringify(item, Object.keys(item as any).sort())
      const otherStr = JSON.stringify(other, Object.keys(other as any).sort())
      return itemStr === otherStr
    }

    return item === other
  })
}

export const areNestedArrEqual = (a: any[], b: any[]): boolean => {
  if (a.length !== b.length) return false

  const norm = (id: any) => (id != null ? String(id) : '')

  const sortedA = [...a].sort((x, y) => norm(x.id).localeCompare(norm(y.id)))
  const sortedB = [...b].sort((x, y) => norm(x.id).localeCompare(norm(y.id)))

  return sortedA.every((itemA, index) => {
    const itemB = sortedB[index]

    if (norm(itemA.id) !== norm(itemB.id)) return false

    const translationsEqual = areTranslationsEqual(itemA.translations || [], itemB.translations || [])

    return translationsEqual
  })
}

const areTranslationsEqual = (a: NameDictionary[], b: NameDictionary[]): boolean => {
  if (a.length !== b.length) return false

  const sortedA = [...a].sort((x, y) => x.language.localeCompare(y.language))
  const sortedB = [...b].sort((x, y) => x.language.localeCompare(y.language))

  return sortedA.every((transA, index) => {
    const transB = sortedB[index]
    return transA.language === transB.language && transA.name === transB.name
  })
}