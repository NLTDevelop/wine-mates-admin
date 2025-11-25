import { useState, useEffect } from 'react'
import { createTranslations, getDisplayNames } from '@/lib/utils'
import { Language, NameDictionary } from '../entities/types'
import { AVAILABLE_LANGUAGES } from '@/constatnts/avialable-languages'

interface AdditionalTranslation {
  id: string
  language: Language | ''
  value: string
}

interface UseTranslationsProps {
  initialTranslations: NameDictionary[]
  onTranslationsChange: (translations: NameDictionary[]) => void
}

export const useTranslationsName = ({ initialTranslations, onTranslationsChange }: UseTranslationsProps) => {
  const { nameUa, nameEn } = getDisplayNames(initialTranslations || [])
  const [additionalTranslations, setAdditionalTranslations] = useState<AdditionalTranslation[]>([])

  useEffect(() => {
    const additional = (initialTranslations || [])
      .filter(translation => translation.language !== 'uk' && translation.language !== 'en')
      .map(translation => ({
        id: `${translation.language}-${Date.now()}`,
        language: translation.language,
        value: translation.name,
      }))
    setAdditionalTranslations(additional)
  }, [])

  useEffect(() => {
    const mainTranslations = createTranslations(nameUa, nameEn)
    const validAdditionalTranslations = additionalTranslations
      .filter((translation): translation is AdditionalTranslation & { language: Language } => translation.language !== '' && translation.value !== '')
      .map(translation => ({
        name: translation.value,
        language: translation.language,
      }))

    const allTranslations: NameDictionary[] = [...mainTranslations, ...validAdditionalTranslations]

    onTranslationsChange(allTranslations)
  }, [nameUa, nameEn, additionalTranslations])

  const handleNameUaChange = (value: string) => {
    const updatedTranslations = createTranslations(value, nameEn)
    onTranslationsChange(updatedTranslations)
  }

  const handleNameEnChange = (value: string) => {
    const updatedTranslations = createTranslations(nameUa, value)
    onTranslationsChange(updatedTranslations)
  }

  const handleAddTranslation = () => {
    const newTranslation: AdditionalTranslation = {
      id: Date.now().toString(),
      language: '',
      value: '',
    }
    setAdditionalTranslations(prev => [...prev, newTranslation])
  }

  const handleRemoveTranslation = (id: string) => {
    setAdditionalTranslations(prev => prev.filter(translation => translation.id !== id))
  }

  const handleLanguageChange = (id: string, language: Language) => {
    setAdditionalTranslations(prev => prev.map(translation => (translation.id === id ? { ...translation, language } : translation)))
  }

  const handleTranslationValueChange = (id: string, value: string) => {
    setAdditionalTranslations(prev => prev.map(translation => (translation.id === id ? { ...translation, value } : translation)))
  }

  const getAvailableLanguages = (currentTranslationId?: string) => {
    const usedLanguages = additionalTranslations.filter(translation => translation.id !== currentTranslationId && translation.language !== '').map(translation => translation.language as Language)

    return AVAILABLE_LANGUAGES.filter(lang => !usedLanguages.includes(lang.code) && lang.code !== 'uk' && lang.code !== 'en')
  }

  return {
    nameUa,
    nameEn,
    additionalTranslations,
    handleNameUaChange,
    handleNameEnChange,
    handleAddTranslation,
    handleRemoveTranslation,
    handleLanguageChange,
    handleTranslationValueChange,
    getAvailableLanguages,
  }
}
