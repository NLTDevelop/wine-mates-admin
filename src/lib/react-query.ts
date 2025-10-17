import { QueryClient } from '@tanstack/react-query'

let globalToast: {
  notifyToast: (message: string, variant?: 'default' | 'destructive' | 'success') => void
} | null = null

let globalT: ((key: string) => string) | null = null

export const setGlobalToast = (toast: {
  notifyToast: (message: string, variant?: 'default' | 'destructive' | 'success') => void
}) => {
  globalToast = toast
}

export const setGlobalTranslator = (t: (key: string) => string) => {
  globalT = t
}

const handleGlobalError = (error: any) => {
  const status = error.response?.status
  const url = error.config?.url

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

  const skipToastErrors = [422, 409, 429]

  const skipToastFlags = [
    error.userFriendlyMessage,
    error.validationData,
    error.isHandledInComponent,
    error.retryAfter,
    error.showCustomModal,
  ]

  if (skipToastErrors.includes(status) || skipToastFlags.some(flag => !!flag)) {
    return
  }

  const serverMessage = error.response?.data?.message

  const errorMessage = getErrorMessage(status, serverMessage)
  const variant = getToastVariant(status)

  if (globalToast) {
    globalToast.notifyToast(errorMessage, variant)
  }

  if (status === 401 && url?.includes('/login')) {
    return
  }

  if (status === 401) {
    localStorage.removeItem('token')
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
  }
}

const getErrorMessage = (status: number, serverMessage?: string): string => {
  if (globalT) {
    const translated = globalT(`errors.${status}`)
    if (translated && translated !== `errors.${status}`) {
      return translated
    }

    return serverMessage || globalT('errors.default')
  }

  const fallbackMessages: { [key: number]: string } = {
    400: 'Невірний запит. Перевірте введені дані.',
    401: 'Сесія закінчилася. Будь ласка, увійдіть знову.',
    403: 'Доступ заборонено. Недостатньо прав.',
    404: 'Ресурс не знайдено.',
    500: 'Внутрішня помилка сервера. Ми вже працюємо над цим.',
    502: 'Проблеми з підключенням. Сервер тимчасово недоступний.',
    503: 'Сервіс тимчасово недоступний. Проводяться технічні роботи.',
    504: 'Таймаут підключення. Сервер не відповідає.',
  }

  return fallbackMessages[status] || serverMessage || 'Щось пішло не так. Спробуйте ще раз.'
}

const getToastVariant = (status: number): 'default' | 'destructive' | 'success' => {
  if ([401, 403, 500, 501, 502, 503, 504].includes(status)) return 'destructive'
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
