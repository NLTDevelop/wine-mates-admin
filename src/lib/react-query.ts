import { QueryClient } from '@tanstack/react-query'
import i18n from 'i18next'

let globalToast: {
  notifyToast: (message: string, variant?: 'default' | 'destructive' | 'success') => void
} | null = null

export const setGlobalToast = (toast: { notifyToast: (message: string, variant?: 'default' | 'destructive' | 'success') => void }) => {
  globalToast = toast
}

const handleGlobalError = (error: any) => {
  const status = error.response?.status

  if (status === 409) {
    if (globalToast) {
      const message = `Помилка здереження:${error.response?.data?.message}` || 'Конфлікт даних. Обʼєкт вже існує або був змінений.'
      globalToast.notifyToast(message, 'destructive')
    }
    return
  }

  if (status === undefined) {
    if (globalToast) {
      let message = 'Проблеми з інтернет-зʼєднанням. Перевірте підключення до мережі.'

      if (error.code === 'ERR_NETWORK') {
        message = 'Не вдалося підключитися до сервера'
      } else if (error.code === 'ECONNABORTED') {
        message = 'Час очікування вийшов. Спробуйте ще раз.'
      } else if (error.message?.includes('Network Error')) {
        message = 'Помилка мережі. Перевірте підключення до інтернету.'
      }

      globalToast.notifyToast(message, 'destructive')
    }
    return
  }

  const skipToastErrors = [422, 429]
  const skipToastFlags = [error.userFriendlyMessage, error.validationData, error.isHandledInComponent, error.retryAfter, error.showCustomModal]

  if (skipToastErrors.includes(status) || skipToastFlags.some(flag => !!flag)) {
    return
  }
  const serverMessage = error.response?.data?.message

  const errorMessage = getErrorMessage(status, serverMessage)
  const variant = getToastVariant(status)
  if (globalToast) {
    globalToast.notifyToast(errorMessage, variant)
  }
}

const getErrorMessage = (status: number, serverMessage?: string): string => {
  const translated = i18n.t(`errors:${status.toString()}`)
  if (translated && translated !== `errors.${status.toString()}`) {
    return translated
  }

  return serverMessage || i18n.t('errors.default')
}

const getToastVariant = (status: number): 'default' | 'destructive' | 'success' => {
  if ([401, 403, 500, 501, 502, 503, 504, 409].includes(status)) return 'destructive'
  if ([404].includes(status)) return 'default'
  return 'destructive'
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: any) => {
        const status = error.response?.status
        if ([400, 401, 403, 404, 409, 422, 429].includes(status)) return false
        return failureCount < 2
      },
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: (failureCount: number, error: any) => {
        const status = error.response?.status
        if ([500, 502, 503, 504, 0].includes(status)) return failureCount < 1
        return false
      },
    },
  },
})

queryClient.getQueryCache().config.onError = handleGlobalError
queryClient.getMutationCache().config.onError = handleGlobalError
