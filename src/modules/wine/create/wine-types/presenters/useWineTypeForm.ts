import { useState } from 'react'
import { WineType } from '../entities/types/wine-type'

interface UseWineTypeFormProps {
  initialData?: WineType
  onSubmit: (wineType: WineType) => void
  isLoading: boolean
}

export const useWineTypeForm = ({ initialData, onSubmit, isLoading }: UseWineTypeFormProps) => {
  const isEdit = !!initialData

  const [formData, setFormData] = useState({
    label: initialData?.label || '',
    labelEn: initialData?.labelEn || '',
    colors: initialData?.colors || [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEdit) {
      const updatedWineType: WineType = {
        ...initialData!,
        ...formData,
      }
      onSubmit(updatedWineType)
    } else {
      const value = formData.label
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      const newWineType: WineType = {
        id: value,
        ...formData,
      }
      onSubmit(newWineType)
    }

    if (!isEdit) {
      setFormData({
        label: '',
        labelEn: '',
        colors: [],
      })
    }
  }

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const canSubmit = formData.label.trim() && formData.colors

  return {
    formData,
    handleSubmit,
    handleChange,
    canSubmit,
    isEdit,
    isLoading,
  }
}
