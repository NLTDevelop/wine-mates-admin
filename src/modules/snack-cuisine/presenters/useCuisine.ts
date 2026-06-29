import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { cuisineQueries } from '../enteties/cuisine-queries'
import { Country } from '@/modules/wine/create-wine/entities/types/location-types'
import { useCountryOptions } from '@/modules/wine/create-wine/presenters/useCountryOptions'
import { ReorderItem } from '@/modules/wine/create/general/entities/types'

export const useCuisine = () => {
  const [searchValue, setSearchValue] = useState<string>('')

  const [currentSelectedIds, setCurrentSelectedIds] = useState<number[]>([])

  const [originalSelectedIds, setOriginalSelectedIds] = useState<number[]>([])

  const { countries: allCuisines, isLoading: isAllCuisinesLoading } = useCountryOptions({})

  const savedCuisinesQuery = useQuery({ ...cuisineQueries.list() })

  const createMutation = cuisineQueries.useCreate()
  const reorderMutation = cuisineQueries.useReorder()

  const filteredCuisines = useMemo(() => {
    if (!searchValue.trim()) {
      return allCuisines
    }
    return allCuisines.filter(cuisine => cuisine.name.toLowerCase().includes(searchValue.toLowerCase()))
  }, [allCuisines, searchValue])

  useEffect(() => {
    if (savedCuisinesQuery.data) {
      const savedIds = savedCuisinesQuery.data.map((c: Country) => c.id)
      setOriginalSelectedIds(savedIds)
      setCurrentSelectedIds(savedIds)
    }
  }, [savedCuisinesQuery.data])

  const hasChanges = useMemo(() => {
    if (originalSelectedIds.length !== currentSelectedIds.length) return true

    const sortedOriginal = [...originalSelectedIds].sort((a, b) => a - b)
    const sortedCurrent = [...currentSelectedIds].sort((a, b) => a - b)

    return JSON.stringify(sortedOriginal) !== JSON.stringify(sortedCurrent)
  }, [originalSelectedIds, currentSelectedIds])

  const handleClearSearch = useCallback(() => {
    setSearchValue('')
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }, [])

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setCurrentSelectedIds(prev => {
      if (checked) {
        return [...prev, id]
      } else {
        return prev.filter(item => item !== id)
      }
    })
  }

  const handleSave = useCallback(() => {
    createMutation.mutate(
      { countryIds: currentSelectedIds },
      {
        onSuccess: () => {
          setOriginalSelectedIds([...currentSelectedIds])
        },
      }
    )
  }, [currentSelectedIds, createMutation])

  const handleRemove = useCallback(
    (id: number) => {
      const newIds = currentSelectedIds.filter(savedId => savedId !== id)
      setCurrentSelectedIds(newIds)

      createMutation.mutate(
        { countryIds: newIds },
        {
          onSuccess: () => {
            setOriginalSelectedIds([...newIds])
          },
        }
      )
    },
    [currentSelectedIds, createMutation]
  )

  const handleClearAll = useCallback(() => {
    setCurrentSelectedIds([])

    createMutation.mutate(
      { countryIds: [] },
      {
        onSuccess: () => {
          setOriginalSelectedIds([])
        },
      }
    )
  }, [createMutation])

  const handleReorder = useCallback(
    (reorderedCuisines: Country[]) => {
      const reorderItems: ReorderItem[] = reorderedCuisines.map((item, index) => ({
        id: item.id,
        sortNumber: index + 1,
      }))

      reorderMutation.mutate(reorderItems, {
        onSuccess: () => {
          const reorderedIds = reorderedCuisines.map(c => c.id)
          setOriginalSelectedIds(reorderedIds)
          setCurrentSelectedIds(reorderedIds)
        },
      })
    },
    [reorderMutation]
  )

  const selectedCount = currentSelectedIds.length
  const savedCuisines = savedCuisinesQuery.data ?? []
  const isLoading = savedCuisinesQuery.isLoading || isAllCuisinesLoading
  const isSaving = createMutation.isPending

  return {
    searchValue,
    selectedIds: currentSelectedIds,
    savedCuisines,
    filteredCuisines,
    selectedCount,
    hasChanges,
    isLoading,
    isSaving,
    isReordering: reorderMutation.isPending,
    handleClearSearch,
    handleSearchChange,
    handleCheckboxChange,
    handleSave,
    handleRemove,
    handleClearAll,
    handleReorder,
  }
}

