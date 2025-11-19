import { useCallback, useState } from 'react'

export const useDeleteModal = () => {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: string | null
    nameUa: string
  }>({
    isOpen: false,
    id: null,
    nameUa: '',
  })

  const openDeleteModal = useCallback((id: string, nameUa: string = '') => {
    setDeleteModal({
      isOpen: true,
      id,
      nameUa,
    })
  }, [])

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      id: null,
      nameUa: '',
    })
  }, [])

  return {
    deleteModal: {
      ...deleteModal,
      open: openDeleteModal,
      close: closeDeleteModal,
    },
  }
}
