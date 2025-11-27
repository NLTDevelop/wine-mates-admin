import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/shadcn/use-toast'
import { wineQueries } from '@/modules/wine/list/entities/wine-list-queries'
import { UpdateWineListParams } from '@/modules/wine/list/entities/types/types'

export const useUpdateWine = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const updateWineMutation = useMutation({
    ...wineQueries.update(),
    onSuccess: () => {
      toast({
        title: 'Вино успішно оновлено',
        variant: 'default',
      })
      queryClient.invalidateQueries({ queryKey: ['wines', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['wines', 'detail'] })
    },
    onError: () => {
      toast({
        title: 'Помилка при оновленні вина',
        description: 'Спробуйте ще раз',
        variant: 'destructive',
      })
    },
  })

  const updateWine = async (params: UpdateWineListParams) => {
    return updateWineMutation.mutateAsync(params)
  }

  return {
    updateWine,
    isUpdating: updateWineMutation.isPending,
  }
}
