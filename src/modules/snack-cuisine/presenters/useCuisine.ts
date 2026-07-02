import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useMemo } from 'react'
import { Country } from '@/modules/wine/create-wine/entities/types/location-types'
import { cuisineQueries } from '../enteties/cuisine-queries'

export const useCuisine = () => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isReordering, setIsReordering] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: allCuisines = [], isLoading: isLoadingCuisines } = useQuery({
    ...cuisineQueries.cuisine_list(),
  })

  const {
    data: savedCuisines = [],
    isLoading: isLoadingSaved,
    refetch: refetchSaved,
  } = useQuery({
    ...cuisineQueries.result_list(),
  })

  const createMutation = cuisineQueries.useCreate()
  const reorderMutation = cuisineQueries.useReorder()

  useEffect(() => {
    if (savedCuisines.length > 0) {
      setSelectedIds(savedCuisines.map(c => c.id))
    } else {
      setSelectedIds([])
    }
  }, [savedCuisines])

  const filteredCuisines = useMemo(() => {
    if (!searchValue.trim()) return allCuisines
    const searchLower = searchValue.toLowerCase().trim()
    return allCuisines.filter(cuisine => cuisine.name.toLowerCase().includes(searchLower) || cuisine.code?.toLowerCase().includes(searchLower))
  }, [allCuisines, searchValue])

  const selectedCount = selectedIds.length
  const isSaving = createMutation.isPending
  const isLoading = isLoadingSaved || isLoadingCuisines

  const hasChanges = useMemo(() => {
    if (isUpdating) return false
    
    const savedIds = savedCuisines.map(c => c.id).sort()
    const currentIds = [...selectedIds].sort()
    return JSON.stringify(savedIds) !== JSON.stringify(currentIds)
  }, [savedCuisines, selectedIds, isUpdating])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchValue('')
  }

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedIds(prev => (checked ? [...prev, id] : prev.filter(itemId => itemId !== id)))
  }

  const handleSave = async () => {
    if (selectedIds.length === 0) return

    setIsUpdating(true)
    try {
      await createMutation.mutateAsync({ countryIds: selectedIds })
      await refetchSaved()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async (id: number) => {
    setIsUpdating(true)
    try {
      const updatedIds = selectedIds.filter(itemId => itemId !== id)
      setSelectedIds(updatedIds)
      
      await createMutation.mutateAsync({ countryIds: updatedIds })
      await refetchSaved()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClearAll = async () => {
    setIsUpdating(true)
    try {
      await createMutation.mutateAsync({ countryIds: [] })
      setSelectedIds([])
      await refetchSaved()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReorder = async (reorderedCuisines: Country[]) => {
    setIsReordering(true)
    try {
      const reorderData = reorderedCuisines.map((item, index) => ({
        id: item.id,
        sortNumber: index + 1,
      }))

      await reorderMutation.mutateAsync(reorderData)
      await refetchSaved()
    } catch (error) {
      // Обработка ошибки
    } finally {
      setIsReordering(false)
    }
  }

  return {
    filteredCuisines,
    searchValue,
    selectedIds,
    selectedCount,
    isSaving,
    isLoading,
    hasChanges,
    handleSave,
    handleClearSearch,
    handleSearchChange,
    handleCheckboxChange,

    savedCuisines,
    isLoadingSaved,
    isReordering,
    handleRemove,
    handleClearAll,
    handleReorder,
  }
}