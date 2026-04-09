import { useCountryOptions } from '@/modules/wine/create-wine/presenters/useCountryOptions'
import { useTranslation } from 'react-i18next'

export const useEventFilters = () => {
  const { t } = useTranslation('events')
  const { countries, isLoading: isCountriesLoading } = useCountryOptions({})

  const getIsActiveFilterOptions = () => {
    return [
      { label: t('active_event'), value: true },
      { label: t('inactive'), value: false },
    ]
  }

  const getCountryFilterOptions = () => {
    if (!countries || countries.length === 0) return []

    return countries.map(country => ({
      label: country.name,
      value: country.id,
    }))
  }

  const getFilterLabel = (column: string, value: any): string => {
    if (value === null || value === undefined) return ''

    switch (column) {
      case 'countryId':
      case 'country':
        const country = countries?.find(c => c.id === value)
        return country?.name || value.toString()
      case 'isActive':
        return value === true ? t('active_event') : t('inactive')
      default:
        return value.toString()
    }
  }

  return {
    isLoading: isCountriesLoading,
    error: null,
    getIsActiveFilterOptions,
    getCountryFilterOptions,
    getFilterLabel,
  }
}
