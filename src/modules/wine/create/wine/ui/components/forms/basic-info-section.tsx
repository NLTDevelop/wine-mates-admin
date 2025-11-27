import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'
import { MediaSection } from './media-section'
import { ProducerInfoSection } from './producer-info-section'
import { LocationSection } from './location-section'
import { WineTypeSection } from './wine-type-section'
import { VintageSection } from './vintage-section'
import { DescriptionSection } from './description-section'
import { WineFormData } from '../../../presenters/wine-form-schema'

interface BasicInfoSectionProps {
  form: UseFormReturn<WineFormData>
  wineTypes: WineType[]
  mode: 'create' | 'edit'
}

export const BasicInfoSection = ({ form, wineTypes, mode }: BasicInfoSectionProps) => {
  const countryValue = form.watch('country')
  const regionValue = form.watch('region')

  return (
    <Card className="rounded-t-none bg-input/50">
      <CardContent className="space-y-6 sm:px-0">
        <MediaSection form={form} mode={mode} />
        <ProducerInfoSection form={form} mode={mode} />
        <LocationSection form={form} countryValue={countryValue} regionValue={regionValue} mode={mode} />
        <WineTypeSection form={form} wineTypes={wineTypes} mode={mode} />
        <VintageSection form={form} mode={mode} />
        <DescriptionSection form={form} mode={mode} />
      </CardContent>
    </Card>
  )
}
