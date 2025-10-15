import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/hooks/ui/useToast'
import { queryClient, setGlobalToast, setGlobalTranslator } from '@/lib/react-query'

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('errors')
  const { notifyToast } = useToast()

  useEffect(() => {
    setGlobalToast({ notifyToast })
    setGlobalTranslator(t)
  }, [notifyToast, t])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
