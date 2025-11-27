import { useForm } from 'react-hook-form'
import { WineFormData, wineFormSchema } from './wine-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { IWines } from '@/modules/wine/list/entities/types/types'

interface UseWineFormProps {
  initialData?: Partial<WineFormData> | IWines
}

export const useWineForm = ({ initialData }: UseWineFormProps = {}) => {
  const formData = initialData && 'id' in initialData ? mapWineToFormData(initialData as IWines) : (initialData as Partial<WineFormData>)

  const form = useForm<WineFormData>({
    resolver: zodResolver(wineFormSchema) as any,
    defaultValues: {
      displayName: formData?.displayName || '',
      wine: formData?.wine || '',
      grapeVariety: formData?.grapeVariety || '',
      producerTitle: formData?.producerTitle || '',
      producerName: formData?.producerName || '',
      country: formData?.country || '',
      region: formData?.region || '',
      subRegion: formData?.subRegion || '',
      type: formData?.type || '',
      subType: formData?.subType || '',
      description: formData?.description || '',
      vintageConfig: formData?.vintageConfig || undefined,
      firstVintage: formData?.firstVintage || undefined,
      finalVintage: formData?.finalVintage || undefined,
      reference: formData?.reference || '',
      media:
        formData?.media?.map((img: any) => {
          if (img instanceof File) {
            return img
          }
          const file = new File([], img.alt || 'wine-image')
          return Object.assign(file, {
            id: (img as any).id,
            url: (img as any).url,
            thumbnailUrl: (img as any).thumbnailUrl,
            preview: (img as any).url,
          })
        }) || [],
    },
  })

  return form
}

const mapWineToFormData = (wine: IWines): Partial<WineFormData> => {
  return {
    displayName: wine.displayName || '',
    producerTitle: wine.producerTitle || '',
    producerName: wine.producerName || '',
    wine: wine.wine || '',
    grapeVariety: wine.grapeVariety || '',
    country: wine.country || '',
    region: wine.region || '',
    subRegion: wine.subRegion || '',
    site: wine.site || '',
    type: typeof wine.type === 'string' ? wine.type : wine.type?.id || '',
    subType: wine.subType || '',
    designation: wine.designation || '',
    classification: wine.classification || '',
    vintageConfig: wine.vintageConfig || new Date().getFullYear(),
    firstVintage: wine.firstVintage,
    finalVintage: wine.finalVintage,
    reference: wine.reference || '',
    description: wine.description || '',
    media: wine.images
      ? wine.images.map(img => {
          const file = new File([], img.alt || 'wine-image')
          return Object.assign(file, {
            id: img.id,
            url: img.url,
            thumbnailUrl: img.thumbnailUrl,
            preview: img.url,
          })
        })
      : [],
  }
}
