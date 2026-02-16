import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/shadcn/use-toast'
import { wineQueries } from '@/modules/wine/list/entities/wine-list-queries'
import { CreateWineRequest } from '@/modules/wine/list/entities/types/types'
import { useWineStore } from '@/modules/wine/list/entities/wine-list-store'
import { useTranslation } from 'react-i18next'

export const useCreateUnionWines = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  // const queryClient = useQueryClient()
  // const store = useWineStore()
  // const { t } = useTranslation('wines')

  // const createWineMutation = useMutation({
  //   ...wineQueries.create(),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['wines', 'list', store.filters] })
  //     toast({
  //       title: t('wine_created'),
  //       variant: 'default',
  //     })
  //     navigate('/wines')
  //   },
  // })

  // const createWine = async (wineData: CreateWineRequest) => {
  //   return createWineMutation.mutateAsync(wineData)
  // }
  const createUnionWines =  () => {
    console.log("create union")
  }

  return {
    createUnionWines,
    isCreating: false,
    // isCreating: createWineMutation.isPending,
  }
}
