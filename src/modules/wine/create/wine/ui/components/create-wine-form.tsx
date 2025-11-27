import React from 'react'
import { WineType } from '../../../wine-types/entities/types/wine-type'
import { WineForm } from './wine-form'
import { useCreateWineForm } from '../../presenters/useCreateWineForm'

interface CreateWineFormProps {
  wineTypes: WineType[]
}

export const CreateWineForm: React.FC<CreateWineFormProps> = ({ wineTypes }) => {
  const { form, isSubmitting, onSubmit } = useCreateWineForm()

  return (
    <div className="mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-4xl">
      <WineForm form={form} wineTypes={wineTypes} mode="create" onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}
