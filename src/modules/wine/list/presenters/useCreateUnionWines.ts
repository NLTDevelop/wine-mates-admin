import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/shadcn/use-toast'
import { wineQueries } from '@/modules/wine/list/entities/wine-list-queries'
import { CreateMergeRequest } from '@/modules/wine/list/entities/types/types'
import { useWineStore } from '@/modules/wine/list/entities/wine-list-store'
import { useTranslation } from 'react-i18next'

export const useCreateUnionWines = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('wines')
  const { toast } = useToast()

  const queryClient = useQueryClient()
  const store = useWineStore()

  const mergeWineMutation = useMutation({
    ...wineQueries.merge(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines', 'list', store.filters] })
      toast({
        title: t('wines_merged_successfully'),
        variant: 'default',
      })
      navigate('/wines')
    },
  })

  const mergeWines = async (mergeData: CreateMergeRequest) => {
    return mergeWineMutation.mutateAsync(mergeData)
  }

  return {
    mergeWines,
    isMerging: mergeWineMutation.isPending,
  }
}
