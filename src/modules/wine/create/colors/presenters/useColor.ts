import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useEffect } from 'react'
import { useColorStore } from '../entities/color-store'
import { colorQueries } from '../entities/color-queries'
import { CreateWineColorParams, UpdateWineColorParams, WineColor } from '../entities/types/color'

export const useColor = () => {
  const queryClient = useQueryClient()
  const store = useColorStore()

  const colorsQuery = useQuery({
    ...colorQueries.list(),
  })

  useEffect(() => {
    if (colorsQuery.data) {
      store.setColors(colorsQuery.data)
    }
  }, [colorsQuery.data, store])

  const shadesQuery = (colorId?: string) => {
    const query = useQuery({
      ...colorQueries.listShades(colorId),
      enabled: !!colorId,
    })

    useEffect(() => {
      if (query.data) {
        store.setShades(query.data)
      }
    }, [query.data, store])

    return query
  }

  const createColorMutation = useMutation({
    ...colorQueries.create(),
    onSuccess: newColor => {
      store.addColor(newColor)
      queryClient.invalidateQueries({ queryKey: ['colors', 'list'] })
    },
  })

  const updateColorMutation = useMutation({
    ...colorQueries.update(),
    onSuccess: updatedColor => {
      store.updateColor(updatedColor.id, updatedColor)
      queryClient.invalidateQueries({ queryKey: ['colors', 'list'] })
    },
  })

  const deleteColorMutation = useMutation({
    ...colorQueries.delete(),
    onSuccess: (_, colorId) => {
      store.deleteColor(colorId)
      queryClient.invalidateQueries({ queryKey: ['colors', 'list'] })
    },
  })

  const createShadeMutation = useMutation({
    ...colorQueries.createShade(),
    onSuccess: (newShade, variables) => {
      store.addShade(newShade)
      queryClient.invalidateQueries({ queryKey: ['colors', variables.colorId, 'shades'] })
      queryClient.invalidateQueries({ queryKey: ['shades', 'list'] })
    },
  })

  const createColor = (color: CreateWineColorParams) => {
    return createColorMutation.mutateAsync(color)
  }

  const updateColor = (params: UpdateWineColorParams) => {
    return updateColorMutation.mutateAsync(params)
  }

  const deleteColor = (colorId: string) => {
    return deleteColorMutation.mutateAsync(colorId)
  }

  const createShade = (colorId: string, shade: CreateWineColorParams) => {
    return createShadeMutation.mutateAsync({ colorId, shade })
  }

  //TODO уточнит нужен ли поиск по цветам
  const searchColors = (searchTerm: string) => {
    store.searchColors(searchTerm)
  }

  const clearSearch = () => {
    store.clearSearch()
  }
  // -------------------------

  const setCurrentColor = (color: WineColor | null) => {
    store.setCurrentColor(color)
  }

  const getColorById = (id: string) => {
    return store.getColorById(id)
  }

  const getColorByValue = (value: string) => {
    return store.getColorByValue(value)
  }

  const hasColor = (id: string) => {
    return store.hasColor(id)
  }

  const hasColorByValue = (value: string) => {
    return store.hasColorByValue(value)
  }

  const getShadeById = (id: string) => {
    return store.getShadeById(id)
  }

  return {
    colors: store.colors,
    searchResults: store.searchResults,
    currentColor: store.currentColor,
    shades: store.shades,

    isLoading: colorsQuery.isLoading,
    isError: colorsQuery.isError,
    error: colorsQuery.error,

    isCreating: createColorMutation.isPending,
    isUpdating: updateColorMutation.isPending,
    isDeleting: deleteColorMutation.isPending,
    isCreatingShade: createShadeMutation.isPending,

    createColor,
    updateColor,
    deleteColor,
    createShade,
    searchColors,
    clearSearch,
    setCurrentColor,
    getColorById,
    getColorByValue,
    hasColor,
    hasColorByValue,
    getShadeById,

    refetchColors: colorsQuery.refetch,

    colorsQuery,
    shadesQuery,
  }
}
