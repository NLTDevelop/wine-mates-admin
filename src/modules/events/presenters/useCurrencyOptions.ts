import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { eventQueries } from '../entities/event-queries'

export const useCurrencyOptions = () => {
  const currencyQuery = useQuery(eventQueries.currency())
  const { data: currencies, isLoading } = currencyQuery

  const fetchOptions = useCallback(() => {
    if (!currencies) return []

    return currencies.list.map(currency => ({
      value: currency,
      label: currency,
    }))
  }, [currencies])

  return {
    fetchOptions,
    isLoading,
    currencies: currencies?.list,
  }
}
