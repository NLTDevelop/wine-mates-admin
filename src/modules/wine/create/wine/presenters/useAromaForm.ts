import { useCallback, useEffect, useRef } from 'react'
import { adaptFetchOptions } from '@/lib/utils'
import { useAromasSelection } from './useAromasSelection'

interface UseAromaFormProps {
  initialAromaIds?: number[]
  cachedAromas: Array<{ id: string; name: string }>
  onAromasChange: (aromaIds: number[]) => void
}

export const useAromaForm = ({ cachedAromas, initialAromaIds = [], onAromasChange }: UseAromaFormProps) => {
  const { selectedAromas, aromasValues, handleAromaChange } = useAromasSelection({ cachedAromas, initialAromaIds })

  const fetchOptions = useCallback(
    async (search?: string) => {
      return adaptFetchOptions(() => Promise.resolve(cachedAromas))(search)
    },
    [cachedAromas]
  )

  const prevSelectedAromasRef = useRef(selectedAromas)

  useEffect(() => {
    const aromaIds = selectedAromas.map(a => Number(a.id))
    const hasChanged = JSON.stringify(aromaIds) !== JSON.stringify(prevSelectedAromasRef.current)

    if (hasChanged) {
      onAromasChange(aromaIds)
      prevSelectedAromasRef.current = selectedAromas
    }
  }, [selectedAromas, onAromasChange])

  return {
    selectedAromas,
    aromasValues,
    handleAromaChange,
    fetchOptions,
  }
}
