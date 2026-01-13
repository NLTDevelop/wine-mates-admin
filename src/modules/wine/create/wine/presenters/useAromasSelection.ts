import { useState, useCallback, useEffect, useMemo } from 'react'

interface UseAromasSelectionProps {
  initialAromaIds?: number[]
  cachedAromas: Array<{ id: string; name: string }>
}

export const useAromasSelection = ({ initialAromaIds = [], cachedAromas }: UseAromasSelectionProps) => {
  const [selectedAromas, setSelectedAromas] = useState<Array<{ id: string; name: string }>>(() => {
    return cachedAromas.filter(a => {
      if (!a?.id) return false

      const aromaId = typeof a.id === 'string' ? parseInt(a.id, 10) : a.id
      return initialAromaIds.includes(aromaId)
    })
  })

  console.log(initialAromaIds)
  console.log(cachedAromas)
  console.log(selectedAromas)

  useEffect(() => {
    const validSelectedAromas = selectedAromas.filter(selected => cachedAromas.some(cached => cached.id === selected.id))

    if (validSelectedAromas.length !== selectedAromas.length) {
      setSelectedAromas(validSelectedAromas)
    }
  }, [cachedAromas])

  const aromasValues = useMemo(() => selectedAromas.map(a => a?.id), [selectedAromas])

  const handleAromaChange = useCallback(
    (value: string | string[]) => {
      const selectedValues = Array.isArray(value) ? value : [value]
      const selectedAromaObjects = cachedAromas.filter(a => a?.id && selectedValues.includes(a?.id))
      setSelectedAromas(selectedAromaObjects)
    },
    [cachedAromas]
  )

  const updateSelectedAromas = useCallback((aromas: Array<{ id: string; name: string }>) => {
    setSelectedAromas(aromas)
  }, [])

  return {
    selectedAromas,
    aromasValues,
    handleAromaChange,
    updateSelectedAromas,
  }
}
