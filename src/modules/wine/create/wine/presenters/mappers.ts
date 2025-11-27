import { CreateWineRequest, IWines } from '../entities/types/types'
import { WineFormData } from '../presenters/wine-form-schema'

export const mapFormDataToCreateRequest = (formData: WineFormData): CreateWineRequest => {
  return {
    displayName: formData.displayName,
    producerTitle: formData.producerTitle,
    producerName: formData.producerName,
    wine: formData.wine,
    grapeVariety: formData.grapeVariety,
    country: formData.country,
    region: formData.region,
    subRegion: formData.subRegion,
    site: formData.site,
    typeId: formData.type,
    subType: formData.subType,
    designation: formData.designation,
    classification: formData.classification,
    vintageConfig: formData.vintageConfig,
    firstVintage: formData.firstVintage,
    finalVintage: formData.finalVintage,
    reference: formData.reference,
    description: formData.description,
    images: formData.media,
  }
}

export const mapFormDataToUpdateRequest = (formData: WineFormData, existingWine: IWines): IWines => {
  return {
    ...existingWine,
    displayName: formData.displayName,
    producerTitle: formData.producerTitle,
    producerName: formData.producerName,
    wine: formData.wine,
    grapeVariety: formData.grapeVariety,
    country: formData.country,
    region: formData.region,
    subRegion: formData.subRegion,
    site: formData.site,
    type: formData.type ? ({ id: formData.type } as any) : existingWine.type,
    subType: formData.subType,
    designation: formData.designation,
    classification: formData.classification,
    vintageConfig: formData.vintageConfig,
    firstVintage: formData.firstVintage,
    finalVintage: formData.finalVintage,
    reference: formData.reference,
    description: formData.description,
    images:
      formData.media.length > 0
        ? formData.media.map((file, index) => ({
            id: `img-${index}`,
            url: URL.createObjectURL(file),
            thumbnailUrl: URL.createObjectURL(file),
            alt: file.name,
            order: index,
          }))
        : existingWine.images || [],
  }
}

export const mapWineToFormData = (wine: IWines): Partial<WineFormData> => {
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
    type: wine.type?.id || '',
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
          order: img.order,
        })
      }) || [],
  }
}
