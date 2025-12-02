import { CreateTranslation, UpdateTranslation } from '../../taste-characteristics/entities/taste-characteristics'
import { NameDescriptionDictionary, NameDictionary } from '../entities/types'

export interface DisplayNames {
  nameUa: string
  nameEn: string
}

export interface DisplayNameDescription extends DisplayNames {
  descriptionUa?: string
  descriptionEn?: string
}

export const getDisplayNames = (translations: NameDictionary[]): DisplayNames => {
  if (!translations || !Array.isArray(translations)) {
    return { nameUa: '', nameEn: '' }
  }

  const nameUa = translations.find(t => t.language === 'uk')?.name || ''
  const nameEn = translations.find(t => t.language === 'en')?.name || ''

  return { nameUa, nameEn }
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

export const extractNamesFromTranslations = (translations: NameDescriptionDictionary[][]): NameDictionary[] => {
  if (!translations || !Array.isArray(translations)) {
    return []
  }

  const flattened = translations.flat()
  return flattened
    .filter((item): item is NameDescriptionDictionary & { name: string } => 'name' in item)
    .map(item => ({
      id: item.id,
      name: item.name,
      language: item.language,
    }))
}

export const extractDescriptionsFromTranslations = (translations: NameDescriptionDictionary[][]): NameDescriptionDictionary[][] => {
  if (!translations || !Array.isArray(translations)) {
    return []
  }

  const descriptions = translations
    .flat()
    .filter((item): item is NameDescriptionDictionary & { description: string } => 'description' in item)
    .map(item => item)

  return descriptions.length > 0 ? [descriptions] : []
}

export const mergeTranslations = (names: NameDictionary[], descriptions: NameDescriptionDictionary[][]): NameDescriptionDictionary[][] => {
  const nameTranslations: NameDescriptionDictionary[] = names.map(name => ({
    id: name.id,
    name: name.name,
    language: name.language,
  }))

  const descriptionTranslations = descriptions.flat()

  const result: NameDescriptionDictionary[][] = []
  if (nameTranslations.length > 0) result.push(nameTranslations)
  if (descriptionTranslations.length > 0) result.push(descriptionTranslations)

  return result
}

export const convertToCreateTranslations = (translations?: NameDescriptionDictionary[][]): CreateTranslation[] => {
  if (!translations) return []

  const flattened = translations.flat()
  return flattened.map(trans => {
    if ('name' in trans) {
      return {
        name: trans.name,
        language: trans.language,
      }
    } else {
      return {
        description: trans.description,
        language: trans.language,
      }
    }
  })
}

export const convertToUpdateTranslations = (translations?: NameDescriptionDictionary[][]): UpdateTranslation[] => {
  if (!translations) return []

  const flattened = translations.flat()

  const result = flattened.map(trans => {
    const id = trans.id

    const isTemporaryId = typeof id === 'string' && (id.startsWith('ui-new-') || id.startsWith('temp-') || id.startsWith('desc-'))

    if ('name' in trans) {
      return {
        ...(id && !isTemporaryId && { id }),
        name: trans.name,
        language: trans.language,
      } as UpdateTranslation
    } else {
      return {
        ...(id && !isTemporaryId && { id }),
        description: trans.description,
        language: trans.language,
      } as UpdateTranslation
    }
  })

  return result
}
