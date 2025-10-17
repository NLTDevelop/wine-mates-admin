import { useState } from 'react'

export const useModal = () => {
  const [isOpen, setOpen] = useState<boolean>(false)

  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)

  return { isOpen, onOpen, onClose }
}
