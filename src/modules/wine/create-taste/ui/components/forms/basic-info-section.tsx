import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'
import { MediaSection } from './media-section'
import { ProducerInfoSection } from './producer-info-section'
import { LocationSection } from './location-section'
import { BaseWineColor } from '@/modules/wine/create/general/entities/types'
import { WineFormData } from '../../../presenters/wine-form-schema'
import { TypeColorSection } from './type-color-section'

interface BasicInfoSectionProps {
  form: UseFormReturn<WineFormData>
  wineTypes: WineType[]
  cachedColors: BaseWineColor[]
  colorsLoading: boolean
  wineTypesLoading: boolean
}

export const BasicInfoSection = ({ form, wineTypes, wineTypesLoading, cachedColors, colorsLoading }: BasicInfoSectionProps) => {
  const countryValue = form.watch('countryId')

  return (
    <Card className="rounded-t-none bg-input/50">
      <CardContent className="space-y-6 sm:px-0">
        <MediaSection form={form} />
        <TypeColorSection form={form} wineTypes={wineTypes} wineTypesLoading={wineTypesLoading} colors={cachedColors} colorsLoading={colorsLoading} />
        <ProducerInfoSection form={form} />
        <LocationSection form={form} countryValue={countryValue} />
      </CardContent>
    </Card>
  )
}
