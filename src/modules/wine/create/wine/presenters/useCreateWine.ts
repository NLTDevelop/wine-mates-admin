import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/shadcn/use-toast'
import { wineQueries } from '@/modules/wine/list/entities/wine-list-queries'
import { CreateWineRequest } from '@/modules/wine/list/entities/types/types'
import { useWineStore } from '@/modules/wine/list/entities/wine-list-store'

export const useCreateWine = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const store = useWineStore()

  const createWineMutation = useMutation({
    ...wineQueries.create(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wines', 'list', store.filters] })
      toast({
        title: 'Вино успішно створено',
        variant: 'default',
      })
      navigate('/wines')
    },
    onError: () => {
      toast({
        title: 'Помилка при створенні вина',
        description: 'Спробуйте ще раз',
        variant: 'destructive',
      })
    },
  })

  const createWine = async (wineData: CreateWineRequest) => {
    return createWineMutation.mutateAsync(wineData)
  }

  return {
    createWine,
    isCreating: createWineMutation.isPending,
  }
}
