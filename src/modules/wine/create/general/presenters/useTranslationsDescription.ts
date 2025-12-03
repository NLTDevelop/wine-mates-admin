import { useState, useEffect, useCallback } from 'react'
import { Language, NameDescriptionDictionary } from '../entities/types'
import { AVAILABLE_LANGUAGES } from '@/constatnts/avialable-languages'

interface AdditionalDescription {
  id: string | number
  language: Language | ''
  value: string
}

interface UseTranslationsDescriptionProps {
  initialTranslations: NameDescriptionDictionary[][]
  additionalNameLanguages: Language[]
  onTranslationsChange: (translations: NameDescriptionDictionary[][]) => void
}

export const useTranslationsDescription = ({ initialTranslations, onTranslationsChange }: UseTranslationsDescriptionProps) => {
  const [originalDescriptions, setOriginalDescriptions] = useState<Map<Language, NameDescriptionDictionary>>(new Map())

  const extractInitial = useCallback((translations: NameDescriptionDictionary[][]) => {
    const flat = translations?.flat() || []
    const descriptionsMap = new Map<Language, NameDescriptionDictionary>()
    const additional: AdditionalDescription[] = []

    let descriptionUa = ''
    let descriptionEn = ''

    flat.forEach(item => {
      if ('description' in item) {
        descriptionsMap.set(item.language, item)

        if (item.language === 'uk') {
          descriptionUa = item.description
        } else if (item.language === 'en') {
          descriptionEn = item.description
        } else if (item.description.trim() !== '') {
          additional.push({
            id: item.id || `desc-${item.language}-${Date.now()}`,
            language: item.language,
            value: item.description,
          })
        }
      }
    })

    setOriginalDescriptions(descriptionsMap)
    return { descriptionUa, descriptionEn, additional }
  }, [])

  const [descriptionUa, setDescriptionUa] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [additionalDescriptions, setAdditionalDescriptions] = useState<AdditionalDescription[]>([])

  useEffect(() => {
    const extracted = extractInitial(initialTranslations)
    setDescriptionUa(extracted.descriptionUa)
    setDescriptionEn(extracted.descriptionEn)
    setAdditionalDescriptions(extracted.additional)
  }, [extractInitial])

  const buildTranslations = useCallback((): NameDescriptionDictionary[][] => {
    const result: NameDescriptionDictionary[] = []

    const getIdForLanguage = (lang: Language): string | number | undefined => {
      const originalDesc = originalDescriptions.get(lang)
      return originalDesc?.id
    }

    if (descriptionUa?.trim()) {
      const id = getIdForLanguage('uk')
      const item = {
        description: descriptionUa,
        language: 'uk' as Language,
      } as NameDescriptionDictionary

      if (id !== undefined) {
        ;(item as any).id = id
      }
      result.push(item)
    }

    if (descriptionEn?.trim()) {
      const id = getIdForLanguage('en')
      const item = {
        description: descriptionEn,
        language: 'en' as Language,
      } as NameDescriptionDictionary

      if (id !== undefined) {
        ;(item as any).id = id
      }
      result.push(item)
    }

    additionalDescriptions
      .filter(desc => desc.language && desc.value?.trim())
      .forEach(desc => {
        const lang = desc.language as Language
        const id = getIdForLanguage(lang)

        const item: NameDescriptionDictionary = {
          description: desc.value,
          language: lang,
        }
        const finalId = id || (desc.id && !String(desc.id).startsWith('ui-new-') ? desc.id : undefined)

        if (finalId !== undefined) {
          ;(item as any).id = finalId
        }

        result.push(item)
      })

    return result.length ? [result] : []
  }, [descriptionUa, descriptionEn, additionalDescriptions, originalDescriptions])

  useEffect(() => {
    const translations = buildTranslations()
    onTranslationsChange(translations)
  }, [buildTranslations])

  const handleAddDescription = useCallback(() => {
    setAdditionalDescriptions(prev => [
      ...prev,
      {
        id: `ui-new-${Date.now()}`,
        language: '',
        value: '',
      },
    ])
  }, [])

  const getAvailableDescriptionLanguages = useCallback(
    (currentId?: string) => {
      const fixedDescriptionLanguages: Language[] = []
      if (descriptionUa.trim()) fixedDescriptionLanguages.push('uk')
      if (descriptionEn.trim()) fixedDescriptionLanguages.push('en')

      const initialDescriptionLanguages: Language[] = []
      const flatInitial = initialTranslations?.flat() || []
      flatInitial.forEach(item => {
        if ('description' in item && item.language) {
          initialDescriptionLanguages.push(item.language)
        }
      })

      const additionalDescLanguages = additionalDescriptions
        .filter(d => {
          if (currentId) {
            const descIdStr = String(d.id)
            return descIdStr !== currentId && d.language
          }
          return d.language
        })
        .map(d => d.language as Language)

      const allUsedDescriptionLanguages = [...fixedDescriptionLanguages, ...initialDescriptionLanguages, ...additionalDescLanguages]
      const available = AVAILABLE_LANGUAGES.filter(lang => !allUsedDescriptionLanguages.includes(lang.code))

      return available
    },
    [additionalDescriptions, descriptionUa, descriptionEn, initialTranslations]
  )

  return {
    descriptionUa,
    descriptionEn,
    additionalDescriptions,
    handleDescriptionUaChange: setDescriptionUa,
    handleDescriptionEnChange: setDescriptionEn,
    handleAddDescription,
    handleRemoveDescription: (id: string) => setAdditionalDescriptions(prev => prev.filter(d => String(d.id) !== id)),
    handleDescriptionLanguageChange: (id: string, lang: Language) => setAdditionalDescriptions(prev => prev.map(d => (String(d.id) === id ? { ...d, language: lang } : d))),
    handleDescriptionValueChange: (id: string, value: string) => setAdditionalDescriptions(prev => prev.map(d => (String(d.id) === id ? { ...d, value } : d))),
    getAvailableDescriptionLanguages,
  }
}
