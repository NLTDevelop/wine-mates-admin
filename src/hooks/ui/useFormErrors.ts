import { useEffect } from 'react'
import { useToast } from './useToast'
import { useTranslation } from 'react-i18next'

export const useFormErrors = (errors: any, showInToast = true) => {
  const { notifyToast } = useToast()
  const { t } = useTranslation('errors')

  useEffect(() => {
    if (showInToast && Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((error: any) => error.message)
        .filter(Boolean)

      if (errorMessages.length > 0) {
        notifyToast(`${t('found')} (${errorMessages.length}):\n${errorMessages.join('\n')}`, 'destructive')
      }
    }
  }, [errors, showInToast, notifyToast])
}
