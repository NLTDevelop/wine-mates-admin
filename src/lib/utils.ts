import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import i18n from 'i18next'

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
