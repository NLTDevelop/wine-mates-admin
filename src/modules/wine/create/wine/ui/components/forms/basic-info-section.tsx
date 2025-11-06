import { UseFormReturn } from 'react-hook-form'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { WineFormData } from '../../../entities/types/types'
import { WineType } from '@/modules/wine/create/wine-types/entities/types/wine-type'
import { ProducerInfoSection } from './producer-info-section'
import { LocationSection } from './location-section'
import { WineTypeSection } from './wine-type-section'
import { VintageSection } from './vintage-section'
import { DescriptionSection } from './description-section'
import { MediaSection } from './media-section'

interface BasicInfoSectionProps {
  form: UseFormReturn<WineFormData>
  wineTypes: WineType[]
}

export const BasicInfoSection = ({ form, wineTypes }: BasicInfoSectionProps) => {
  const countryValue = form.watch('country')
  const regionValue = form.watch('region')

  return (
    <Card className="rounded-t-none bg-input/50">
      <CardContent className="space-y-6 sm:px-0">
        <MediaSection form={form as any} />
        <ProducerInfoSection form={form as any} />
        <LocationSection form={form as any} countryValue={countryValue} regionValue={regionValue} />
        <WineTypeSection form={form as any} wineTypes={wineTypes} />
        <VintageSection form={form as any} />
        <DescriptionSection form={form as any} />
      </CardContent>
    </Card>
  )
}
