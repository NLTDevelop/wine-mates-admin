import { useForm } from 'react-hook-form'
import { WineFormData, wineFormSchema } from './wine-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateWineRequest, IWines } from '@/modules/wine/list/entities/types/types'

interface UseWineFormProps {
  initialData?: Partial<WineFormData> | CreateWineRequest | IWines
}

export const useWineForm = ({ initialData }: UseWineFormProps = {}) => {
  const formData = initialData ? mapDataToFormData(initialData) : undefined

  const form = useForm({
    resolver: zodResolver(wineFormSchema),
    defaultValues: {
      id: formData?.id || '',
      name: formData?.name || '',
      vintage: formData?.vintage || null,
      countryId: formData?.countryId || null,
      regionId: formData?.regionId || null,
      typeId: formData?.typeId || null,
      colorId: formData?.colorId || null,
      producer: formData?.producer || '',
      grapeVariety: formData?.grapeVariety || '',
      image: formData?.image ?? null,
    },
  })

  return form
}

const mapDataToFormData = (data: Partial<WineFormData> | CreateWineRequest | IWines): Partial<WineFormData> => {
  if (isIWines(data)) {
    return mapIWinesToFormData(data)
  }
  if (isCreateWineRequest(data)) {
    return mapCreateWineRequestToFormData(data)
  }
  return data as Partial<WineFormData>
}

const isIWines = (data: any): data is IWines => {
  return data && typeof data === 'object' && 'id' in data && 'name' in data
}

const isCreateWineRequest = (data: any): data is CreateWineRequest => {
  return data && typeof data === 'object' && 'name' in data
}

export const mapIWinesToFormData = (wine: IWines): Partial<WineFormData> => {
  return {
    id: wine.id || '',
    name: wine.name || '',
    vintage: wine.vintage ?? null,
    producer: wine.producer || '',
    grapeVariety: wine.grapeVariety || '',
    countryId: wine.country?.id ? Number(wine.country.id) : null,
    regionId: wine.region?.id ? Number(wine.region.id) : null,
    typeId: wine.type?.id ? Number(wine.type.id) : null,
    colorId: wine.color?.id ? Number(wine.color.id) : null,
    image: wine.image ? mapImageToFormData(wine.image) : null,
  }
}

export const mapCreateWineRequestToFormData = (data: CreateWineRequest): Partial<WineFormData> => {
  const wine = data as IWines
  return {
    id: wine.id || '',
    name: wine.name || '',
    vintage: wine.vintage ?? null,
    producer: wine.producer || '',
    grapeVariety: wine.grapeVariety || '',
    countryId: wine.country?.id ? Number(wine.country.id) : null,
    regionId: wine.region?.id ? Number(wine.region.id) : null,
    typeId: wine.type?.id ? Number(wine.type.id) : null,
    colorId: wine.color?.id ? Number(wine.color.id) : null,
    image: wine.image ? mapImageToFormData(wine.image) : null,
  }
}

const mapImageToFormData = (image: any): any => {
  if (!image) return null

  if (image instanceof File) return image

  const url = image.originalUrl || image.url || image.smallUrl || image.mediumUrl
  const name = image.originalName || image.name || image.alt || 'image.jpg'
  const mimeType = image.mimetype || image.type || 'image/jpeg'
  const size = image.fileSize || image.size || 0

  if (!url) return null

  const fileLikeObject = {
    name: name,
    type: mimeType,
    size: size,
    lastModified: Date.now(),

    slice: () => new Blob(),
    stream: () => new ReadableStream(),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    text: () => Promise.resolve(''),

    preview: url,
    id: image.id || '',
    url: url,
    _isExistingImage: true,

    __proto__: File.prototype,
  }

  Object.setPrototypeOf(fileLikeObject, File.prototype)

  return fileLikeObject
}

export const mapFormDataToUpdateRequestSimple = (data: WineFormData): FormData => {
  const formData = new FormData()

  const fields = ['name', 'vintage', 'countryId', 'regionId', 'typeId', 'colorId', 'producer', 'grapeVariety']

  fields.forEach(field => {
    const value = data[field as keyof WineFormData]
    formData.append(field, value?.toString() || '')
  })

  if (data.image instanceof File) {
    formData.append('image', data.image)
  } else if (data.image === null) {
    formData.append('image', '')
  }

  return formData
}
