import { useCallback } from 'react'
import { IVintage } from '../entities/types/types'

interface UseVintageOptionsProps {
  vintages?: IVintage[]
}

export const useVintageOptions = ({ vintages = [] }: UseVintageOptionsProps) => {
  const fetchOptions = useCallback(
    async (search?: string) => {
      const options = vintages?.map(v => ({
        value: v.wineId.toString(),
        label: String(v.vintage),
      }))

      if (search && search.trim()) {
        const term = search.toLowerCase()
        return options.filter(opt => String(opt.label).includes(term))
      }

      return options
    },
    [vintages]
  )

  return {
    fetchOptions,
    vintages,
  }
}
