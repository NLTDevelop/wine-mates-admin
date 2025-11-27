import React from 'react'
import { WineType } from '../../../wine-types/entities/types/wine-type'
import { WineForm } from './wine-form'
import { IWines } from '../../entities/types/types'
import { useEditWineForm } from '../../presenters/useEditWineForm'

interface EditWineFormProps {
  wine: IWines
  wineTypes: WineType[]
  onSuccess?: () => void
  onCancel?: () => void
}

export const EditWineForm: React.FC<EditWineFormProps> = ({ wine, wineTypes, onSuccess, onCancel }) => {
  const { form, isSubmitting, onSubmit } = useEditWineForm({
    wine,
    onSuccess,
  })

  return <WineForm form={form} wineTypes={wineTypes} mode="edit" onSubmit={onSubmit} onCancel={onCancel} isSubmitting={isSubmitting} />
}
