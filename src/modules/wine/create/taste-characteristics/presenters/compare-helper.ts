import { NameDescriptionDictionary, NameDictionary } from '../../general/entities/types'
import { LevelItem } from '../entities/taste-characteristics'

export const areLevelsEqual = (levels1: LevelItem[], levels2: LevelItem[]): boolean => {
  if (levels1.length !== levels2.length) {
    return false
  }

  const sorted1 = [...levels1].sort((x, y) => String(x.id ?? '').localeCompare(String(y.id ?? '')))
  const sorted2 = [...levels2].sort((x, y) => String(x.id ?? '').localeCompare(String(y.id ?? '')))

  const allEqual = sorted1.every((level1, index) => {
    const level2 = sorted2[index]
    if (level1.id !== level2.id) {
      return false
    }

    const translationsEqual = compareLevelTranslations(level1.translations, level2.translations)
    if (!translationsEqual) {
      return false
    }

    // const isEnabled1 = level1.isEnabled ?? true
    // const isEnabled2 = level2.isEnabled ?? true
    // if (isEnabled1 !== isEnabled2) {
    //   return false
    // }

    const sortNumber1 = level1.sortNumber ?? 0
    const sortNumber2 = level2.sortNumber ?? 0
    if (sortNumber1 !== sortNumber2) {
      return false
    }

    return true
  })

  return allEqual
}

export const compareLevelTranslations = (a: NameDictionary[] | undefined, b: NameDictionary[] | undefined): boolean => {
  const arrA = a || []
  const arrB = b || []

  if (arrA.length !== arrB.length) return false

  const sortedA = [...arrA].sort((x, y) => x.language.localeCompare(y.language))
  const sortedB = [...arrB].sort((x, y) => x.language.localeCompare(y.language))

  return sortedA.every((item, index) => {
    const other = sortedB[index]
    return item.language === other.language && item.name === other.name
  })
}

export const compareCharacteristicTranslations = (
  a: NameDescriptionDictionary[][] | NameDescriptionDictionary[] | undefined,
  b: NameDescriptionDictionary[][] | NameDescriptionDictionary[] | undefined
): boolean => {
  const normalizedA = normalizeTranslationsForComparison(a)
  const normalizedB = normalizeTranslationsForComparison(b)

  const mapA = new Map<string, { name?: string; description?: string }>()
  const mapB = new Map<string, { name?: string; description?: string }>()

  normalizedA.forEach(item => {
    const entry: { name?: string; description?: string } = {}
    if ('name' in item && item.name !== undefined) {
      entry.name = item.name
    }
    if ('description' in item && item.description !== undefined) {
      entry.description = item.description
    }
    mapA.set(item.language, entry)
  })

  normalizedB.forEach(item => {
    const entry: { name?: string; description?: string } = {}
    if ('name' in item && item.name !== undefined) {
      entry.name = item.name
    }
    if ('description' in item && item.description !== undefined) {
      entry.description = item.description
    }
    mapB.set(item.language, entry)
  })

  if (mapA.size !== mapB.size) {
    return false
  }

  for (const [language, entryA] of mapA) {
    const entryB = mapB.get(language)

    if (!entryB) {
      return false
    }

    const nameA = entryA.name || ''
    const nameB = entryB.name || ''
    if (nameA !== nameB) {
      return false
    }

    const descA = entryA.description || ''
    const descB = entryB.description || ''
    if (descA !== descB) {
      return false
    }
  }

  return true
}

const normalizeTranslationsForComparison = (data: NameDescriptionDictionary[][] | NameDescriptionDictionary[] | undefined): Array<{ language: string; name?: string; description?: string }> => {
  if (!data) return []

  let items: NameDescriptionDictionary[] = []

  if (Array.isArray(data)) {
    if (data.length > 0 && Array.isArray(data[0])) {
      items = (data as NameDescriptionDictionary[][]).flat()
    } else if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const firstItem = data[0] as any
      if ('language' in firstItem) {
        items = data as NameDescriptionDictionary[]
      }
    }
  }

  const groupedByLanguage = items.reduce(
    (acc, item) => {
      const language = (item as any).language

      if (!language) return acc

      if (!acc[language]) {
        acc[language] = { language }
      }

      if ('name' in item && item.name !== undefined) {
        acc[language].name = item.name
      }

      if ('description' in item && item.description !== undefined) {
        acc[language].description = item.description
      }

      return acc
    },
    {} as Record<string, { language: string; name?: string; description?: string }>
  )

  return Object.values(groupedByLanguage)
}
