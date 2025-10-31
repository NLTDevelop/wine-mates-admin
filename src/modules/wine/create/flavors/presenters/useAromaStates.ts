import { useState, useCallback } from 'react'
import { StateItem } from '../entities/types/flavor'

interface UseAromaStatesProps {
  initialState?: StateItem[]
  onStatesChange?: (states: StateItem[]) => void
}

export const useAromaStates = ({ initialState = [], onStatesChange }: UseAromaStatesProps) => {
  const [states, setStates] = useState<StateItem[]>(initialState)
  const [editingStateId, setEditingStateId] = useState<string | null>(null)
  const [newStateName, setNewStateName] = useState('')

  const addEmptyState = useCallback(() => {
    const newState: StateItem = {
      id: `temp-${Date.now()}`,
      stateName: '',
      order: states.length,
    }
    const updatedStates = [...states, newState]
    setStates(updatedStates)
    setEditingStateId(newState.id)
    onStatesChange?.(updatedStates)
  }, [states, onStatesChange])

  const updateState = useCallback(
    (stateId: string, stateName: string) => {
      const updatedStates = states.map(state => (state.id === stateId ? { ...state, stateName } : state))
      setStates(updatedStates)
      onStatesChange?.(updatedStates)
    },
    [states, onStatesChange]
  )

  const removeState = useCallback(
    (stateId: string) => {
      const updatedStates = states.filter(state => state.id !== stateId).map((state, index) => ({ ...state, order: index }))
      setStates(updatedStates)
      setEditingStateId(null)
      onStatesChange?.(updatedStates)
    },
    [states, onStatesChange]
  )

  const startEditing = useCallback((stateId: string, currentName: string) => {
    setEditingStateId(stateId)
    setNewStateName(currentName)
  }, [])

  const saveState = useCallback(
    (stateId: string) => {
      if (newStateName.trim()) {
        updateState(stateId, newStateName.trim())
      } else {
        removeState(stateId)
      }
      setEditingStateId(null)
      setNewStateName('')
    },
    [newStateName, updateState, removeState]
  )

  const cancelEditing = useCallback(
    (stateId: string) => {
      const state = states.find(s => s.id === stateId)
      if (state && !state.stateName.trim()) {
        removeState(stateId)
      }
      setEditingStateId(null)
      setNewStateName('')
    },
    [states, removeState]
  )

  const reorderStates = useCallback(
    (reorderedStates: StateItem[]) => {
      const updatedStates = reorderedStates.map((state, index) => ({
        ...state,
        order: index,
      }))
      setStates(updatedStates)
      onStatesChange?.(updatedStates)
    },
    [onStatesChange]
  )

  return {
    states,
    editingStateId,
    newStateName,

    addEmptyState,
    updateState,
    removeState,
    startEditing,
    saveState,
    cancelEditing,
    reorderStates,
    setNewStateName,
  }
}
