import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/shadcn/use-toast'
import { wineQueries } from '@/modules/wine/list/entities/wine-list-queries'
import { UpdateWineListParams } from '@/modules/wine/list/entities/types/types'
import { useTranslation } from 'react-i18next'

export const useUpdateWine = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { t } = useTranslation('wines')

  const updateWineMutation = useMutation({
    ...wineQueries.update(),
    onSuccess: () => {
      toast({
        title: t('wine_updated'),
        variant: 'default',
      })
      queryClient.invalidateQueries({ queryKey: ['wines', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['wines', 'detail'] })
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
