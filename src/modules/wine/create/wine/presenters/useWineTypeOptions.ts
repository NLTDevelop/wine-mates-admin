import { useCallback, useEffect, useRef } from 'react'
import { WineType } from '../../wine-types/entities/types/wine-type'

interface UseWineTypeOptionsProps {
  cachedWineTypes: WineType[]
  initialWineTypeId?: number | null
  onWineTypeChange: (wineTypeId: string | null) => void
}

export const useWineTypeOptions = ({ 
  cachedWineTypes, 
  initialWineTypeId = null, 
  onWineTypeChange 
}: UseWineTypeOptionsProps) => {
  const wineTypeValue = initialWineTypeId?.toString() || ''

  const fetchOptions = useCallback(async (search?: string) => {
    const options = cachedWineTypes.map(wt => {
      const ukTranslation = wt.translations?.find(t => t.language === 'uk')
      const enTranslation = wt.translations?.find(t => t.language === 'en')
      
      let label = ''
      if (ukTranslation && enTranslation) {
        label = `${ukTranslation.name} (${enTranslation.name})`
      } else if (ukTranslation) {
        label = ukTranslation.name
      } else if (enTranslation) {
        label = enTranslation.name
      } else {
        label = wt.translations?.[0]?.name || `ID: ${wt.id}`
      }
      
      return {
        value: wt.id.toString(),
        label: label
      }
    })

    if (search && search.trim()) {
      const term = search.toLowerCase()
      return options.filter(opt => 
        opt.label.toLowerCase().includes(term)
      )
    }

    return options
  }, [cachedWineTypes])

  const prevValueRef = useRef(wineTypeValue)

  useEffect(() => {
    if (wineTypeValue !== prevValueRef.current) {
      onWineTypeChange(wineTypeValue || null)
      prevValueRef.current = wineTypeValue
    }
  }, [wineTypeValue, onWineTypeChange])

  return {
    wineTypeValue,
    fetchOptions,
  }
}