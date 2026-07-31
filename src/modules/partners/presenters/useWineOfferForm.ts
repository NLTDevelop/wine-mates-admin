import { useQuery } from '@tanstack/react-query'
import { ChangeEvent, useState } from 'react'
import { eventsService } from '@/modules/events/entities/events-service'
import { WineSearchItem } from '@/modules/events/entities/types/wine-search.dto'

const WINE_SEARCH_LIMIT = 10

interface UseWineOfferFormProps {
  onSuccess: (data: { partnerId: number; wineId: number; price: number; currency: string; websiteUrl: string; quantity?: number }) => Promise<void>
  partnerId: number
  currencyOptions: string[]
  isOpen: boolean
}

export const useWineOfferForm = ({ onSuccess, partnerId, currencyOptions, isOpen }: UseWineOfferFormProps) => {
  const [formState, setFormState] = useState({
    wineId: '',
    price: '',
    currency: currencyOptions.includes('UAH') ? 'UAH' : currencyOptions[0] || 'UAH',
    websiteUrl: '',
    quantity: '',
  })
  const [formError, setFormError] = useState('')
  const [wineSearch, setWineSearch] = useState('')
  const [wineSearchPage, setWineSearchPage] = useState(1)
  const [selectedWineDetails, setSelectedWineDetails] = useState<WineSearchItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ price?: string; websiteUrl?: string; quantity?: string; wineId?: string }>({})

  const wineSearchQuery = useQuery({
    queryKey: ['partners', 'wine-search', wineSearch, wineSearchPage],
    queryFn: () =>
      eventsService.search({
        query: wineSearch,
        limit: WINE_SEARCH_LIMIT,
        offset: (wineSearchPage - 1) * WINE_SEARCH_LIMIT,
      }),
    enabled: isOpen,
    staleTime: 2000,
  })

  const isValidWebsiteUrl = (value: string) => {
    try {
      const url = new URL(value)
      return ['http:', 'https:'].includes(url.protocol)
    } catch {
      return false
    }
  }

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, price: event.target.value }))
    setFieldErrors(prev => ({ ...prev, price: undefined }))
  }

  const handleWebsiteUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, websiteUrl: event.target.value }))
    setFieldErrors(prev => ({ ...prev, websiteUrl: undefined }))
  }

  const handleSubmit = async (): Promise<boolean> => {
    const price = Number(formState.price)
    const websiteUrl = formState.websiteUrl.trim()
    const quantity = formState.quantity.trim() ? Number(formState.quantity) : undefined
    const errors: { price?: string; websiteUrl?: string; quantity?: string; wineId?: string } = {}

    if (Number.isNaN(price) || price <= 0) {
      errors.price = 'offers.price_required'
    }

    if (!websiteUrl) {
      errors.websiteUrl = 'offers.link_required'
    } else if (!isValidWebsiteUrl(websiteUrl)) {
      errors.websiteUrl = 'offers.link_invalid'
    }

    if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
      errors.quantity = 'offers.quantity_invalid'
    }

    const wineId = Number(formState.wineId)
    if (!wineId) {
      errors.wineId = 'offers.wine_required'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setFormError('') 
      return false
    }

    try {
      setIsSubmitting(true)
      setFormError('')
      setFieldErrors({})

      await onSuccess({
        partnerId,
        wineId,
        price,
        currency: formState.currency || 'UAH',
        websiteUrl,
        ...(quantity !== undefined ? { quantity } : {}),
      })

      return true
    } catch (error) {
      setFormError('offers.submit_error')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormState({
      wineId: '',
      price: '',
      currency: currencyOptions.includes('UAH') ? 'UAH' : currencyOptions[0] || 'UAH',
      websiteUrl: '',
      quantity: '',
    })
    setFormError('')
    setFieldErrors({})
    setWineSearch('')
    setWineSearchPage(1)
    setSelectedWineDetails(null)
  }

  const getLocationName = (location?: { name?: string } | string | null) => {
    if (!location) return ''
    return typeof location === 'string' ? location : location.name || ''
  }

  const wineOptions = wineSearchQuery.data?.rows || []
  const wineSearchTotalCount = wineSearchQuery.data?.count || 0
  const selectedWine = selectedWineDetails && String(selectedWineDetails.id) === formState.wineId ? selectedWineDetails : wineOptions.find(wine => String(wine.id) === formState.wineId)

  return {
    formState,
    setFormState,
    wineSearch,
    setWineSearch,
    wineSearchPage,
    setWineSearchPage,
    selectedWine,
    formError,
    setFormError,
    fieldErrors,
    isSubmitting,

    wineOptions,
    wineSearchTotalCount,
    isLoading: wineSearchQuery.isLoading,

    handlePriceChange,
    handleWebsiteUrlChange,
    handleSubmit,
    resetForm,
    getLocationName,
  }
}
