import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reorderQueries } from '../entities/reorder-queries'

interface UseReorderListOptions {
  queryKey: string[]
}

export const useReorderList = ({ queryKey }: UseReorderListOptions) => {
  const queryClient = useQueryClient()

  const reorderMutation = useMutation({
    ...reorderQueries.reorder(),
    onMutate: async params => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, (old: any[]) => {
        if (!old) return old

        const orderMap = new Map(params.items.map(item => [item.id, item.order]))

        return old
          .map(item => ({
            ...item,
            sortNumber: orderMap.get(item.id) ?? item.sortNumber,
          }))
          .sort((a, b) => a.sortNumber - b.sortNumber)
      })

      return { previousData }
    },

    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },

    // ------------------когда будет бек------------------
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey })
    // },
  })

  return {
    reorder: reorderMutation.mutate,
    isReordering: reorderMutation.isPending,
  }
}
