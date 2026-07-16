import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { wineryQueries } from '../entities/winery-queries'
import { ConfirmWineryParams, IConfirmWineryBody, IWineryDetail } from '../entities/types'
import { WINERY_STATUS } from '../../list/entities/types'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/navigation/paths'

export const useWineryDetail = (wineryId: string) => {
  const navigate = useNavigate()
  const wineryQuery = useQuery(wineryQueries.detail(wineryId))

  const queryClient = useQueryClient()

  const winery = wineryQuery.data?.data

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedWineryId, setSelectedWineryId] = useState<string | null>(null)

    const wineryToConfirm = {
    wineryName: winery?.name || '',
    status: winery?.application?.status || 'pending',
    rejectionReason: winery?.application?.rejectionReason || '',
  }


  const confirmWineryMutation = useMutation({
    ...wineryQueries.confirm(),
    onMutate: async ({ body }: ConfirmWineryParams) => {
      await queryClient.cancelQueries({ queryKey: ['winery', 'detail'] })

      const previousWinery = queryClient.getQueryData<IWineryDetail>(['winery', 'detail'])

      if (previousWinery) {
        const updatedWinery = {
          ...previousWinery,
          application: {
            status: body.status,
            rejectionReason: body.rejectionReason,
          },
        }

        queryClient.setQueryData(['winery', 'detail'], updatedWinery)
      }

      return { previousWinery }
    },
    onError: (_, __, context) => {
      if (context?.previousWinery) {
        queryClient.setQueryData(['winery', 'detail'], context.previousWinery)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['winery', 'detail'] })
    },
  })

  const openConfirmModal = useCallback((wineryId?: string) => {
    wineryId && setSelectedWineryId(wineryId)
    setIsConfirmModalOpen(true)
  }, [])

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false)
    setSelectedWineryId(null)
  }, [])

  const confirmOrRejectWinery = useCallback(
    async (isConfirmed: boolean, rejectionReason?: string) => {

      if (!selectedWineryId) return
      const requestBodyConfirm: IConfirmWineryBody = {
        status: !isConfirmed ? WINERY_STATUS.REJECTED : WINERY_STATUS.APPROVED,
        rejectionReason: isConfirmed ? undefined  : rejectionReason,
      }

      await confirmWineryMutation.mutateAsync({ id: parseInt(selectedWineryId), body: requestBodyConfirm })
      wineryQuery.refetch()
      closeConfirmModal()
    },
    [selectedWineryId, confirmWineryMutation, wineryQuery]
  )

  const handleBack= () => navigate(PATHS.WINERIES_LIST)

  return {
    winery,
    isLoading: wineryQuery.isLoading,
    isFetching: wineryQuery.isFetching,
    confirmOrRejectWinery,
    wineryToConfirm,
    confirmModal: {
      isOpen: isConfirmModalOpen,
      selectedWineryId,
      open: openConfirmModal,
      close: closeConfirmModal,
    },
    handleBack
  }
}
