import isEqual from 'lodash/isEqual'
import { useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

export function useFormChanges<T extends Record<string, any>>(form: UseFormReturn<T>, initialData: T) {
  const [hasChanges, setHasChanges] = useState(false)
  const initialDataRef = useRef(initialData)

  useEffect(() => {
    initialDataRef.current = initialData
  }, [initialData])

  useEffect(() => {
    const subscription = form.watch(values => {
      const currentValues = values as T

      const sanitizeForComparison = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return obj

        const sanitized = JSON.parse(JSON.stringify(obj))

        if (sanitized.image && typeof sanitized.image === 'object') {
          delete sanitized.image.lastModified
        }

        return sanitized
      }

      const sanitizedCurrent = sanitizeForComparison(currentValues)
      const sanitizedInitial = sanitizeForComparison(initialDataRef.current)

      const changed = !isEqual(sanitizedCurrent, sanitizedInitial)

      setHasChanges(changed)
    })

    return () => subscription.unsubscribe()
  }, [form])

  const resetChanges = () => {
    form.reset(initialDataRef.current)
    setHasChanges(false)
  }

  return { hasChanges, resetChanges }
}
