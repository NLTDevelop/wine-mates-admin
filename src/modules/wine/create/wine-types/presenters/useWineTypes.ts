import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { CreateWineTypeParams, UpdateWineTypeParams, WineType } from '../entities/types/wine-type'
import { useWineTypeStore } from '../entities/wine-type-store'
import { wineTypeQueries } from '../entities/wine-type-queries'

interface WineTypeFormData {
  label: string
  labelEn: string
  colors: string[]
}

export const useWineTypes = () => {
  const [formData, setFormData] = useState<WineTypeFormData>({
    label: '',
    labelEn: '',
    colors: [],
  })

  const [editingWineType, setEditingWineType] = useState<WineType | null>(null)
  const queryClient = useQueryClient()

  const {
    wineTypes,
    currentWineType,
    setCurrentWineType,
    addWineType: addToStore,
    updateWineType: updateInStore,
    deleteWineType: deleteFromStore,
    searchWineTypes,
    clearSearch,
    getWineTypeByValue,
    hasWineType,
  } = useWineTypeStore()

  const { data: fetchedWineTypes = [], isLoading: isLoadingList } = useQuery(wineTypeQueries.list())

  const createMutation = useMutation({
    ...wineTypeQueries.create(),
    onSuccess: (newWineType: WineType) => {
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
      addToStore(newWineType)
      resetForm()
    },
  })

  const updateMutation = useMutation({
    ...wineTypeQueries.update(),
    onSuccess: (updatedWineType: WineType) => {
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
      if (editingWineType) {
        updateInStore(editingWineType.id, updatedWineType)
      }
      setEditingWineType(null)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    ...wineTypeQueries.delete(),
    onSuccess: (_, wineTypeValue) => {
      queryClient.invalidateQueries({ queryKey: ['wine-types', 'list'] })
      deleteFromStore(wineTypeValue)
      if (editingWineType && editingWineType.id === wineTypeValue) {
        setEditingWineType(null)
      }
      if (currentWineType?.id === wineTypeValue) {
        setCurrentWineType(null)
      }
    },
  })

  const updateFormData = (updates: Partial<WineTypeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const resetForm = () => {
    setFormData({
      label: '',
      labelEn: '',
      colors: [],
    })
    setEditingWineType(null)
  }

  const startEdit = (wineType: WineType) => {
    setFormData({
      label: wineType.label,
      labelEn: wineType.labelEn || '',
      colors: wineType.colors || [],
    })
    setEditingWineType(wineType)
  }

  const cancelEdit = () => {
    resetForm()
  }

  const createWineType = (wineTypeData: CreateWineTypeParams) => {
    console.log('Data from form->', wineTypeData)
    const value = wineTypeData.label
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    const dataWithValue: WineType = {
      ...wineTypeData,
      id: value,
    }

    createMutation.mutate(dataWithValue)
  }

  const updateWineType = (params?: UpdateWineTypeParams) => {
    if (!editingWineType) return

    const paramsToUse = params || {
      oldValue: editingWineType.id,
      newWineType: {
        ...editingWineType,
        ...formData,
      },
    }

    updateMutation.mutate(paramsToUse)
  }

  const deleteWineType = (wineTypeValue: string) => {
    deleteMutation.mutate(wineTypeValue)
  }

  const selectWineType = (wineType: WineType) => {
    setCurrentWineType(wineType)
  }

  const canCreate = formData.label.trim() && formData.colors

  const canUpdate = editingWineType && formData.label.trim() && formData.colors 

  const isDuplicate = wineTypes.some(wt => wt.label.toLowerCase() === formData.label.toLowerCase() && wt.id !== editingWineType?.id)

  const isLoading = isLoadingList || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  return {
    wineTypes: fetchedWineTypes,
    currentWineType,
    formData,
    editingWineType,

    isLoading,
    canCreate: canCreate && !isDuplicate,
    canUpdate: canUpdate && !isDuplicate,
    isDuplicate,

    updateFormData,
    resetForm,
    startEdit,
    cancelEdit,

    createWineType,
    updateWineType,
    deleteWineType,
    selectWineType,
    searchWineTypes,
    clearSearch,

    getWineTypeByValue,
    hasWineType,
  }
}
