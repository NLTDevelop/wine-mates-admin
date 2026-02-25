import { useModal } from '@/UIKit/components/NLTModal/useModal'
import { useUnionWinesForm } from './useUnionWinesForm'
import { useState } from 'react'
import { CreateMergeRequest } from '../entities/types/types'
import { SelectionInfo } from './useWineSelection'
import { useCreateUnionWines } from './useCreateUnionWines'

export const useCreateUnionWinesForm = () => {
  const form = useUnionWinesForm()
  const { isOpen, onOpen: onModalOpen, onClose } = useModal()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectionData, setSelectionData] = useState<SelectionInfo | null>(null)

  const { mergeWines, isMerging } = useCreateUnionWines()

  const onOpen = (selectionInfo: SelectionInfo) => {
    const numericIds = selectionInfo.selectedIds.map(id => Number(id))
    setSelectedIds(numericIds)
    setSelectionData(selectionInfo)

    onModalOpen()
  }

  const onSubmit = async (formData: any) => {
    console.log('Form data:', formData)
    console.log('Selected IDs to merge:', selectedIds)

    const mergeRequest: CreateMergeRequest = {
      newWineData: {
        name: formData.name || '',
        vintage: formData.vintage || null,
        producer: formData.producer || '',
        grapeVariety: formData.grapeVariety || '',
        countryId: formData.countryId ? Number(formData.countryId) : null,
        regionId: formData.regionId ? Number(formData.regionId) : null,
        typeId: formData.typeId ? Number(formData.typeId) : null,
        colorId: formData.colorId ? Number(formData.colorId) : null,
        image: formData.image || null,
      },
      wineIdsToMerge: selectedIds,
    }

    console.log('Sending to server->', mergeRequest)

    try {
      await mergeWines(mergeRequest)
      handleClose()
    } catch (error) {
      console.error('Error merging wines:', error)
    }
  }

  const onCreateOption = async (value: string, fieldName: string) => {
    console.log(`Create new option for ${fieldName}:`, value)

    const newOption = { value: value, label: value }

    form.setValue(fieldName as any, value)

    return newOption
  }

  const handleClose = () => {
    form.reset()
    setSelectedIds([])
    setSelectionData(null)
    onClose()
  }

  return {
    form,
    onSubmit,
    onCreateOption,
    isMerging,
    unionModal: {
      isOpen,
      onOpen,
      onClose: handleClose,
      data: selectionData,
    },
  }
}
