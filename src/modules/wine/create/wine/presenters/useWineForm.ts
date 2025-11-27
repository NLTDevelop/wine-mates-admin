import { useForm, UseFormReturn } from 'react-hook-form'
import { WineFormData, wineFormSchema } from './wine-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { IWines as ListIWines } from '@/modules/wine/list/entities/types/types'
import { IWines as CreateIWines } from '@/modules/wine/create/wine/entities/types/types'
import { useEffect } from 'react'

interface UseWineFormOptions {
  mode?: 'create' | 'edit'
  initialData?: ListIWines | CreateIWines
}

export const useWineForm = (options?: UseWineFormOptions) => {
  const { mode = 'create', initialData } = options || {}

  const defaultValues: Partial<WineFormData> = {
    displayName: '',
    producerTitle: '',
    producerName: '',
    grapeVariety: '',
    wine: '',
    country: '',
    region: '',
    subRegion: '',
    site: '',
    type: '',
    subType: '',
    designation: '',
    classification: '',
    vintageConfig: undefined,
    firstVintage: undefined,
    finalVintage: undefined,
    reference: '',
    description: '',
    media: [],
  }

  const form = useForm<WineFormData>({
    resolver: zodResolver(wineFormSchema) as any,
    defaultValues,
    mode: 'onChange',
  }) as UseFormReturn<WineFormData>

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const formData = mapWineToFormData(initialData)
      form.reset(formData)
    }
  }, [mode, initialData, form])

  return form
}

const mapWineToFormData = (wine: ListIWines | CreateIWines): Partial<WineFormData> => {
  return {
    displayName: wine.displayName || '',
    producerTitle: wine.producerTitle || '',
    producerName: wine.producerName || '',
    grapeVariety: wine.grapeVariety || '',
    wine: wine.wine || '',
    country: wine.country || '',
    region: wine.region || '',
    subRegion: wine.subRegion || '',
    site: wine.site || '',
    type: (wine.type as any)?.id || '',
    subType: wine.subType || '',
    designation: wine.designation || '',
    classification: wine.classification || '',
    vintageConfig: wine.vintageConfig || undefined,
    firstVintage: wine.firstVintage || undefined,
    finalVintage: wine.finalVintage || undefined,
    reference: wine.reference || '',
    description: wine.description || '',
    media:
      wine.images?.map(img => {
        const file = new File([], img.alt || 'wine-image')
        return Object.assign(file, {
          id: img.id,
          url: img.url,
          thumbnailUrl: img.thumbnailUrl,
          preview: img.url,
        })
      }) || [],
  }
}
