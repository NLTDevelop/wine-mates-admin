import { useEffect } from 'react'
import { useToast } from '@/hooks/ui/useToast'
import { setGlobalToast } from '@/lib/react-query'

export const ToastInitializer = () => {
  const { notifyToast } = useToast()

  useEffect(() => {
    setGlobalToast({ notifyToast })
  }, [notifyToast])

  return null
}
