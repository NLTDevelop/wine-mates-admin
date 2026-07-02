import { ReorderItem } from '@/modules/wine/create/general/entities/types'
import { CreateCuisineRequest, cuisineService } from './cuisine-service'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const cuisineQueries = {
  result_list: () => ({
    queryKey: ['result', 'list'],
    queryFn: () => cuisineService.result_list(),
  }),

  cuisine_list: () => ({
    queryKey: ['cuisine', 'list'],
    queryFn: () => cuisineService.cuisine_list(),
  }),

  useCreate: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: ['cuisine', 'create'],
      mutationFn: (params: CreateCuisineRequest) => cuisineService.create(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cuisine', 'list'] })
      },
    })
  },

  useReorder: () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationKey: ['cuisine', 'reorder'],
      mutationFn: (params: ReorderItem[]) => cuisineService.reorder(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cuisine', 'list'] })
      },
    })
  },
}

