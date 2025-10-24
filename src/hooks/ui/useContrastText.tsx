import { isDarkColor } from '@/lib/utils'

export const useContrastText = (hexColor: string | undefined | null) => {
  if (!hexColor) {
    return {
      textColorClass: 'text-foreground',
      mutedTextColorClass: 'text-muted-foreground',
    }
  }

  const isDark = isDarkColor(hexColor)

  const textColorClass = isDark ? 'text-white' : 'text-foreground'

  const mutedTextColorClass = isDark ? 'text-gray-300' : 'text-muted-foreground'

  return { textColorClass, mutedTextColorClass }
}
