import React from 'react'
import { WineType } from '../../../wine-types/entities/types/wine-type'
import { WineForm } from './wine-form'
import { useCreateWineForm } from '../../presenters/useCreateWineForm'

interface CreateWineFormProps {
  wineTypes: WineType[]
}

export const CreateWineForm: React.FC<CreateWineFormProps> = ({ wineTypes }) => {
  const { form, isSubmitting, onSubmit } = useCreateWineForm()

  return <WineForm form={form} wineTypes={wineTypes} mode="create" onSubmit={onSubmit} isSubmitting={isSubmitting} />
}
